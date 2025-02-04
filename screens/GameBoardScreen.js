import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Animated, Dimensions } from 'react-native';
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
const ghostImg = require('../assets/ghost1.jpg');
const exerImg = require('../assets/exercise1.jpg');

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
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryImage, setShowCategoryImage] = useState(false);
  const [opacity] = useState(new Animated.Value(0)); // Start with opacity 0
  const [scale] = useState(new Animated.Value(0.8)); // Start with smaller scale

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

    if (showCategoryImage) {
      // Animate opacity and scale when the image is shown
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1, // Fade in
          duration: 1000, // Duration of the fade effect
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1, // Scale to normal size
          duration: 1000, // Duration of the scale effect
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset opacity and scale when the image is hidden
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0, // Fade out
          duration: 1000, // Duration of the fade effect
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8, // Scale back down
          duration: 1000, // Duration of the scale effect
          useNativeDriver: true,
        }),
      ]).start();
    }


    let interval;
    if (showTaskModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleTaskCompletion(false);
    }
    return () => clearInterval(interval);
  }, [showTaskModal, timer, showCategoryImage]);

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
    console.log(type);
    // Select a random category (Ghost, Exercise, etc.)
    console.log(tasks[environment][type]);
    const categories = Object.keys(tasks[environment][type]);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    if(randomCategory=== 'Ghost'){
      setSelectedCategoryImage(ghostImg);
    }
    else{
      setSelectedCategoryImage(exerImg);
    }
  
    // Retrieve category information (image and tasks)
    const selectedCategoryData = tasks[environment][type][randomCategory];
    
    // Set the random category image
    console.log(randomCategory)
    //setSelectedCategoryImage(selectedCategoryData.image);

    // Get the random task based on the selected category and difficulty levels
    const selectedTasks = {
      Easy: getRandomTask(selectedCategoryData.Easy),
      Medium: getRandomTask(selectedCategoryData.Medium),
      Hard: getRandomTask(selectedCategoryData.Hard)
    };

    setRandomTasks(selectedTasks);
    setSelectedCategory(randomCategory); // Store the selected category

    setShowTruthDareModal(false);
    setShowDifficultyModal(true);
  };

  // const getRandomCategoryImage = (category) => {
  //   const images = categoryImages[category];
  //   const randomIndex = Math.floor(Math.random() * images.length);
  //   return images[randomIndex];
  // };

  const getRandomTask = (tasksArray) => {
    const randomIndex = Math.floor(Math.random() * tasksArray.length);
    return tasksArray[randomIndex];
  };

 // Helper function to handle difficulty selection
 const handleDifficultySelection = (difficulty) => {
  setCurrentTask({
    type: selectedType,
    difficulty,
    task: randomTasks[difficulty],
    category: selectedCategory // Add selected category to the task object
  });

  setShowDifficultyModal(false);
  // Hide the image after 3-4 seconds
  setShowCategoryImage(true);
  setTimeout(() => {
    setShowCategoryImage(false); // Hide the category image
    setShowTaskModal(true); // Show the task modal
    setTimer(120); // Start the timer for the task
  }, 4000); // Show for 4 seconds
};
  
  const handleTaskCompletion = (completed) => {
    let move = 0;
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

  console.log(selectedCategoryImage);
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

      <Modal visible={showRewardPenaltyModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {rewardPenaltyGif === rewardGif ? 'Reward!' : 'Penalty!'}
              </Text>
            </View>
            <Image source={rewardPenaltyGif} style={styles.rewardPenaltyImage} />
            <TouchableOpacity
              style={[styles.modalButton, {
                backgroundColor: rewardPenaltyGif === rewardGif ? '#4CAF50' : '#F44336'
              }]}
              onPress={() => {
                setShowRewardPenaltyModal(false);
                setShowTruthDareModal(true);
              }}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showTruthDareModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Your Path</Text>
              <Text style={styles.modalSubtitle}>Truth or Dare awaits...</Text>
            </View>
            <View style={styles.truthDareContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.truthButton]}
                onPress={() => handleTruthDareSelection('Truth')}
              >
                <Text style={styles.modalButtonText}>TRUTH</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.dareButton]}
                onPress={() => handleTruthDareSelection('Dare')}
              >
                <Text style={styles.modalButtonText}>DARE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showDifficultyModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Difficulty</Text>
              <Text style={styles.modalSubtitle}>Choose your challenge level</Text>
            </View>
            <View style={styles.difficultyContainer}>
              {randomTasks && Object.entries(randomTasks).map(([difficulty, task]) => {
                const difficultyStyle = {
                  Easy: styles.difficultyEasy,
                  Medium: styles.difficultyMedium,
                  Hard: styles.difficultyHard,
                }[difficulty];

                return (
                  <View key={difficulty} style={[styles.difficultyOption, difficultyStyle]}>
                    <Text style={styles.difficultyTitle}>{difficulty}</Text>
                    {/* <Text style={styles.taskText}>{task}</Text> */}
                    <TouchableOpacity
                      style={[styles.modalButton, {
                        backgroundColor: {
                          Easy: '#4CAF50',
                          Medium: '#FF9800',
                          Hard: '#F44336',
                        }[difficulty],
                      }]}
                      onPress={() => handleDifficultySelection(difficulty)}
                    >
                      <Text style={styles.modalButtonText}>Accept Challenge</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.imgcontainer}>
      {showCategoryImage && (
        <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity, // Bind opacity to the animated value
            transform: [{ scale }], // Bind scale to the animated value
          },
        ]}
      >
          <Image
            source={selectedCategoryImage} 
            style={styles.categoryImage}
          />
        </Animated.View>
      )}
      </View>


      <Modal visible={showTaskModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {currentTask && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{currentTask.type}</Text>
                  <Text style={[styles.modalSubtitle, { color: {
                    Easy: '#4CAF50',
                    Medium: '#FF9800',
                    Hard: '#F44336',
                  }[currentTask.difficulty] }]}>
                    {currentTask.difficulty} Challenge
                  </Text>
                </View>
                <Text style={styles.taskText}>{currentTask.task}</Text>
                <Text style={styles.timer}>{formatTime(timer)}</Text>
                <TouchableOpacity
                  style={[styles.modalButton, styles.successButton]}
                  onPress={() => handleTaskCompletion(true)}
                >
                  <Text style={styles.modalButtonText}>Complete Challenge</Text>
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
  imgcontainer: {
    flex: 1,  // Take up the full screen
    justifyContent: 'center',  // Center the content vertically
    alignItems: 'center',  // Center the content horizontally
    position: 'absolute',  // Position it on top of the game screen
    top: 0,  // Align at the top of the screen
    left: 0,  // Align at the left of the screen
    width: '100%',  // Take full width
    height: '100%',  // Take full height
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,  // Take at least half the screen height
    width: '100%',  // Full width
    height: '50%',  // Ensure it covers half the screen or more
    position: 'absolute',  // Keep it in front of the other content
    zIndex: 1000,  // Higher z-index to stay on top
  },
  categoryImage: {
    width: 300,  // Adjust the size as needed
    height: 300,  // Adjust the size as needed
    borderRadius: 10,
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
  // modalOverlay: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0,0,0,0.5)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  difficultyOption: {
    width: '100%',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  difficultyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  taskText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#495057',
    lineHeight: 24,
  },
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#FF5722',
    fontFamily: 'System',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  failButton: {
    backgroundColor: '#F44336',
  },
  rewardPenaltyImage: {
    width: 120,
    height: 120,
    marginBottom: 25,
    borderRadius: 60,
  },
  truthDareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  truthButton: {
    backgroundColor: '#4CAF50',
    width: '48%',
  },
  dareButton: {
    backgroundColor: '#FF5722',
    width: '48%',
  },
  difficultyContainer: {
    width: '100%',
  },
  difficultyEasy: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  difficultyMedium: {
    borderColor: '#FF9800',
    borderWidth: 2,
  },
  difficultyHard: {
    borderColor: '#F44336',
    borderWidth: 2,
  },
  modalHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 15,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 5,
  },
});