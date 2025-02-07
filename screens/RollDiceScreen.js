import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

const DiceFace = ({ number }) => {
  const renderDots = (number) => {
    const dotPositions = {
      1: [{ top: "50%", left: "50%" }],
      2: [
        { top: "20%", left: "20%" },
        { top: "80%", left: "80%" },
      ],
      3: [
        { top: "20%", left: "20%" },
        { top: "50%", left: "50%" },
        { top: "80%", left: "80%" },
      ],
      4: [
        { top: "20%", left: "20%" },
        { top: "20%", left: "80%" },
        { top: "80%", left: "20%" },
        { top: "80%", left: "80%" },
      ],
      5: [
        { top: "20%", left: "20%" },
        { top: "20%", left: "80%" },
        { top: "50%", left: "50%" },
        { top: "80%", left: "20%" },
        { top: "80%", left: "80%" },
      ],
      6: [
        { top: "20%", left: "20%" },
        { top: "20%", left: "50%" },
        { top: "20%", left: "80%" },
        { top: "80%", left: "20%" },
        { top: "80%", left: "50%" },
        { top: "80%", left: "80%" },
      ],
    };

    return dotPositions[number]?.map((position, index) => (
      <View key={index} style={[styles.dot, position]} />
    ));
  };

  return <View style={styles.face}>{renderDots(number)}</View>;
};

const RollDiceScreen = ({ setRandomNumber }) => {
  const [rotateAnimation] = useState(new Animated.Value(0));
  const [message, setMessage] = useState("");
  const [currentNumber, setCurrentNumber] = useState(1);

  const rollDice = () => {
    // Start the dice animation
    Animated.sequence([
      // Spin to simulate roll/revolve effect
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Random number generation
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    setRandomNumber(randomNumber);
    setCurrentNumber(randomNumber);
    // Set message with the number of dots
    setMessage(`Dice rolled: ${randomNumber}`);
  };

  // Transform the rotateAnimation to rotate 360 degrees
  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Dice container with animation */}
      <TouchableOpacity onPress={rollDice}>
        <Animated.View
          style={[styles.dice, { transform: [{ rotate: rotation }] }]}
        >
          <DiceFace number={currentNumber} />
        </Animated.View>
      </TouchableOpacity>

      {/* Message displaying the rolled number */}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dice: {
    width: 40, // Reduced size
    height: 40, // Reduced size
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 30,
    position: "relative",
  },
  face: {
    position: "absolute",
    width: 40, // Reduced size
    height: 40, // Reduced size
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
  dot: {
    width: 4, // Reduced dot size
    height: 4, // Reduced dot size
    backgroundColor: "black",
    borderRadius: 4 / 2,
    position: "absolute",
  },
  message: {
    fontSize: 20,
    color: "blue",
  },
});

export default RollDiceScreen;
