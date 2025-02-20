import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { tasks } from "../Data/tasksData.js";
import { Image } from "expo-image";
import { Audio } from "expo-av";
import { stopMusic } from "../Data/MusicService"; // Import stopMusic from MusicService
import { useWindowDimensions } from "react-native";

const playerIcons = [
  require("../assets/p1.png"),
  require("../assets/p2.png"),
  require("../assets/p3.png"),
  require("../assets/p4.png"),
  require("../assets/p5.png"),
  require("../assets/p6.png"),
];

const giftIcon = require("../assets/gift.png");
const rewardGif = require("../assets/reward.gif");
const penaltyGif = require("../assets/penalty.gif");
const ghostImg = require("../assets/ghost.gif");
const exerImg = require("../assets/ex1.gif");
const singImg = require("../assets/singing.gif");
const danceImg = require("../assets/dancing.gif");
const funnyImg = require("../assets/funny.gif");

const { width, height } = Dimensions.get("window");

export default function GameBoardScreen({ route, navigation }) {
  const { players, environment } = route.params;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerPositions, setPlayerPositions] = useState(
    Array(players.length).fill(1)
  );
  const [diceRoll, setDiceRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
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
  const [opacity] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(0.8));
  const [rotateAnimation] = useState(new Animated.Value(0));
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [extraMoves, setExtraMoves] = useState(null);
  const [showMoves, setShowMoves] = useState(false);

  // State for sounds
  const [diceSound, setDiceSound] = useState(null);
  const [movementSound, setMovementSound] = useState(null);
  const [rewardSound, setRewardSound] = useState(null);
  const [penaltySound, setPenaltySound] = useState(null);

  const [truthCounts, setTruthCounts] = useState(Array(players.length).fill(0));

  const boardSize = 100;

  const squareSize = width / 10;

  const generateRandomGiftPositions = () => {
    const giftPositions = new Set();
    while (giftPositions.size < 20) {
      const randomPosition = Math.floor(Math.random() * (boardSize - 2)) + 2;
      giftPositions.add(randomPosition);
    }
    return Array.from(giftPositions);
  };

  const [randomGiftPositions] = useState(generateRandomGiftPositions());

  const DiceFace = ({ number = 1 }) => {
    const renderDots = (number) => {
      const validNumber = number && number >= 1 && number <= 6 ? number : 1;
      const dotPositions = {
        1: [{ top: "200%", left: "40%" }],
        2: [
          { top: "100%", left: "20%" },
          { top: "50%", left: "60%" },
        ],
        3: [
          { top: "15%", left: "20%" },
          { top: "42%", left: "45%" },
          { top: "70%", left: "70%" },
        ],
        4: [
          { top: "20%", left: "10%" },
          { top: "-5%", left: "70%" },
          { top: "40%", left: "10%" },
          { top: "20%", left: "70%" },
        ],
        5: [
          { top: "10%", left: "10%" },
          { top: "-5%", left: "70%" },
          { top: "2%", left: "40%" },
          { top: "10%", left: "10%" },
          { top: "-5%", left: "70%" },
        ],
        6: [
          { top: "10%", left: "10%" },
          { top: "-5%", left: "40%" },
          { top: "-20%", left: "70%" },
          { top: "10%", left: "10%" },
          { top: "-5%", left: "40%" },
          { top: "-20%", left: "70%" },
        ],
      };
      return dotPositions[validNumber].map((position, index) => (
        <View key={index} style={[styles.dot, position]} />
      ));
    };

    return <View style={styles.face}>{renderDots(number)}</View>;
  };

  useEffect(() => {
    stopMusic(); // Stop music when the screen is loaded
  }, []);

  // Load sounds when the component mounts
  useEffect(() => {
    const loadSounds = async () => {
      const { sound: dice } = await Audio.Sound.createAsync(
        require("../assets/dice.mp3")
      );
      const { sound: movement } = await Audio.Sound.createAsync(
        require("../assets/p_icon_sound.wav")
      );
      const { sound: reward } = await Audio.Sound.createAsync(
        require("../assets/victory.wav")
      );
      const { sound: penalty } = await Audio.Sound.createAsync(
        require("../assets/lost.wav")
      );
      setDiceSound(dice);
      setMovementSound(movement);
      setRewardSound(reward);
      setPenaltySound(penalty);
    };

    loadSounds();

    // Cleanup sounds when the component unmounts
    return () => {
      if (diceSound) {
        diceSound.unloadAsync();
      }
      if (movementSound) {
        movementSound.unloadAsync();
      }
      if (rewardSound) {
        rewardSound.unloadAsync();
      }
      if (penaltySound) {
        penaltySound.unloadAsync();
      }
    };
  }, []);

  // Add pulse animation effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [currentPlayerIndex]);

  useEffect(() => {
    if (showCategoryImage) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 1000,
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

  const animatePlayerMovement = async (startPos, endPos, isReward = false) => {
    setIsMoving(true);
    let currentPosition = startPos;
    const direction = endPos > startPos ? 1 : -1;

    const moveOneStep = async () => {
      if (
        (direction === 1 && currentPosition < endPos) ||
        (direction === -1 && currentPosition > endPos)
      ) {
        currentPosition += direction;
        const newPositions = [...playerPositions];
        newPositions[currentPlayerIndex] = currentPosition;
        setPlayerPositions(newPositions);

        // Play player movement sound for each step
        if (movementSound) {
          await movementSound.replayAsync();
        }

        setTimeout(moveOneStep, 300);
      } else {
        setIsMoving(false);

        // Update the player's position and check if they have reached 100
        const newPositions = [...playerPositions];
        newPositions[currentPlayerIndex] = currentPosition;
        setPlayerPositions(newPositions);

        // Call checkGameStatus to update the game state
        checkGameStatus(newPositions);

        // Check if player landed on a gift and this wasn't a reward movement
        if (randomGiftPositions.includes(endPos) && !isReward) {
          //const randomChoice = Math.floor(Math.random() * 2);
          const randomChoice = 0;
          setRewardPenaltyGif(randomChoice === 0 ? rewardGif : penaltyGif);
          setShowRewardPenaltyModal(true);

          // Play reward or penalty sound
          if (randomChoice === 0 && rewardSound) {
            await rewardSound.replayAsync();
          } else if (penaltySound) {
            await penaltySound.replayAsync();
          }
          setTimeout(() => {
            setShowRewardPenaltyModal(false);
            setShowTruthDareModal(true);
          }, 3000);
        } else if (randomGiftPositions.includes(endPos) && isReward) {
          // If landed on a gift after a reward movement, trigger another task
          setShowRewardPenaltyModal(true);
          setTimeout(() => {
            setShowRewardPenaltyModal(false);
            setShowTruthDareModal(true);
          }, 3000);
        } else {
          // No gift encountered, move to next player
          const nextPlayer = findNextActivePlayer(currentPlayerIndex);
          if (nextPlayer !== -1) {
            setCurrentPlayerIndex(nextPlayer);
          }
          setIsRolling(false);
        }
      }
    };

    moveOneStep();
  };

  const checkGameStatus = (newPositions) => {
    // console.log("Checking game status...");
    // console.log("Current Player Position:", newPositions[currentPlayerIndex]);
    // console.log("Finished Players:", finishedPlayers);

    const newFinishedPlayers = [...finishedPlayers];

    // Check if the current player has reached 100
    if (
      newPositions[currentPlayerIndex] >= 100 &&
      !finishedPlayers.includes(currentPlayerIndex)
    ) {
      //console.log("Player", currentPlayerIndex, "has reached 100!");
      newFinishedPlayers.push(currentPlayerIndex);
      setFinishedPlayers(newFinishedPlayers);
      newPositions[currentPlayerIndex] = 100; // Ensure the player doesn't go beyond 100
    }

    // Check if all players have reached 100
    if (newFinishedPlayers.length === players.length) {
      //console.log("All players have reached 100. Game over!");
      setIsGameFinished(true); // End the game
    } else if (finishedPlayers.includes(currentPlayerIndex)) {
      // If the current player has finished, move to the next player
      const nextPlayer = findNextActivePlayer(currentPlayerIndex);
      if (nextPlayer !== -1) {
        setCurrentPlayerIndex(nextPlayer);
      }
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

  const rollDice = async () => {
    // Prevent rolling if:
    // 1. The game is finished (`isGameFinished` is true)
    // 2. The current player has already reached 100 (`finishedPlayers` includes `currentPlayerIndex`)
    // 3. The player is currently moving (`isMoving` is true)
    if (
      isMoving ||
      finishedPlayers.includes(currentPlayerIndex) ||
      isGameFinished
    ) {
      return;
    }

    setIsRolling(true);
    if (diceSound) {
      await diceSound.replayAsync();
    }
    //const roll = 99;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);

    Animated.sequence([
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const startPos = playerPositions[currentPlayerIndex];
      const endPos = startPos + roll;

      // Check if the player can move without exceeding 100
      if (endPos <= 100) {
        animatePlayerMovement(startPos, endPos);
      } else {
        // Player cannot move, switch to the next player
        const nextPlayer = findNextActivePlayer(currentPlayerIndex);
        if (nextPlayer !== -1) {
          setCurrentPlayerIndex(nextPlayer);
        }
        setIsRolling(false);
      }
    });
  };

  const getRewardMovement = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return Math.floor(Math.random() * 3) + 2;
      case "Medium":
        return Math.floor(Math.random() * 5) + 4;
      case "Hard":
        return Math.floor(Math.random() * 4) + 9;
      default:
        return 0;
    }
  };

  const getPenaltyMovement = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return Math.floor(Math.random() * 4) + 9;
      case "Medium":
        return Math.floor(Math.random() * 5) + 4;
      case "Hard":
        return Math.floor(Math.random() * 3) + 2;
      default:
        return 0;
    }
  };

  // const handleTruthDareSelection = (type) => {
  //   setSelectedType(type);
  //   const categories = Object.keys(tasks[environment][type]);
  //   const randomCategory =
  //     categories[Math.floor(Math.random() * categories.length)];

  //   if (randomCategory === "Ghost") {
  //     setSelectedCategoryImage(ghostImg);
  //   } else if (randomCategory === "Exercise") {
  //     setSelectedCategoryImage(exerImg);
  //   } else if (randomCategory === "Dancing") {
  //     setSelectedCategoryImage(danceImg);
  //   } else if (randomCategory === "FunnyTask") {
  //     setSelectedCategoryImage(funnyImg);
  //   } else {
  //     setSelectedCategoryImage(singImg);
  //   }
  //   setSelectedCategoryImage(exerImg);
  //   const selectedCategoryData = tasks[environment][type][randomCategory];
  //   const selectedTasks = {
  //     Easy: getRandomTask(selectedCategoryData.Easy),
  //     Medium: getRandomTask(selectedCategoryData.Medium),
  //     Hard: getRandomTask(selectedCategoryData.Hard),
  //   };

  //   setRandomTasks(selectedTasks);
  //   setSelectedCategory(randomCategory);
  //   setShowTruthDareModal(false);
  //   setShowDifficultyModal(true);
  // };

  const handleTruthDareSelection = (type) => {
    setSelectedType(type);

    if (type === "Truth") {
      // Check if the player has already taken 3 truths
      if (truthCounts[currentPlayerIndex] >= 3) {
        alert("You have already taken 3 truths. Please choose Dare.");
        return;
      }

      // Select a random player to ask the question (excluding the current player)
      const otherPlayers = players.filter(
        (_, index) => index !== currentPlayerIndex
      );
      const randomPlayer =
        otherPlayers[Math.floor(Math.random() * otherPlayers.length)];

      // Set the task modal text
      setCurrentTask({
        type: "Truth",
        task: `${randomPlayer.name} will ask you the question.`,
      });

      // Show the task modal directly
      setShowTruthDareModal(false);
      setShowTaskModal(true);
      setTimer(120);
    } else {
      // For Dare, proceed as before
      const categories = Object.keys(tasks[environment][type]);
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      // Set the category image
      if (randomCategory === "Ghost") {
        setSelectedCategoryImage(ghostImg);
      } else if (randomCategory === "Exercise") {
        setSelectedCategoryImage(exerImg);
      } else if (randomCategory === "Dancing") {
        setSelectedCategoryImage(danceImg);
      } else if (randomCategory === "FunnyTask") {
        setSelectedCategoryImage(funnyImg);
      } else {
        setSelectedCategoryImage(singImg);
      }

      const selectedCategoryData = tasks[environment][type][randomCategory];
      const selectedTasks = {
        Easy: getRandomTask(selectedCategoryData.Easy),
        Medium: getRandomTask(selectedCategoryData.Medium),
        Hard: getRandomTask(selectedCategoryData.Hard),
      };

      setRandomTasks(selectedTasks);
      setSelectedCategory(randomCategory);
      setShowTruthDareModal(false);
      setShowDifficultyModal(true);
    }
  };

  const getRandomTask = (tasksArray) => {
    return tasksArray[Math.floor(Math.random() * tasksArray.length)];
  };

  const handleDifficultySelection = (difficulty) => {
    setCurrentTask({
      type: selectedType,
      difficulty,
      task: randomTasks[difficulty],
      category: selectedCategory,
    });

    setShowDifficultyModal(false);
    setShowCategoryImage(true);
    setTimeout(() => {
      setShowCategoryImage(false);
      setShowTaskModal(true);
      setTimer(120);
    }, 4000);
  };

  // const handleTaskCompletion = (completed) => {
  //   const currentPos = playerPositions[currentPlayerIndex];
  //   let move = 0;

  //   if (currentTask) {
  //     const randomChoice = rewardPenaltyGif === rewardGif ? 0 : 1;
  //     const difficulty = currentTask.difficulty;

  //     if (randomChoice === 0) {
  //       move = getRewardMovement(difficulty);
  //     } else {
  //       move = -getPenaltyMovement(difficulty);
  //     }
  //     console.log(move);
  //     setExtraMoves(move);
  //     //console.log(extraMoves);
  //     const newPosition = Math.max(1, Math.min(currentPos + move, 100));

  //     setShowTaskModal(false);
  //     setShowRewardPenaltyModal(false);
  //     setShowMoves(true);
  //     setTimeout(() => {
  //       setShowMoves(false);
  //       animatePlayerMovement(currentPos, newPosition, true);
  //     }, 3000);
  //     setTimer(120);

  //   }
  // };

  const handleTaskCompletion = (completed) => {
    const currentPos = playerPositions[currentPlayerIndex];
    let move = 0;

    if (selectedType === "Truth") {
      // For Truth, reward is +2 to +4, penalty is -2 to -4
      const randomChoice = rewardPenaltyGif === rewardGif ? 0 : 1; // 50% chance for reward or penalty
      move =
        randomChoice === 0
          ? Math.floor(Math.random() * 3) + 2
          : -(Math.floor(Math.random() * 3) + 2);

      // Increment the truth count for the current player
      const newTruthCounts = [...truthCounts];
      newTruthCounts[currentPlayerIndex] += 1;
      setTruthCounts(newTruthCounts);
    } else {
      // For Dare, proceed as before
      const randomChoice = rewardPenaltyGif === rewardGif ? 0 : 1;
      const difficulty = currentTask.difficulty;

      if (randomChoice === 0) {
        move = getRewardMovement(difficulty);
      } else {
        move = -getPenaltyMovement(difficulty);
      }
    }

    setExtraMoves(move);
    const newPosition = Math.max(1, Math.min(currentPos + move, 100));

    setShowTaskModal(false);
    setShowRewardPenaltyModal(false);
    setShowMoves(true);
    setTimeout(() => {
      setShowMoves(false);
      animatePlayerMovement(currentPos, newPosition, true);
    }, 3000);
    setTimer(120);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.gradientBackground}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate("GameRules")}
        >
          <Text style={styles.infoButtonText}>?</Text>
        </TouchableOpacity>

        <View style={styles.textStyle}>
          <Text style={styles.title}>Truth or Dare</Text>
        </View>

        <View style={styles.boardStyle}>
          <View style={[styles.board]}>
            {[...Array(boardSize)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.square,
                  {
                    width: squareSize,
                    height: squareSize,
                    backgroundColor: i % 2 === 0 ? "#f0f4f8" : "#e2e8f0",
                  },
                ]}
              >
                <Text style={styles.squareNumber}>
                  {i === 0 ? "Go" : i === boardSize - 1 ? "End" : i + 1}
                </Text>
                {playerPositions.map(
                  (pos, index) =>
                    pos === i + 1 && (
                      <Image
                        key={index}
                        source={playerIcons[index]}
                        style={styles.playerIcon}
                      />
                    )
                )}
                {randomGiftPositions.includes(i + 1) && (
                  <Image source={giftIcon} style={styles.giftIcon} />
                )}
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        <View style={styles.playerTurnContainer}>
          {/* {renderPlayerCard()} */}
          <Animated.View
            style={[
              styles.playerCard,
              {
                transform: [{ scale: pulseAnimation }],
                borderWidth: 2,
                borderColor: "#4299e1",
              },
            ]}
          >
            <View style={styles.yourTurnBadge}>
              <Text style={styles.yourTurnText}>Your Turn </Text>
            </View>
            <Image
              source={playerIcons[currentPlayerIndex]}
              style={styles.playerCardIcon}
            />
            <View style={styles.playerCardInfo}>
              <Text style={styles.playerCardName}>
                {players[currentPlayerIndex].name}
              </Text>
            </View>
          </Animated.View>

          <TouchableOpacity
            onPress={rollDice}
            disabled={
              isRolling ||
              isMoving ||
              finishedPlayers.includes(currentPlayerIndex) ||
              isGameFinished
            }
            style={[
              styles.diceWrapper,
              finishedPlayers.includes(currentPlayerIndex) || isGameFinished
                ? styles.disabledDice
                : null,
            ]}
          >
            <Animated.View
              style={[
                styles.dice,
                {
                  transform: [{ rotate: rotation }],
                  opacity:
                    isRolling ||
                    isMoving ||
                    finishedPlayers.includes(currentPlayerIndex) ||
                    isGameFinished
                      ? 0.5
                      : 1,
                },
              ]}
            >
              <DiceFace number={diceRoll} />
            </Animated.View>
            <Text style={styles.rollText}>
              {isRolling
                ? "Rolling..."
                : isMoving
                ? "Moving..."
                : finishedPlayers.includes(currentPlayerIndex)
                ? "Finished"
                : isGameFinished
                ? "Game Over"
                : "Tap to Roll"}
            </Text>
          </TouchableOpacity>

          <View style={styles.nextPlayerPreview}>
            <View style={styles.nextPlayerInfo}>
              <Text style={styles.nextPlayerLabel}>Next Player</Text>
              <Image
                source={playerIcons[(currentPlayerIndex + 1) % players.length]}
                style={styles.nextPlayerIcon}
              />
              <View>
                <Text style={styles.nextPlayerName}>
                  {players[(currentPlayerIndex + 1) % players.length].name}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Truth/Dare Modal */}
      <Modal visible={showTruthDareModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Your Path</Text>
              <Text style={styles.modalSubtitle}>
                {truthCounts[currentPlayerIndex] < 3
                  ? `${3 - truthCounts[currentPlayerIndex]} truths left`
                  : "No truths left. Choose Dare."}
              </Text>
            </View>
            <View style={styles.truthDareContainer}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.truthButton,
                  truthCounts[currentPlayerIndex] >= 3 && styles.disabledButton,
                ]}
                onPress={() => handleTruthDareSelection("Truth")}
                disabled={truthCounts[currentPlayerIndex] >= 3}
              >
                <Text style={styles.modalButtonText}>TRUTH</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.dareButton]}
                onPress={() => handleTruthDareSelection("Dare")}
              >
                <Text style={styles.modalButtonText}>DARE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Difficulty Modal */}
      <Modal visible={showDifficultyModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Difficulty</Text>
              <Text style={styles.modalSubtitle}>
                Choose your challenge level
              </Text>
            </View>
            <View style={styles.difficultyContainer}>
              {randomTasks &&
                Object.entries(randomTasks).map(([difficulty, task]) => {
                  const difficultyStyle = {
                    Easy: styles.difficultyEasy,
                    Medium: styles.difficultyMedium,
                    Hard: styles.difficultyHard,
                  }[difficulty];

                  return (
                    <View
                      key={difficulty}
                      style={[styles.difficultyOption, difficultyStyle]}
                    >
                      <Text style={styles.difficultyTitle}>{difficulty}</Text>
                      <TouchableOpacity
                        style={[
                          styles.modalButton,
                          {
                            backgroundColor: {
                              Easy: "#4CAF50",
                              Medium: "#FF9800",
                              Hard: "#F44336",
                            }[difficulty],
                          },
                        ]}
                        onPress={() => handleDifficultySelection(difficulty)}
                      >
                        <Text style={styles.modalButtonText}>
                          Accept Challenge
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Image */}
      <View style={styles.imgcontainer}>
        {showCategoryImage && (
          <Animated.View
            style={[
              styles.imageContainer,
              {
                opacity,
                transform: [{ scale }],
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

      {/* Task Modal */}
      <Modal visible={showTaskModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {currentTask && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{currentTask.type}</Text>
                  <Text
                    style={[
                      styles.modalSubtitle,
                      {
                        color: {
                          Easy: "#4CAF50",
                          Medium: "#FF9800",
                          Hard: "#F44336",
                        }[currentTask.difficulty],
                      },
                    ]}
                  >
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

      {/* Reward/Penalty Modal */}
      <Modal visible={showRewardPenaltyModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View>
            <View style={styles.modalHeader}></View>
            <Image
              source={rewardPenaltyGif}
              style={styles.rewardPenaltyImage}
            />
          </View>
        </View>
      </Modal>
      {/* ShowMoves Modal */}
      <Modal visible={showMoves} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View>
            <View style={styles.modalHeader}></View>
            <Text style={styles.moves}>{extraMoves}</Text>
          </View>
        </View>
      </Modal>
      {/* Show End Game Button */}
      {isGameFinished && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={() =>
            navigation.navigate("EndGame", {
              players: players.map((player, index) => ({
                ...player,
                position: finishedPlayers.indexOf(index) + 1,
              })),
            })
          }
        >
          <Text style={styles.buttonText}>End Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  finishedBadge: {
    backgroundColor: "#48BB78",
  },

  disabledButton: {
    opacity: 0.5,
  },

  disabledDice: {
    opacity: 0.5,
  },

  moves: {
    height: height - "90%",
    width: width - "30%",
    fontWeight: "bold",
    fontSize: 160,
    color: "white",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a365d",
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: "#2a4365",
    paddingTop: 20,
    //width: '100%',
    alignItems: "center",
  },
  imgcontainer: {
    flex: 1, // Take up the full screen
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
    position: "absolute", // Position it on top of the game screen
    //top: "25%", // Align at the top of the screen
    //left: "25%", // Align at the left of the screen
    width: "100%", // Take full width
    height: "50%", // Take full height
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1, // Take at least half the screen height
    width: "100%", // Full width
    height: "100%", // Ensure it covers half the screen or more
    position: "absolute", // Keep it in front of the other content
    zIndex: 1000, // Higher z-index to stay on top
  },
  categoryImage: {
    width: "100%", // Adjust the size as needed
    height: "30%", // Adjust the size as needed
    // borderRadius: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  textStyle: {
    marginTop: 70,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  currentPlayerIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    zIndex: 2,
  },
  currentPlayerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  diceResultContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  diceResultText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  board: {
    flexWrap: "wrap",
    flexDirection: "row",
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    padding: 0,
  },
  boardStyle: {
    width: width - '10%',
    top: '10%'
  },
  square: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#cbd5e0",
  },
  squareNumber: {
    position: "absolute",
    top: 5,
    fontSize: 12,
    color: "#4a5568",
  },
  playerIcon: {
    width: 20,
    height: 35,
    position: "absolute",
    borderRadius: 15,
    zIndex: 2,
  },
  giftIcon: {
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 5,
  },
  button: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 160,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
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
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#1a1a1a",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  difficultyOption: {
    width: "100%",
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  difficultyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a1a1a",
    textAlign: "center",
  },
  taskText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#495057",
    lineHeight: 24,
  },
  timer: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#FF5722",
    fontFamily: "System",
  },
  successButton: {
    backgroundColor: "#4CAF50",
  },
  failButton: {
    backgroundColor: "#F44336",
  },
  rewardPenaltyImage: {
    width: 380,
    height: 320,
    marginBottom: 35,
    marginRight: 80,
  },
  truthDareContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  truthButton: {
    backgroundColor: "#4CAF50",
    width: "48%",
  },
  dareButton: {
    backgroundColor: "#FF5722",
    width: "48%",
  },
  difficultyContainer: {
    width: "100%",
  },
  difficultyEasy: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  difficultyMedium: {
    borderColor: "#FF9800",
    borderWidth: 2,
  },
  difficultyHard: {
    borderColor: "#F44336",
    borderWidth: 2,
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    paddingBottom: 15,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6c757d",
    marginTop: 5,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 1,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#2d3748",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  playerTurnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  yourTurnText: {
    color: "#a0aec0",
    marginBottom: 7,
  },
  playerCard: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#3c4d63",
    padding: 10,
    borderRadius: 20,
    width: "30%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playerCardIcon: {
    width: 30,
    height: 50,
    marginBottom: 8,
  },
  playerCardInfo: {
    alignItems: "center",
  },
  playerCardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  playerCardPosition: {
    fontSize: 12,
    color: "#a0aec0",
    textAlign: "center",
  },
  diceWrapper: {
    alignItems: "center",
    width: "30%",
    backgroundColor: "#3c4d63",
    padding: 12,
    borderRadius: 20,
  },
  dice: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#90cdf4",
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 8,
  },
  rollText: {
    fontSize: 14,
    color: "#a0aec0",
    marginTop: 4,
  },
  nextPlayerPreview: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#3c4d63",
    padding: 10,
    borderRadius: 20,
    width: "30%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nextPlayerInfo: {
    fontSize: 12,
    color: "#a0aec0",
    alignItems: "center",
  },
  nextPlayerIcon: {
    width: 40,
    height: 50,
    marginBottom: 8,
  },
  nextPlayerLabel: {
    fontSize: 12,
    color: "#a0aec0",
    marginBottom: 7,
  },
  nextPlayerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: "#4299e1",
    borderRadius: 6,
    //position: 'absolute',
  },
  infoButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
  },
});
