import React, { Component } from "react";

import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button } from "react-native-elements";

export default class AddCourse extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: "",
      price: "",
      description: "",
    };
  }

  componentDidMount() {}

  onChangeName = (text) => {
    this.setState({
      name: text,
    });
  };
  onChangePrice = (text) => {
    this.setState({
      price: text,
    });
  };
  onChangeDescription = (text) => {
    this.setState({
      description: text,
    });
  };
  handleSubmit() {
    //fitness.preventDefault();
    fetch("http://192.168.178.23:9000/api/addCourse", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        price: this.state.price,
        description: this.state.description,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
    this.props.navigation.goBack("FitnessinfoAdmin");
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Add Screen</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            width: 300,
          }}
          onChangeText={(text) => this.onChangeName(text)}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            width: 300,
          }}
          onChangeText={(text) => this.onChangePrice(text)}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            width: 300,
          }}
          onChangeText={(text) => this.onChangeDescription(text)}
        />
        <Button title="Add" onPress={() => this.handleSubmit()}></Button>
      </View>
    );
  }
}
