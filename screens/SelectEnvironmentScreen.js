import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons

export default function SelectEnvironmentScreen({ route, navigation }) {
  const { players } = route.params;
  const [selectedEnv, setSelectedEnv] = useState(null);

  const environments = [
    { name: 'Home', icon: 'home' },
    { name: 'Office', icon: 'briefcase' },
    { name: 'Party', icon: 'beer' },
    { name: 'School', icon: 'school' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Game Environment</Text>

      {environments.map((env) => (
        <TouchableOpacity
          key={env.name}
          style={[styles.button, selectedEnv === env.name && styles.selected]}
          onPress={() => setSelectedEnv(env.name)}
        >
          <Ionicons name={env.icon} size={24} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>{env.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.nextButton, !selectedEnv && styles.disabled]}
        disabled={!selectedEnv}
        onPress={() => navigation.navigate('GameBoard', { players, environment: selectedEnv })}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFE4C4', 
    paddingHorizontal: 20 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#4E342E' 
  },
  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FF9800', 
    padding: 15, 
    borderRadius: 10, 
    marginVertical: 7, 
    width: 220, 
    justifyContent: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowOffset: { width: 2, height: 2 }, 
    elevation: 5 
  },
  selected: { 
    backgroundColor: '#D84315', 
    transform: [{ scale: 1.05 }], 
    shadowOpacity: 0.5 
  },
  icon: { 
    marginRight: 10 
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  nextButton: { 
    backgroundColor: '#4CAF50', 
    padding: 15, 
    borderRadius: 10, 
    marginTop: 20, 
    width: 220, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.3, 
    shadowOffset: { width: 2, height: 2 }, 
    elevation: 5 
  },
  disabled: { 
    backgroundColor: '#9E9E9E' 
  },
});
