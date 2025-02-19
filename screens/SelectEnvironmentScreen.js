import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { stopMusic } from '../Data/MusicService'; // Import stopMusic from MusicService

const { width, height } = Dimensions.get('window');

export default function SelectEnvironmentScreen({ route, navigation }) {
    const { players } = route.params;
    const [selectedEnv, setSelectedEnv] = useState(null);
    const [scaleAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        return () => {
          stopMusic(); // Stop music when navigating to GameBoardScreen
        };
      }, []);

    const environments = [
        { name: 'Home', icon: '🏠', description: 'Casual and comfortable setting', gradient: ['#2193b0', '#6dd5ed'] },
        { name: 'Office', icon: '💼', description: 'Professional environment', gradient: ['#8E2DE2', '#4A00E0'] },
        { name: 'Party', icon: '🎉', description: 'Fun and exciting atmosphere', gradient: ['#FF416C', '#FF4B2B'] },
        { name: 'School', icon: '🏫', description: 'Educational setting', gradient: ['#FFEB3B', '#FF9800'] }
    ];

    const handleSelect = (name) => {
        setSelectedEnv(name);
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.05,
                duration: 150,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true
            })
        ]).start();
    };

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e']}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Choose Your Vibe</Text>
                <Text style={styles.subtitle}>Select the perfect mood for your game</Text>
            </View>

            <ScrollView contentContainerStyle={styles.cardsContainer}>
                <View style={styles.cardsWrapper}>
                    {environments.map((env) => (
                        <TouchableOpacity
                            key={env.name}
                            onPress={() => handleSelect(env.name)}
                            activeOpacity={0.9}
                        >
                            <Animated.View
                                style={[
                                    styles.card,
                                    selectedEnv === env.name && styles.selectedCard,
                                    { transform: [{ scale: selectedEnv === env.name ? scaleAnim : 1 }] }
                                ]}
                            >
                                <LinearGradient
                                    colors={env.gradient}
                                    style={styles.cardGradient}
                                >
                                    <Text style={styles.cardIcon}>{env.icon}</Text>
                                    <Text style={styles.cardTitle}>{env.name}</Text>
                                    <Text style={styles.cardDescription}>{env.description}</Text>
                                    {selectedEnv === env.name && (
                                        <View style={styles.selectedIndicator}>
                                            <Text style={styles.checkmark}>✓</Text>
                                        </View>
                                    )}
                                </LinearGradient>
                            </Animated.View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.startButton, !selectedEnv && styles.startButtonDisabled]}
                    onPress={() => {
                        if (selectedEnv) {
                            const selectedEnvironment = environments.find(env => env.name === selectedEnv);
                            navigation.navigate('GameBoard', {
                                players,
                                environment: selectedEnvironment.name
                            });
                        }
                    }}
                    disabled={!selectedEnv}
                >
                    <Text style={styles.startButtonText}>
                        {selectedEnv ? "Let's Begin!" : "Select a Mode"}
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        padding: width * 0.05, // 5% of screen width
        alignItems: 'center',
        marginTop: height * 0.07 // 7% of screen height
    },
    title: {
        fontSize: width * 0.08, // 8% of screen width
        fontWeight: 'bold',
        color: '#e94560',
        marginBottom: height * 0.01, // 1% of screen height
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3
    },
    subtitle: {
        fontSize: width * 0.04, // 4% of screen width
        color: '#ffffff',
        opacity: 0.7
    },
    cardsContainer: {
        flexGrow: 1,
        padding: width * 0.03, // 3% of screen width
    },
    cardsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: width * 0.43, // 43% of screen width
        height: height * 0.25, // 25% of screen height
        marginBottom: height * 0.02, // 2% of screen height
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    selectedCard: {
        borderWidth: 3,
        borderColor: 'yellow'
    },
    cardGradient: {
        flex: 1,
        padding: width * 0.04, // 4% of screen width
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardIcon: {
        fontSize: width * 0.1, // 10% of screen width
        marginBottom: height * 0.01 // 1% of screen height
    },
    cardTitle: {
        fontSize: width * 0.045, // 4.5% of screen width
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: height * 0.01 // 1% of screen height
    },
    cardDescription: {
        fontSize: width * 0.035, // 3.5% of screen width
        color: '#ffffff',
        textAlign: 'center',
        opacity: 0.8
    },
    selectedIndicator: {
        position: 'absolute',
        top: height * 0.01, // 1% of screen height
        right: width * 0.03, // 3% of screen width
        width: width * 0.06, // 6% of screen width
        height: width * 0.06, // 6% of screen width
        borderRadius: width * 0.03, // 3% of screen width
        backgroundColor: '#e94560',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkmark: {
        color: '#ffffff',
        fontSize: width * 0.04, // 4% of screen width
        fontWeight: 'bold'
    },
    footer: {
        padding: width * 0.05, // 5% of screen width
        backgroundColor: 'rgba(22, 33, 62, 0.9)'
    },
    startButton: {
        backgroundColor: '#e94560',
        borderRadius: 25,
        padding: height * 0.02, // 2% of screen height
        alignItems: 'center',
        marginBottom: height * 0.02 // 2% of screen height
    },
    startButtonDisabled: {
        backgroundColor: '#233554',
        opacity: 0.5
    },
    startButtonText: {
        color: '#ffffff',
        fontSize: width * 0.045, // 4.5% of screen width
        fontWeight: 'bold'
    }
});