import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>Truth or Dare Twisted!</Text>
        <Text style={styles.subtitle}>Are you brave enough to face the unexpected?</Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddPlayers')}
        >
          <Text style={styles.buttonText}>Accept the Challenge</Text>
          <Text style={styles.buttonSubtext}>If you dare...</Text>
        </TouchableOpacity>

        <View style={styles.decorationContainer}>
          <View style={[styles.decorationDot, { backgroundColor: '#FF4081' }]} />
          <View style={[styles.decorationDot, { backgroundColor: '#FF80AB' }]} />
          <View style={[styles.decorationDot, { backgroundColor: '#FF1744' }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde8e8',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20
  },
  logo: {
    width: width * 0.8,
    height: width * 0.6,
    resizeMode: 'contain',
    marginBottom: 30
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4081',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 64, 129, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  subtitle: {
    fontSize: 18,
    color: '#FF80AB',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    letterSpacing: 0.5
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  button: {
    backgroundColor: '#FF1744',
    width: '90%',
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#FF1744',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#FF4081'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  buttonSubtext: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.9
  },
  decorationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  decorationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.9
  }
});