import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./Navigation/AppNavigator";
import { View, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
