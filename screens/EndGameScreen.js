import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function EndGameScreen({ route, navigation }) {
  const { players } = route.params;
  const sortedPlayers = players.sort((a, b) => a.finalPosition - b.finalPosition);

  const findMostDaringPlayer = () => {
    return players.reduce((prev, current) => prev.daringPoints > current.daringPoints ? prev : current).name;
  };

  const findFastestRoller = () => {
    return players.reduce((prev, current) => prev.rollTime < current.rollTime ? prev : current).name;
  };

  const shareResults = (players) => {
    console.log("Results shared", players);
  };

  const getMedalColor = (position) => {
    switch (position) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#E0E0E0'; // Grey for other positions
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.confettiContainer}>
          <Text style={styles.heading}>🎉 Game Over! 🎉</Text>
        </View>

        <View style={styles.podiumContainer}>
          {sortedPlayers.slice(0, 3).map((player, index) => (
            <View 
              key={player.name} 
              style={[
                styles.podiumStep,
                { 
                  height: [120, 150, 90][index],
                  backgroundColor: getMedalColor(index + 1)
                }
              ]}
            >
              <Text style={styles.podiumPosition}>{index + 1}</Text>
              <Text style={styles.podiumName}>{player.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.rankingsCard}>
          <Text style={styles.cardTitle}>Final Rankings</Text>
          {sortedPlayers.map((player, index) => (
            <View key={player.name} style={styles.playerRow}>
              <View style={[styles.rankBadge, { backgroundColor: getMedalColor(index + 1) }]}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerPosition}>Position {player.finalPosition}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Game Stats</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🎲</Text>
              <Text style={styles.statLabel}>Most Daring</Text>
              <Text style={styles.statValue}>{findMostDaringPlayer()}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statLabel}>Fastest Roller</Text>
              <Text style={styles.statValue}>{findFastestRoller()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.playAgainButton]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>🎮 Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={() => shareResults(sortedPlayers)}
          >
            <Text style={styles.buttonText}>📤 Share Results</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  confettiContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 30,
  },
  podiumStep: {
    width: 100,
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  podiumPosition: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  rankingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playerName: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  playerPosition: {
    fontSize: 16,
    color: '#666',
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  shareButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});