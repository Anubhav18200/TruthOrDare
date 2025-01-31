import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // For cross (X) icon

export default function AddPlayersScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");

  const addPlayer = () => {
    if (playerName.trim()) {
      setPlayers([...players, { id: players.length + 1, name: playerName }]);
      setPlayerName("");
    }
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Players</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter Player Name"
        placeholderTextColor="#888"
        value={playerName}
        onChangeText={setPlayerName}
      />

      <TouchableOpacity style={styles.button} onPress={addPlayer}>
        <Text style={styles.buttonText}>Add Player</Text>
      </TouchableOpacity>

      <FlatList 
        data={players} 
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => (
          <View style={styles.listItemContainer}>
            <Text style={styles.listItem}>{item.name}</Text>
            <TouchableOpacity onPress={() => removePlayer(item.id)}>
              <AntDesign name="closecircle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity 
        style={[styles.continueButton, players.length < 2 && styles.disabledButton]} 
        onPress={() => navigation.navigate('SelectEnvironment', { players })} 
        disabled={players.length < 2}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#121212', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff',
    marginTop: 50, 
    marginBottom: 20 
  },
  input: { 
    width: '90%', 
    borderWidth: 1, 
    borderColor: '#555', 
    backgroundColor: '#222', 
    color: '#fff', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 10, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#FF9800', 
    padding: 15, 
    borderRadius: 8, 
    width: '90%', 
    alignItems: 'center', 
    marginBottom: 20, 
    shadowColor: '#FF9800', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 5, 
    elevation: 5 
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  listItemContainer: {
    backgroundColor: '#333', 
    padding: 12, 
    borderRadius: 8, 
    marginVertical: 5, 
    width: '90%', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  listItem: { 
    fontSize: 18, 
    color: '#FFF' 
  },
  continueButton: { 
    backgroundColor: '#4CAF50', 
    padding: 15, 
    borderRadius: 8, 
    width: '90%', 
    alignItems: 'center', 
    marginBottom: 50,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5
  },
  continueButtonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  disabledButton: { 
    backgroundColor: '#777' 
  },
});
