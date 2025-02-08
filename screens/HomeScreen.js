import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
const giftIcon = require("../assets/ex1.gif");
import { WebView } from 'react-native-webview';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <WebView 
          source={require('../assets/ex1.gif')} 
          style={styles.logo}
        />
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
    backgroundColor: 'rgb(29, 185, 177)',  // Updated to a more accurate teal color
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
    width: width * 1,
    height: width * 0.8,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    letterSpacing: 0.5
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
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF4081'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 30,
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
  },
  decorationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.9
  }
});