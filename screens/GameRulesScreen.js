// GameRulesScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function GameRulesScreen({ navigation }) {
  return (
    <LinearGradient colors={["#000428", "#004e92"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Game Rules</Text>
        <Text style={styles.rulesText}>
          1. Minimum 2 players and maximum 6 players are required to play.
        </Text>
        <Text style={styles.rulesText}>
          2. You have to select the game mode according to your environment.
        </Text>
        <Text style={styles.rulesText}>
          3. Each player rolls the dice and the number that is displayed is the
          number of steps the player's token will move.
        </Text>
        <Text style={styles.rulesText}>
          4. If a players lands on a gift, he will get reward or penalty
          randomly.
        </Text>
        <Text style={styles.rulesText}>
          5. The player has to select the "Truth" or "Dare" option. Choosing
          Truth is allowed only 3 times per player.
        </Text>
        <Text style={styles.rulesText}>
          6. If the player chooses "Truth", they must answer a question
          honestly.
        </Text>
        <Text style={styles.rulesText}>
          7. If the player chooses "Dare", they have the option to select easy,
          medium or hard challenge. On the basis of the level chosen, you will
          get the reward or penalty. For example, an easy challenge gives less
          reward and more penalty, while a hard challenge gives more reward and
          less penalty.
        </Text>
        <Text style={styles.rulesText}>
          8. Depending on the challenge, the players gets the dare and after
          completing the player has to click the button of Challenge completed.
        </Text>
        <Text style={styles.rulesText}>
          8. The penalty or reward awarded to the player is displayed on the
          screen and it is the number of steps the player will move forward or
          backward.
        </Text>
        <Text style={styles.rulesText}>
          9. The game continues until all players decide to stop or 
          all players have reached 100 position.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Game</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
   //marginTop: height - 700,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  rulesText: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 15,
    lineHeight: 25,
  },
  button: {
    backgroundColor: "#00b09b",
    borderRadius: 15,
    padding: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
