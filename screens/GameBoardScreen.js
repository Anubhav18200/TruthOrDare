import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Animated, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { tasks } from '../Data/tasksData';

const playerIcons = [
  require('../assets/beer2.png'),
  require('../assets/beer2.png'),
  require('../assets/beer3.jpg'),
  require('../assets/beer3.jpg'),
];

const giftIcon = require('../assets/gift.png');
const rewardGif = require('../assets/gift.png');
const penaltyGif = require('../assets/beer3.jpg');

export default function GameBoardScreen({ route, navigation }) {
  const { players, environment } = route.params;
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
  const [showRewardPenaltyModal, setShowRewardPenaltyModal] = useState(false);
  const [rewardPenaltyGif, setRewardPenaltyGif] = useState(null);
  const [randomTasks, setRandomTasks] = useState(null);
  const [finishedPlayers, setFinishedPlayers] = useState([]);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const boardSize = 100;
  const [diceAnimationValue] = useState(new Animated.Value(0));
  const { width } = Dimensions.get('window');
  const squareSize = 38;

  const generateRandomGiftPositions = () => {
    const giftPositions = new Set();
    while (giftPositions.size < 20) {
      const randomPosition = Math.floor(Math.random() * (boardSize - 2)) + 2;
      giftPositions.add(randomPosition);
    }
    return Array.from(giftPositions);
  };

  const [randomGiftPositions] = useState(generateRandomGiftPositions());

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

  const checkGameStatus = (newPositions) => {
    const newFinishedPlayers = [...finishedPlayers];
    
    if (newPositions[currentPlayerIndex] >= 100 && !finishedPlayers.includes(currentPlayerIndex)) {
      newFinishedPlayers.push(currentPlayerIndex);
      setFinishedPlayers(newFinishedPlayers);
      newPositions[currentPlayerIndex] = 100; // Ensure position stays at 100
    }

    if (newFinishedPlayers.length === players.length) {
      setIsGameFinished(true);
    }
  };

  const findNextActivePlayer = (currentIndex) => {
    let nextIndex = (currentIndex + 1) % players.length;
    let fullRotation = false;

    while (finishedPlayers.includes(nextIndex)) {
      nextIndex = (nextIndex + 1) % players.length;
      if (nextIndex === currentIndex) {
        fullRotation = true;
        break;
      }
    }

    return fullRotation ? -1 : nextIndex;
  };

  const rollDice = () => {
    if (finishedPlayers.includes(currentPlayerIndex)) {
      const nextPlayer = findNextActivePlayer(currentPlayerIndex);
      if (nextPlayer !== -1) {
        setCurrentPlayerIndex(nextPlayer);
      }
      return;
    }

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

    const newPositions = [...playerPositions];
    const newPosition = Math.min(newPositions[currentPlayerIndex] + roll, 100);
    newPositions[currentPlayerIndex] = newPosition;
    setPlayerPositions(newPositions);

    if (randomGiftPositions.includes(newPosition)) {
      const randomChoice = Math.floor(Math.random() * 2);
      console.log(randomChoice);
      if (randomChoice === 0) {
        setRewardPenaltyGif(rewardGif);
      } else {
        setRewardPenaltyGif(penaltyGif);
      }
      setShowRewardPenaltyModal(true);
    } else {
      setIsRolling(false);
      const nextPlayer = findNextActivePlayer(currentPlayerIndex);
      if (nextPlayer !== -1) {
        setCurrentPlayerIndex(nextPlayer);
      }
    }

    checkGameStatus(newPositions);
  };

  const getRewardMovement = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return Math.floor(Math.random() * 3) + 2;
      case 'Medium':
        return Math.floor(Math.random() * 5) + 4;
      case 'Hard':
        return Math.floor(Math.random() * 4) + 9;
      default:
        return 0;
    }
  };

  const getPenaltyMovement = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return Math.floor(Math.random() * 4) + 9;
      case 'Medium':
        return Math.floor(Math.random() * 5) + 4;
      case 'Hard':
        return Math.floor(Math.random() * 3) + 2;
      default:
        return 0;
    }
  };

  const handleTruthDareSelection = (type) => {
    setSelectedType(type);
    
    const selectedTasks = {
      Easy: getRandomTask(tasks[environment][type.toLowerCase()].Easy),
      Medium: getRandomTask(tasks[environment][type.toLowerCase()].Medium),
      Hard: getRandomTask(tasks[environment][type.toLowerCase()].Hard)
    };
    
    setRandomTasks(selectedTasks);
    setShowTruthDareModal(false);
    setShowDifficultyModal(true);
  };

  const getRandomTask = (tasksArray) => {
    const randomIndex = Math.floor(Math.random() * tasksArray.length);
    return tasksArray[randomIndex];
  };

  const handleDifficultySelection = (difficulty) => {
    setCurrentTask({ 
      type: selectedType, 
      difficulty, 
      task: randomTasks[difficulty]
    });
    setShowDifficultyModal(false);
    setShowTaskModal(true);
    setTimer(120);
  };
  
  let move = 0;
  const handleTaskCompletion = (completed) => {
    if (rewardPenaltyGif) {
      const randomChoice = rewardPenaltyGif === rewardGif ? 0 : 1;
      const difficulty = currentTask.difficulty;
  
      if (randomChoice === 0) {
        move = getRewardMovement(difficulty);
      } else {
        move = -getPenaltyMovement(difficulty);
      }
    }
    console.log(move);

    const newPositions = [...playerPositions];
    let newPosition = playerPositions[currentPlayerIndex] + move;
  
    if (newPosition < 1) newPosition = 1;
    if (newPosition > boardSize) newPosition = 100;
  
    newPositions[currentPlayerIndex] = newPosition;
    setPlayerPositions(newPositions);
    checkGameStatus(newPositions);
  
    setShowTaskModal(false);
    setShowRewardPenaltyModal(false);
    const nextPlayer = findNextActivePlayer(currentPlayerIndex);
    if (nextPlayer !== -1) {
      setCurrentPlayerIndex(nextPlayer);
    }
    setTimer(120);
    setIsRolling(false);
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
      <View style={styles.diceResultContainer}>
        <Text style={styles.diceResultText}>
          {diceRoll !== null ? `You rolled: ${diceRoll}` : 'Roll the dice!'}
        </Text>
      </View>

      <View style={[styles.board, { width: width - 10 }]}>
        {[...Array(boardSize)].map((_, i) => (
          <View key={i} style={[styles.square, { width: squareSize, height: squareSize }]}>
            <Text style={styles.squareNumber}>
              {i === 0 ? 'Go' : i === boardSize - 1 ? 'End' : i + 1}
            </Text>
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
        disabled={isRolling || finishedPlayers.includes(currentPlayerIndex)}
      >
        <Animated.View style={{ transform: [{ rotate: diceTransform }] }}>
          <Text style={styles.buttonText}>🎲 Roll Dice</Text>
        </Animated.View>
      </TouchableOpacity>

      <Modal visible={showRewardPenaltyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={rewardPenaltyGif} style={styles.rewardPenaltyImage} />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowRewardPenaltyModal(false);
                setShowTruthDareModal(true);
              }}
            >
              <Text style={styles.modalButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
            {randomTasks && Object.entries(randomTasks).map(([difficulty, task]) => (
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
              </>
            )}
          </View>
        </View>
      </Modal>

      {isGameFinished && (
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#4CAF50' }]} 
          onPress={() => navigation.navigate('EndGame', { 
            players: players.map((player, index) => ({
              ...player,
              position: finishedPlayers.indexOf(index) + 1
            }))
          })}
        >
          <Text style={styles.buttonText}>End Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
    color: '#555',
  },
  diceResultContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  diceResultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  board: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 20,
    borderColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
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
    width: 30,
    height: 30,
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
  rewardPenaltyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});