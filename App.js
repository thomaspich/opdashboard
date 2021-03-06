import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, StatusBar, TextInput } from "react-native";
import KeyEvent from "react-native-keyevent";
import { Container, Header, Content, Tab, Tabs } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import { ProgressCircle } from "react-native-svg-charts";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import Svg, { Circle, G, Line, Rect, Mask, text } from "react-native-svg";
import HeaderX from "./src/components/HeaderX";
import io from "socket.io-client";
import { LogBox } from "react-native";

import { SpeedWidget } from "./src/components/SpeedWidget";

//import io from "socket.io-client/dist/socket.io.js";
// const socket = io("http://192.168.178.21:5000", {
//   transports: ["polling"],
// });
const socket = io("http://192.168.178.21:5000", {
  transports: ["websocket"],
});
// const socket = io.connect("http://192.168.178.21:5000", {
//   transports: ["websocket"],
// });

const keyMap = {
  19: "UP",
  20: "DOWN",
  21: "LEFT",
  22: "RIGHT",
  97: "A",
  99: "B",
  96: "C",
  100: "D",
  102: "OK",
  103: "CANCEL",
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)",
  },
  mainContainer: {
    alignSelf: "center",
  },
  headerX: {
    height: 80,
    elevation: 15,
    shadowOffset: {
      height: 7,
      width: 1,
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  grid: {
    backgroundColor: "#0D0D0D",
  },

  subContainer: {
    height: "98%",
    width: "98%",
    top: "1%",
    backgroundColor: "#121212",
    alignSelf: "center",
  },
  rect5: {
    flex: 0.5,
    justifyContent: "center",
  },
});

export default class App extends React.Component {
  map = {};

  componentDidMount() {
    KeyEvent.onKeyDownListener((keyEvent) => {
      this.handlerKeyEvents(keyEvent);
    });
    KeyEvent.onKeyUpListener((keyEvent) => {
      this.handlerKeyEvents(keyEvent);
    });

    LogBox.ignoreLogs(["Setting a timer"]);
    socket.connect();

    socket.on("connect", () => {
      //      console.log("connected to socket server");
    });
    socket.on("speed value", (msg) => {
      //    console.log(msg);
      var z = msg / 100;

      this.setState({ speedValue: z });
    });
  }

  handlerKeyEvents(keyEvent) {
    if (
      this.map[keyMap[keyEvent.keyCode]] != keyEvent.action ||
      this.map[keyMap[keyEvent.keyCode]] == null
    ) {
      this.map[keyMap[keyEvent.keyCode]] = keyEvent.action;
      // console.log(keyMap[keyEvent.keyCode] + keyEvent.action);
      this.setState({ myState: keyEvent.keyCode });
      //this.setState({ graphValue: this.graphValue + 0.1 });
    }
    var x = this.state.graphValue;
    var y = this.state.speed;
    //  console.log("hello" + this.map[keyMap[keyEvent.keyCode]]);
    //  console.log("hello" + keyMap[keyEvent.keyCode]);
    if (keyMap[keyEvent.keyCode] == "UP") {
      x = x + 0.01;
      y = y + 1;
    } else {
      x = x - 0.01;
      y = y - 1;
      socket.emit("chat message", keyEvent);
    }
    console.log(x);
    this.setState({ graphValue: x });
    this.setState({ speed: y });
  }

  state = {
    graphValue: 0.3,
    speedValue: 0.9,
    speed: 30,
    chatMessage: "",
    chatMessages: [],
  };

  render() {
    return (
      <Grid style={styles.grid}>
        <Row size={2} style={styles.mainContainer}>
          <SpeedWidget
            maxSpeed={this.state.speed}
            curSpeed={this.state.speed}
          />
        </Row>
        <Row size={1}>
          <Col>
            <View style={styles.subContainer}></View>
          </Col>
          <Col>
            <View style={styles.subContainer}></View>
          </Col>
        </Row>
        <Row size={1}>
          <Col>
            <View style={styles.subContainer}></View>
          </Col>
          <Col>
            <View style={styles.subContainer}></View>
          </Col>
        </Row>
      </Grid>
    );
  }
}
