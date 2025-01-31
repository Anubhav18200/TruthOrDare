import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function EndGameScreen({ route, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Game Over! 🎉</Text>
      <Button title="Play Again" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});
