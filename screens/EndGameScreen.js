import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av"; // Import Audio for background music
import { useRef } from "react";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function EndGameScreen({ route, navigation }) {
  const { players } = route.params;
  //const [sound, setSound] = React.useState(); // To manage the sound object
  const sortedPlayers = players.sort(
    (a, b) => a.finalPosition - b.finalPosition
  );
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const musicSound = useRef(new Audio.Sound()); // To keep track of the audio

  const viewShotRef = useRef();

  // Handle Play Again
  const handlePlayAgain = () => {
    musicSound.current.stopAsync(); // Stop the audio immediately
    musicSound.current.unloadAsync(); // Unload the audio to avoid it continuing to play in the background
    navigation.navigate("Home"); // Navigate to Home or the appropriate screen
  };

  useEffect(() => {
    // Load and play music when the screen loads
    async function playMusic() {
      try {
        await musicSound.current.loadAsync(require("../assets/end_game.mp3"));
        await musicSound.current.playAsync();
      } catch (error) {
        console.log("Error loading audio: ", error);
      }
    }

    playMusic();

    // Cleanup the music when the screen is unmounted or when navigating away
    return () => {
      musicSound.current.stopAsync();
      musicSound.current.unloadAsync(); // Proper cleanup
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Stop the audio before navigating away
      musicSound.current.stopAsync();
      musicSound.current.unloadAsync();
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const findMostDaringPlayer = () => {
    return players.reduce((prev, current) =>
      prev.daringPoints > current.daringPoints ? prev : current
    ).name;
  };

  const findFastestRoller = () => {
    return players.reduce((prev, current) =>
      prev.rollTime < current.rollTime ? prev : current
    ).name;
  };

  const shareResultsAsImage = async () => {
    try {
      // Capture the ViewShot component
      const uri = await viewShotRef.current.capture();

      // Save the image
      const fileUri = FileSystem.documentDirectory + "game_results.png";
      await FileSystem.copyAsync({ from: uri, to: fileUri });

      // Share the image
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        alert("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error capturing and sharing image:", error);
    }
  };

  const getMedalEmoji = (position) => {
    switch (position) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🎮";
    }
  };

  const gameHighlights = [
    { icon: "🌟", title: "The Open Book", player: sortedPlayers[0].name },
    {
      icon: "🎯",
      title: "Most Dares Completed",
      player: findMostDaringPlayer(),
    },
    {
      icon: "⚡",
      title: "Lightning-Fast Thinker",
      player: findFastestRoller(),
    },
    {
      icon: "🎭",
      title: "Best Performance",
      player:
        sortedPlayers[Math.floor(Math.random() * sortedPlayers.length)].name,
    },
  ];

  return (
    <ViewShot
      ref={viewShotRef}
      style={{ flex: 1 }}
      options={{ format: "png", quality: 1 }}
    >
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View
            style={[styles.header, { transform: [{ scale: scaleAnim }] }]}
          >
            <Text style={styles.heading}>Game Complete!</Text>
            <Text style={styles.subheading}>Truth or Dare Champions</Text>
          </Animated.View>

          <Animated.View
            style={[styles.podiumContainer, { opacity: fadeAnim }]}
          >
            {sortedPlayers.slice(0, 3).map((player, index) => (
              <LinearGradient
                key={player.name}
                colors={
                  index === 0
                    ? ["#FFD700", "#FFA000"]
                    : index === 1
                    ? ["#C0C0C0", "#9E9E9E"]
                    : ["#CD7F32", "#8D6E63"]
                }
                style={[styles.podiumStep, { height: [180, 140, 100][index] }]}
              >
                <Text style={styles.medalEmoji}>
                  {getMedalEmoji(index + 1)}
                </Text>
                <Text style={styles.podiumName}>{player.name}</Text>
                <Text style={styles.podiumPosition}>#{index + 1}</Text>
              </LinearGradient>
            ))}
          </Animated.View>

          <View style={styles.statsContainer}>
            <LinearGradient
              colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
              style={styles.statsCard}
            >
              <Text style={styles.statsTitle}>🏆 Game Achievements</Text>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🔥</Text>
                  <Text style={styles.statLabel}>Most Daring</Text>
                  <Text style={styles.statValue}>{findMostDaringPlayer()}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>⚡</Text>
                  <Text style={styles.statLabel}>Fastest Player</Text>
                  <Text style={styles.statValue}>{findFastestRoller()}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.playAgainButton]}
              onPress={handlePlayAgain}
            >
              <LinearGradient
                colors={["#00b09b", "#96c93d"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Play Again 🎮</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareResultsAsImage}
            >
              <Text style={styles.buttonText}>📸 Share as Image</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.highlightsContainer}>
            <Text style={styles.highlightsTitle}>✨ Game Highlights ✨</Text>
            {gameHighlights.map((highlight, index) => (
              <LinearGradient
                key={index}
                colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
                style={styles.highlightCard}
              >
                <View style={styles.highlightIconContainer}>
                  <Text style={styles.highlightIcon}>{highlight.icon}</Text>
                </View>
                <View style={styles.highlightContent}>
                  <Text style={styles.highlightTitle}>{highlight.title}</Text>
                  <Text style={styles.highlightPlayer}>{highlight.player}</Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </ViewShot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  resultsContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 30,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subheading: {
    fontSize: 18,
    color: "#FFFFFF",
    opacity: 0.8,
    marginTop: 5,
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 200,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  podiumStep: {
    width: 100,
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  medalEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  podiumName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  podiumPosition: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 15,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  highlightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  highlightsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  highlightIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  highlightIcon: {
    fontSize: 24,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  highlightPlayer: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    margin: 8,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
});
