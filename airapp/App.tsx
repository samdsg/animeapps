import React from "react";
import {
  StyleSheet, View,
} from "react-native";

import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";

import { downloadImagesAsync } from "./components/Images";
import Home from "./components/Home";
import Tabbar from "./components/Tabbar";

interface AppProps {}
interface AppState {
  ready: boolean;
}

const steps = [{
  x: 0,
  y: 0,
  label: "Explore what the app has to offer. Choose between homes, experiences, restaurants, and more.",
}, {
  x: 0,
  y: 0,
  label: "Find the best accomodation in your favorite city.",
},
{
  x: 0,
  y: 0,
  label: "Explore the most popular cities.",
}];

export default class App extends React.Component<AppProps, AppState> {
  home = React.createRef();

  state = {
    ready: false,
  };

  async componentDidMount() {
    await Promise.all([downloadImagesAsync(), this.downloadFontsAsync()]);
    this.setState({ ready: true });
  }

  downloadFontsAsync = () => Font.loadAsync({
    "SFProDisplay-Bold": require("./assets/fonts/SF-Pro-Display-Bold.otf"),
    "SFProDisplay-Semibold": require("./assets/fonts/SF-Pro-Display-Semibold.otf"),
    "SFProDisplay-Regular": require("./assets/fonts/SF-Pro-Display-Regular.otf"),
    "SFProDisplay-Light": require("./assets/fonts/SF-Pro-Display-Light.otf"),
  });

  render() {
    const { ready } = this.state;
    if (!ready) {
      return (
        <AppLoading />
      );
    }
    return (
      <View style={styles.container}>
        <Home />
        <Tabbar />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
