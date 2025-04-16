import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated, Dimensions } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AddPlayersScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [shake] = useState(new Animated.Value(0));

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const addPlayer = () => {
    if (players.length >= 6) {
      // Optionally, you can show an alert or message to the user
      alert('Maximum 6 players allowed');
      return;
    }
    if (playerName.trim()) {
      setPlayers([...players, { id: players.length + 1, name: playerName.trim() }]);
      setPlayerName("");
    } else {
      shakeAnimation();
    }
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  return (
    <LinearGradient
      colors={['#1a237e', '#3949ab', '#3f51b5']}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Add Players</Text>
        <Text style={styles.subtitle}>Players : 2 - 6 </Text>
      </View>

      <View style={styles.inputContainer}>
        <Animated.View style={{ transform: [{ translateX: shake }] }}>
          <TextInput
            style={styles.input}
            placeholder="Enter Player Name"
            placeholderTextColor="#9FA8DA"
            value={playerName}
            onChangeText={setPlayerName}
            onSubmitEditing={addPlayer}
            maxLength={30}
          />
        </Animated.View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={addPlayer}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View 
              style={[
                styles.listItemContainer,
                { 
                  transform: [{ scale: 1 }],
                  backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)'
                }
              ]}
            >
              <View style={styles.playerInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.listItem}>{item.name}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removePlayer(item.id)}
              >
                <AntDesign name="closecircle" size={24} color="#FF5252" />
              </TouchableOpacity>
            </Animated.View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          players.length < 2 && styles.disabledButton
        ]}
        onPress={() => navigation.navigate('SelectEnvironment', { players })}
        disabled={players.length < 2}
      >
        <Text style={styles.continueButtonText}>
          {players.length < 2 ? 'Add More Players' : 'Start Game'}
        </Text>
        {players.length >= 2 && (
          <Ionicons name="arrow-forward" size={24} color="#FFF" style={styles.continueIcon} />
        )}
      </TouchableOpacity>

      <View style={styles.playerCount}>
        <Text style={styles.playerCountText}>
          {players.length} Player{players.length !== 1 ? 's' : ''} Added
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8EAF6',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
  },
  input: {
    width: width - 100,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFF',
    marginRight: 10,
  },
  addButton: {
    width: width - 100 ,
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  listContent: {
    paddingVertical: 10,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  listItem: {
    fontSize: 18,
    color: '#FFF',
    flex: 1,
  },
  removeButton: {
    padding: 5,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  continueIcon: {
    marginLeft: 5,
  },
  playerCount: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playerCountText: {
    color: '#E8EAF6',
    fontSize: 14,
  },
});