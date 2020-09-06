import React, { Component } from "react";

import { View, TextInput, Button, ScrollView } from "react-native";
//import DatePicker from "react-native-datepicker";
import DropDownPicker from "react-native-dropdown-picker";

export default class EditCalendar extends Component {
  constructor(props) {
    super(props);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      date: "",
      name: "",
      items: [],
      item: "",
    };
    this.controller;
  }

  componentDidMount() {
    // fetch("http://192.168.0.176:9000/api/fitness")
    //fetch("http://192.168.178.23:9000/api/fitness")
    fetch("http://192.168.178.23:9000/api/dropdown")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ items: data });
      });
    /*this.setState({
      date: this.props.route.params.date,
    });*/
  }
  onChangeDate = (text) => {
    this.setState({
      date: text,
    });
  };
  onChangeName = (text) => {
    this.setState({
      name: text,
    });
  };

  handleSubmit() {
    //id = this.props.route.params.course.id;
    fetch(
      "http://192.168.178.23:9000/api/fitnessevent/" +
        this.props.route.params.id,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: this.state.date,
          name: this.state.name,
        }),
      }
    )
      .then((res) => res.json())
      .catch((error) => {
        throw error;
      });
    this.props.navigation.goBack("FitnessplanAdmin");
    console.log("Edited");
  }

  render() {
    const item = (
      <View>
        {this.state.items.map((item) => (
          <View key={item.value}></View>
        ))}
      </View>
    );
    //console.log(this.props.route.params.name);
    return (
      <ScrollView>
        <DropDownPicker
          //key={item.value}
          items={this.state.items}
          controller={(instance) => (this.controller = instance)}
          onChangeList={(items, callback) => {
            this.setState(
              {
                items: items, // items: items
              },
              callback
            );
          }}
          //defaultValue={this.state.countries}
          containerStyle={{ height: 40 }}
          style={{ backgroundColor: "#fafafa" }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
          onChangeItem={(item) =>
            this.setState({
              name: item.value,
            })
          }
        />
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            width: 300,
          }}
          onChangeText={(text) => this.onChangeDate(text)}
          placeholder="2020-09-04"
        />
        <Button title="Edit" onPress={() => this.handleSubmit()}></Button>
      </ScrollView>
    );
  }
}

//export default Home;