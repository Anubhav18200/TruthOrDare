import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddPlayers')}>
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FDE8E8' 
  },
  logo: { 
    width: 550,  // Adjust the width as needed
    height: 250, // Adjust the height as needed
    marginBottom: 20,
    resizeMode: 'contain'
  },
  button: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 12, 
    paddingHorizontal: 40, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.3, 
    shadowOffset: { width: 2, height: 2 },
    elevation: 5, 
    top: 40,
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
