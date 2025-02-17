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

            <View style={styles.cardsContainer}>
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
            </View>

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
        padding: 20,
        alignItems: 'center',
        marginTop: 70
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e94560',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3
    },
    subtitle: {
        fontSize: 16,
        color: '#ffffff',
        opacity: 0.7
    },
    cardsContainer: {
        flex: 1,
    },
    cardsWrapper: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    card: {
        width: 160,
        height: 200,
        marginBottom: 16,
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
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardIcon: {
        fontSize: 40,
        marginBottom: 12
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8
    },
    cardDescription: {
        fontSize: 14,
        color: '#ffffff',
        textAlign: 'center',
        opacity: 0.8
    },
    selectedIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e94560',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkmark: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    footer: {
        height: height - '90%',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(22, 33, 62, 0.9)'
    },
    startButton: {
        backgroundColor: '#e94560',
        borderRadius: 25,
        padding: 16,
        alignItems: 'center',
        marginBottom: 70,
    },
    startButtonDisabled: {
        backgroundColor: '#233554',
        opacity: 0.5
    },
    startButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
