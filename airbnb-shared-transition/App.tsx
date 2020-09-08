import React from "react";
import { StatusBar } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";


import { LoadAssets, StyleGuide } from "./src/components";

import Airbnb, {
  assets as airbnbAssets,
  fonts as airbnbFonts,
} from "./src/Airbnb";

enableScreens();

const fonts = { ...airbnbFonts };

const assets: number[] = [];

const AppNavigator = createAppContainer(
  createStackNavigator(
    {
      Airbnb: {
        screen: Airbnb,
        navigationOptions: {
          title: "Airbnb",
          header: () => null,
        },
      },
    },
    {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: StyleGuide.palette.primary,
          borderBottomWidth: 0,
        },
        headerTintColor: "white",
      },
    }
  )
);

export default () => (
  <LoadAssets {...{ assets, fonts }}>
    <StatusBar barStyle="light-content" />
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  </LoadAssets>
);
