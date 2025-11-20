import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface TitleScreenProps {
    onStart: () => void;
    onConfig: () => void;
    onStageSelect: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onConfig, onStageSelect }) => {
    return (
        <ImageBackground
            source={require('../../assets/images/top-bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Onigiri3</Text>
                    <Text style={styles.subtitle}>おにぎりさん</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={onStart}>
                        <Text style={styles.buttonText}>START</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.mapButton]} onPress={onStageSelect}>
                        <Text style={styles.buttonText}>STAGE MAP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.configButton]} onPress={onConfig}>
                        <Text style={styles.buttonText}>CONFIG</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        marginBottom: 80,
        alignItems: 'center',
    },
    title: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        fontFamily: 'System', // Use default system font or custom if available
    },
    subtitle: {
        fontSize: 24,
        color: '#FFD700',
        marginTop: 10,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    buttonContainer: {
        width: '80%',
        gap: 20,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    configButton: {
        backgroundColor: COLORS.secondary,
    },
    mapButton: {
        backgroundColor: '#4A90E2', // Blue for map
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});
