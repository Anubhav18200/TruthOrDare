import React from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity} from 'react-native';

  
export default function EndGameScreen({route, navigation }) {

  const { players } = route.params;

  // Sort players by their position
  const sortedPlayers = players.sort((a, b) => a.finalPosition - b.finalPosition);

  const findMostDaringPlayer = () => {
    // Example function to determine the most daring player
    return players.reduce((prev, current) => prev.daringPoints > current.daringPoints ? prev : current).name;
  };

  const findFastestRoller = () => {
    // Example function to determine the fastest roller
    return players.reduce((prev, current) => prev.rollTime < current.rollTime ? prev : current).name;
  };

  const shareResults = (players) => {
    // Logic to share results (e.g., social media, messaging)
    console.log("Results shared", players);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Game Over!</Text>
      <Text style={styles.subheading}>Final Rankings:</Text>
      
      {sortedPlayers.map((player, index) => (
        <View key={player.name} style={styles.playerRow}>
          <Text style={styles.rank}>{index + 1}:</Text>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerPosition}>Position: {player.finalPosition}</Text>
        </View>
      ))}

      {/* Display additional fun stats */}
      <Text style={styles.subheading}>Fun Stats:</Text>
      <View>
        <Text>Most Daring Player: {findMostDaringPlayer()}</Text>
        <Text>Fastest Dice Roller: {findFastestRoller()}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => shareResults(sortedPlayers)}
      >
        <Text style={styles.buttonText}>Share Results</Text>
      </TouchableOpacity>
    </View>
  );
};

// Helper function for sharing results

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 20,
    marginVertical: 10,
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  playerName: {
    fontSize: 18,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
