import React, { Component } from "react";

import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { styles, buttons } from '../styles';

export default class FitnessplanAdmin extends Component {
  constructor(props) {
    super(props);
    this._deleteEvent = this._deleteEvent.bind(this);
    this.loadEvents = this.loadEvents.bind(this);
    this.state = {
      events: [],
      eventsFormatted: {},
      search: "",
    };
  }

  componentDidMount() {
    this.loadEvents();
    this.focusListener = this.props.navigation.addListener("focus", () =>
      this.loadEvents()
    );
  }

  componentWillUnmount() {
    this.focusListener();
  }

  loadEvents = (day) => {
    const url = this.props.route.params.url;
    if (!this.props.route.params.en) {
      fetch(url + "/fitnessevents")
        .then((response) => response.json())
        .then((events) => {
          //console.log(`events: ${JSON.stringify(events)}`);
          return events;
        })
        .then((events) => {
          this.setState({ events: events });
          var eventsFormatted = {};
          if (events.length) {
            events.map((event) => {
              let day = event.date; //.toDate().toISOString().split("T")[0]; // Format to YYYY-MM-DD
              if (eventsFormatted[day]) {
                eventsFormatted[day].push(event);
              } else {
                eventsFormatted[day] = [event];
              }
            });
            this.setState({
              eventsFormatted: eventsFormatted,
            });
            // console.log(`eventsFormatted: ${JSON.stringify(eventsFormatted)}`);
          }
        });
    } else {
      fetch(url + "/fitnessevents/en")
        .then((response) => response.json())
        .then((events) => {
          //console.log(`events: ${JSON.stringify(events)}`);
          return events;
        })
        .then((events) => {
          this.setState({ events: events });
          var eventsFormatted = {};
          if (events.length) {
            events.map((event) => {
              let day = event.date; //.toDate().toISOString().split("T")[0]; // Format to YYYY-MM-DD
              if (eventsFormatted[day]) {
                eventsFormatted[day].push(event);
              } else {
                eventsFormatted[day] = [event];
              }
            });
            this.setState({
              eventsFormatted: eventsFormatted,
            });
            // console.log(`eventsFormatted: ${JSON.stringify(eventsFormatted)}`);
          }
        });
    }
  };

  _deleteEvent(id) {
    const events = this.state.events;
    const url = this.props.route.params.url;
    if (!this.props.route.params.en) {
      fetch(url + "/fitnessevents/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          this.setState({
            events: events.filter((event) => event.id !== id),
          });
          return;
        })
        .catch((error) => {
          throw error;
        });
      this.loadEvents();
      console.log("Gelöscht");
    } else {
      fetch(url + "/fitnessevents/en/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          this.setState({
            events: events.filter((event) => event.id !== id),
          });
          return;
        })
        .catch((error) => {
          throw error;
        });
      this.loadEvents();
      console.log("Deleted");
    }
  }

  handleSearch = (text) => {
    if (text) {
      const newData = this.state.events.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        events: newData,
        search: text,
      });
      var eventsFormatted = {};
      if (this.state.events.length) {
        this.state.events.map((event) => {
          let day = event.date; //.toDate().toISOString().split("T")[0]; // Format to YYYY-MM-DD

          if (eventsFormatted[day]) {
            eventsFormatted[day].push(event);
          } else {
            eventsFormatted[day] = [event];
          }
        });
        this.setState({
          eventsFormatted: eventsFormatted,
        });
      }
    } else {
      this.setState({ search: "" });
      this.loadEvents();
    }
  };

  renderItem(item) {
    // console.log(item.name);
    if (!this.props.route.params.en) {
      return (
        <View>
          <Text style={styles.textField}>{item.name} {"\n"}
          <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent: "center",}}>
          <TouchableOpacity style={buttons.button4}
            onPress={() =>
              this.props.navigation.navigate("EditCalendar", {
                id: item.id,
                name: item.name,
                date: item.date,
              })
            }
          >
            <Text style={buttons.buttontext}>Bearbeiten</Text>
          </TouchableOpacity>
          <TouchableOpacity style={buttons.button5}
            onPress={() => this._deleteEvent(item.id)}
          >
            <Text style={buttons.buttontext}>Löschen</Text>
          </TouchableOpacity>
        </View>
        </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.textField}>{item.name} {"\n"}
          <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent: "center",}}>
          <TouchableOpacity style={buttons.button4}
            onPress={() =>
              this.props.navigation.navigate("EditCalendar", {
                id: item.id,
                name: item.name,
                date: item.date,
                url: this.props.route.params.url,
                en: this.props.route.params.en,
              })
            }
          >
            <Text style={buttons.buttontext}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={buttons.button5}
            onPress={() => this._deleteEvent(item.id)}
          >
            <Text style={buttons.buttontext}> Delete</Text>
          </TouchableOpacity>
        </View>
        </Text>
        </View>
      );
    }
  }

  renderEmptyDate() {
    return (
      <View style={styles.layout}>
        <Text style={styles.textField}>This is empty date!</Text>
      </View>
    );
  }

  render() {
    const eventsFormatted = this.state.eventsFormatted;
    if (!this.props.route.params.en) {
      return (
        <View style={styles.layout}>
          <TextInput style={styles.textInput}
            placeholder="Nach Kurs suchen..."
            autoCorrect={false}
            onChangeText={(text) => {
              this.handleSearch(text);
            }}
            value={this.state.search}
          />
          <TouchableOpacity style={buttons.button3}
            onPress={() =>
              this.props.navigation.navigate("AddToCalendar", {
                en: this.props.route.params.en,
                url: this.props.route.params.url,
              })
            }
          >
            <Text style={buttons.buttontext}>Kurs zum Kalendar hinzufügen</Text>
          </TouchableOpacity>
          <Agenda
            items={eventsFormatted}
            loadItemsForMonth={this.loadEvents.bind(this)}
            renderItem={this.renderItem.bind(this)}
            renderEmptyData={() => null}
            renderEmptyDate={this.renderEmptyDate.bind(this)}
            events={this.state.eventsFormatted}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.layout}>
          <TextInput style={styles.textInput}
            placeholder="Search for a course..."
            autoCorrect={false}
            onChangeText={(text) => {
              this.handleSearch(text);
            }}
            value={this.state.search}
          />
          <TouchableOpacity style={buttons.button3}
            onPress={() =>
              this.props.navigation.navigate("AddToCalendar", {
                en: this.props.route.params.en,
                url: this.props.route.params.url,
              })
            }
          >
          <Text style={buttons.buttontext}>Add Course to Calendar</Text>
          </TouchableOpacity>
          <Agenda
            items={eventsFormatted}
            loadItemsForMonth={this.loadEvents.bind(this)}
            renderItem={this.renderItem.bind(this)}
            renderEmptyData={() => null}
            renderEmptyDate={this.renderEmptyDate.bind(this)}
            events={this.state.eventsFormatted}
          />
        </View>
      );
    }
  }
}

