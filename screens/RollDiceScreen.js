import React,{useState} from "react";
import { View, StyleSheet,Text } from "react-native";
import { WebView } from "react-native-webview";
import GameBoardScreen from "./GameBoardScreen";

const RollDiceScreen = ({setRandomNumber}) => {
  // const [randomNumber, setRandomNumber] = useState(null); // Store the random number
  // Handle messages sent from the WebView
  const onWebViewMessage = (event) => {
    const randomValue = parseInt(event.nativeEvent.data); // Parse the message to integer
    setRandomNumber(randomValue); // Update the state with the new random value
  };
  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={require("../assets/dice.html")} // Path to your local HTML file
        javaScriptEnabled={true} // Enable JavaScript if needed for functionality
        domStorageEnabled={true} // Enable local storage if your HTML uses it
        onMessage={onWebViewMessage}
      />

      {/* {randomNumber !== null && (
        <Text style={{ fontSize: 24, marginTop: 20 }}>
          You rolled a {randomNumber}
        </Text>
      )}
      <GameBoardScreen randomNumber={randomNumber} /> */}
    </View>
  );
};

export default RollDiceScreen;
