import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./Navigation/AppNavigator";

export default function App() {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <AppNavigator />
    </>
  );
}
