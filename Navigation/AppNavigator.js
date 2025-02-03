import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import AddPlayersScreen from '../screens/AddPlayersScreen';
import SelectEnvironmentScreen from '../screens/SelectEnvironmentScreen';
import GameBoardScreen from '../screens/GameBoardScreen';
import TruthOrDareScreen from '../screens/TruthOrDareScreen';
import EndGameScreen from '../screens/EndGameScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddPlayers" component={AddPlayersScreen} />
        <Stack.Screen name="SelectEnvironment" component={SelectEnvironmentScreen} />
        <Stack.Screen name="GameBoard" component={GameBoardScreen} />
        {/* <Stack.Screen name="TruthOrDare" component={TruthOrDareScreen} /> */}
        <Stack.Screen name="EndGame" component={EndGameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
