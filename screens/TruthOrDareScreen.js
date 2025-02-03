// import React from 'react';
// import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

// const questions = {
//     Home: {
//       truth: ["Have you ever broken something and blamed someone else?", "What's the most embarrassing thing your parents have caught you doing?"],
//       dare: ["Sing a song loudly for 1 minute.", "Do 10 push-ups right now."],
//     },
//     Office: {
//       truth: ["Have you ever taken credit for someone else's work?", "What's the worst excuse you've used for missing a deadline?"],
//       dare: ["Send a funny meme to your manager.", "Speak in a robot voice for the next 5 minutes."],
//     },
//     Party: {
//       truth: ["Have you ever kissed someone at a party?", "What's the wildest thing you've done at a party?"],
//       dare: ["Dance for 1 minute without music.", "Take a silly selfie and post it on social media."],
//     },
//     School: {
//       truth: ["Have you ever cheated on a test?", "What's the most embarrassing thing that's happened to you in class?"],
//       dare: ["Talk in a funny accent for the next 5 minutes.", "Act like a teacher for the next 2 minutes."],
//     },
//   };
  
//   export default function TruthOrDareScreen({ route, navigation }) {
//     const { player, environment } = route.params;
  
//     const getRandomQuestion = (type) => {
//       const questionList = questions[environment][type];
//       return questionList[Math.floor(Math.random() * questionList.length)];
//     };
  
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>{player.name}, choose your challenge!</Text>
//         <TouchableOpacity style={styles.button} onPress={() => alert(getRandomQuestion("truth"))}>
//           <Text style={styles.buttonText}>Truth</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => alert(getRandomQuestion("dare"))}>
//           <Text style={styles.buttonText}>Dare</Text>
//         </TouchableOpacity>
//         <Button title="Next Player" onPress={() => navigation.navigate('GameBoard')} />
//       </View>
//     );
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: '#F5F5F5',
//       padding: 20,
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: 'bold',
//       marginBottom: 30,
//       textAlign: 'center',
//       color: '#333',
//     },
//     button: {
//       backgroundColor: '#FF9800',
//       paddingVertical: 15,
//       paddingHorizontal: 30,
//       borderRadius: 8,
//       marginVertical: 10,
//       width: 200,
//       alignItems: 'center',
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 3,
//       elevation: 5,
//     },
//     buttonText: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       color: '#FFF',
//     },
//   });
  