// GameRulesScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

export default function GameRulesScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#000428', '#004e92']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Game Rules</Text>
        <Text style={styles.rulesText}>
          1. Players take turns to choose either "Truth" or "Dare".
        </Text>
        <Text style={styles.rulesText}>
          2. If the player chooses "Truth", they must answer a question honestly.
        </Text>
        <Text style={styles.rulesText}>
          3. If the player chooses "Dare", they must complete a task given by another player.
        </Text>
        <Text style={styles.rulesText}>
          4. The game continues until all players decide to stop or one player reaches a specific goal.
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
    marginTop: height - 700,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  rulesText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 15,
    lineHeight: 25,
  },
  button: {
    backgroundColor: '#00b09b',
    borderRadius: 15,
    padding: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
