import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function SelectEnvironmentScreen({ route, navigation }) {
    const { players } = route.params;
    const [selectedEnv, setSelectedEnv] = useState(null);

    const environments = [
        { name: 'Home', icon: '🏠' },
        { name: 'Office', icon: '💼' },
        { name: 'Party', icon: '🎉' },
        { name: 'School', icon: '🏫' }
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <Text style={styles.title}>Choose Your Environment</Text>
                
                {/* Environment Cards */}
                <View style={styles.cardsContainer}>
                    {environments.map((env) => (
                        <TouchableOpacity
                            key={env.name}
                            style={[
                                styles.card,
                                selectedEnv === env.name && styles.selectedCard
                            ]}
                            onPress={() => setSelectedEnv(env.name)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardContent}>
                                <Text style={styles.icon}>{env.icon}</Text>
                                <View style={styles.cardTextContainer}>
                                    <Text style={[
                                        styles.cardTitle,
                                        selectedEnv === env.name && styles.selectedText
                                    ]}>
                                        {env.name}
                                    </Text>
                                    <Text style={[
                                        styles.cardSubtitle,
                                        selectedEnv === env.name && styles.selectedSubtext
                                    ]}>
                                        Tap to select
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        !selectedEnv && styles.disabledButton
                    ]}
                    disabled={!selectedEnv}
                    onPress={() => navigation.navigate('GameBoard', {
                        players,
                        environment: selectedEnv
                    })}
                >
                    <Text style={styles.nextButtonText}>Continue to Game</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5E6'
    },
    content: {
        marginTop: 70,
        padding: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8B4513',
        marginBottom: 24,
        textAlign: 'center'
    },
    cardsContainer: {
        width: '100%'
    },
    card: {
        backgroundColor: '#FFB74D',
        borderRadius: 16,
        marginBottom: 16,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    selectedCard: {
        backgroundColor: '#FF8F00',
        transform: [{ scale: 1.02 }],
        elevation: 5
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        fontSize: 32,
        marginRight: 16
    },
    cardTextContainer: {
        flex: 1
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5D4037'
    },
    selectedText: {
        color: '#FFF'
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#8D6E63',
        marginTop: 4
    },
    selectedSubtext: {
        color: '#FFF3E0'
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        width: '80%',
        marginTop: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
        elevation: 0
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});