import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Animated, Dimensions } from 'react-native';

const tasks = {
  Truth: {
    Easy: "What's your biggest fear?",
    Medium: "Tell a secret no one knows.",
    Hard: "Reveal your most embarrassing moment."
  },
  Dare: {
    Easy: "Sing a song loudly.",
    Medium: "Dance for 30 seconds.",
    Hard: "Do 10 push-ups."
  }
};

const playerIcons = [
  require('../assets/beer2.png'),
  require('../assets/beer2.png'),
  require('../assets/beer3.jpg'),
  require('../assets/beer3.jpg'),
];

const giftIcon = require('../assets/gift.png'); // Update with actual gift icon path

export default function GameBoardScreen({ route }) {
  const { players } = route.params;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerPositions, setPlayerPositions] = useState(Array(players.length).fill(1));
  const [diceRoll, setDiceRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showTruthDareModal, setShowTruthDareModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [timer, setTimer] = useState(120);
  const [currentTask, setCurrentTask] = useState(null);
  const boardSize = 100;

  const [diceAnimationValue] = useState(new Animated.Value(0));

  // Get screen dimensions to make board responsive
  const { width, height } = Dimensions.get('window');
  const squareSize = Math.floor(width / 10); // Adjust square size based on screen width

  // Generate fixed random gift positions when the game starts
  const generateRandomGiftPositions = () => {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * boardSize) + 1);
  };
  const [randomGiftPositions] = useState(generateRandomGiftPositions()); // Fixed gift positions

  useEffect(() => {
    let interval;
    if (showTaskModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleTaskCompletion(false);
    }
    return () => clearInterval(interval);
  }, [showTaskModal, timer]);

  const rollDice = () => {
    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);

    Animated.sequence([
      Animated.timing(diceAnimationValue, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(diceAnimationValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setIsRolling(false);
      setShowTruthDareModal(true);
    }, 500);
  };

  const handleTruthDareSelection = (type) => {
    setSelectedType(type);
    setShowTruthDareModal(false);
    setShowDifficultyModal(true);
  };

  const handleDifficultySelection = (difficulty) => {
    const task = tasks[selectedType][difficulty];
    setCurrentTask({ type: selectedType, difficulty, task });
    setShowDifficultyModal(false);
    setShowTaskModal(true);
    setTimer(120);
  };

  const handleTaskCompletion = (completed) => {
    const move = completed ?
      (currentTask.difficulty === 'Easy' ? 3 :
        currentTask.difficulty === 'Medium' ? 6 : 10) :
      (currentTask.difficulty === 'Easy' ? -3 :
        currentTask.difficulty === 'Medium' ? -6 : -10);

    const newPositions = [...playerPositions];
    let newPosition = playerPositions[currentPlayerIndex] + move;
    if (newPosition < 1) newPosition = 1;
    if (newPosition > boardSize) newPosition = boardSize;
    newPositions[currentPlayerIndex] = newPosition;

    setPlayerPositions(newPositions);
    setShowTaskModal(false);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setTimer(120);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const diceTransform = diceAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Truth or Dare</Text>

      <View style={styles.playerInfo}>
        <Image source={playerIcons[currentPlayerIndex]} style={styles.currentPlayerIcon} />
        <View>
          <Text style={styles.currentPlayerName}>{players[currentPlayerIndex].name}</Text>
          <Text>Position: {playerPositions[currentPlayerIndex]}</Text>
        </View>
      </View>

      <View style={[styles.board, { width: width - 10}]}>
        {[...Array(boardSize)].map((_, i) => (
          <View key={i} style={[styles.square, { width: squareSize, height: squareSize }]}>
            <Text style={styles.squareNumber}>{i + 1}</Text>
            {playerPositions.map((pos, index) => pos === i + 1 && (
              <Image key={index} source={playerIcons[index]} style={styles.playerIcon} />
            ))}
            {randomGiftPositions.includes(i + 1) && (
              <Image source={giftIcon} style={styles.giftIcon} />
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={rollDice}
        disabled={isRolling}
      >
        <Animated.View style={{ transform: [{ rotate: diceTransform }] }}>
          <Text style={styles.buttonText}>🎲 Roll Dice</Text>
        </Animated.View>
      </TouchableOpacity>


      <Modal visible={showTruthDareModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Truth or Dare</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleTruthDareSelection('Truth')}
            >
              <Text style={styles.modalButtonText}>Truth</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleTruthDareSelection('Dare')}
            >
              <Text style={styles.modalButtonText}>Dare</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showDifficultyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Difficulty</Text>
            {selectedType && Object.entries(tasks[selectedType]).map(([difficulty, task]) => (
              <View key={difficulty} style={styles.difficultyOption}>
                <Text style={styles.difficultyTitle}>{difficulty}</Text>
                <Text style={styles.taskText}>{task}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleDifficultySelection(difficulty)}
                >
                  <Text style={styles.modalButtonText}>Select {difficulty}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={showTaskModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {currentTask && (
              <>
                <Text style={styles.modalTitle}>{currentTask.type} - {currentTask.difficulty}</Text>
                <Text style={styles.taskText}>{currentTask.task}</Text>
                <Text style={styles.timer}>Time remaining: {formatTime(timer)}</Text>
                <TouchableOpacity
                  style={[styles.modalButton, styles.successButton]}
                  onPress={() => handleTaskCompletion(true)}
                >
                  <Text style={styles.modalButtonText}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.failButton]}
                  onPress={() => handleTaskCompletion(false)}
                >
                  <Text style={styles.modalButtonText}>Not Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333', // Darker title color
    },
    playerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    currentPlayerIcon: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 25,
    },
    currentPlayerName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#555', // Slightly darker name
    },
    board: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginBottom: 20,
        borderWidth: 0,
        borderColor: '#ddd',
        borderRadius: 2,
        overflow: 'hidden',
    },
    square: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    squareNumber: {
        position: 'absolute',
        top: 5,
        fontSize: 12,
        color: '#333',
    },
    playerIcon: {
      width: 30,
      height: 30,
      position: 'absolute',
      top: 5,
      borderRadius: 15,
    },
    giftIcon: {
        width: 20,
        height: 20,
        position: 'absolute',
        bottom: 5,
    },
    button: {
        backgroundColor: '#FF9800',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 18,
      textAlign: 'center',
      fontWeight: '500',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#FFF',
      borderRadius: 15,
      padding: 25,
      width: '85%',
      maxWidth: 400,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
    modalButton: {
      backgroundColor: '#2196F3',
      padding: 15,
      borderRadius: 8,
      marginVertical: 10,
      width: '90%',
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: '500',
    },
    difficultyOption: {
      width: '100%',
      marginBottom: 15,
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    difficultyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
    },
    taskText: {
      fontSize: 18,
      marginBottom: 15,
      textAlign: 'center',
      color: '#555',
    },
    timer: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 15,
      color: '#FF5722',
    },
    successButton: {
      backgroundColor: '#4CAF50',
    },
    failButton: {
      backgroundColor: '#F44336',
    },
  });