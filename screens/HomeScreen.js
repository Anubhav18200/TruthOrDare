import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { loadMusic, playMusic,stopMusic } from '../Data/MusicService'; // Import MusicService

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    const setupMusic = async () => {
      await loadMusic();  // Load the music
      await playMusic();  // Play the music
    };
    setupMusic();

    return () => {
      stopMusic();  // Stop the music when navigating away
    };
  }, []); 


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => navigation.navigate('GameRules')}
      >
        <Text style={styles.infoButtonText}>?</Text>
      </TouchableOpacity>
      <View style={styles.topSection}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.subtitle}>Are you brave enough to face the unexpected?</Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddPlayers')}
      >
        <Text style={styles.buttonText}>Play</Text>
        <Text style={styles.buttonSubtext}>If you dare...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(29, 185, 177)',  // Updated teal color
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  logo: {
    width,
    height: width * 0.8,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#FF1744',
    width: '90%',
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF4081',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonSubtext: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  infoButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});