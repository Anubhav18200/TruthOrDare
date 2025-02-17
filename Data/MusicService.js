// MusicService.js
import { Audio } from 'expo-av';

let backgroundMusic;

export const loadMusic = async () => {
  // Load the music file
  backgroundMusic = new Audio.Sound();
  try {
    await backgroundMusic.loadAsync(require('../assets/main_screen.mp3')); // Replace with your music file
    await backgroundMusic.setIsLoopingAsync(true); // Loop the music
    await backgroundMusic.setVolumeAsync(0.5); // Set volume to 50%
  } catch (error) {
    console.log('Error loading music:', error);
  }
};

export const playMusic = async () => {
  try {
    if (backgroundMusic) {
      await backgroundMusic.playAsync(); // Play music
    }
  } catch (error) {
    console.log('Error playing music:', error);
  }
};

export const stopMusic = async () => {
  try {
    if (backgroundMusic) {
      await backgroundMusic.stopAsync(); // Stop music
    }
  } catch (error) {
    console.log('Error stopping music:', error);
  }
};
