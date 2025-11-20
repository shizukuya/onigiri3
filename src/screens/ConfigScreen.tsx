import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Switch, ScrollView, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { loadGameData, saveGameData } from '../utils/storage';

const { width, height } = Dimensions.get('window');

interface ConfigScreenProps {
    onBack: () => void;
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ onBack }) => {
    const [bgmEnabled, setBgmEnabled] = useState(true);

    useEffect(() => {
        loadGameData().then(data => {
            setBgmEnabled(data.bgmEnabled);
        });
    }, []);

    const toggleBgm = async (value: boolean) => {
        setBgmEnabled(value);
        await saveGameData({ bgmEnabled: value });
    };

    return (
        <ImageBackground
            source={require('../../assets/images/config-bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.header}>
                    <Text style={styles.title}>CONFIG</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>BGM</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: COLORS.primary }}
                            thumbColor={bgmEnabled ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleBgm}
                            value={bgmEnabled}
                        />
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>How to Play</Text>
                    <ScrollView style={styles.instructionsContainer}>
                        <Text style={styles.instructionText}>
                            1. Swap adjacent pieces to match 3 or more of the same type.
                        </Text>
                        <Text style={styles.instructionText}>
                            2. Create matches to score points and clear the stage target.
                        </Text>
                        <Text style={styles.instructionText}>
                            3. Use special items for massive destruction:
                        </Text>

                        <View style={styles.itemRow}>
                            <Image source={require('../../assets/images/bomb.png')} style={styles.itemImage} resizeMode="contain" />
                            <Text style={styles.itemDescription}>Bomb: Explodes a large area.</Text>
                        </View>

                        <View style={styles.itemRow}>
                            <Image source={require('../../assets/images/dokan.png')} style={styles.itemImage} resizeMode="contain" />
                            <Text style={styles.itemDescription}>Pipe: Clears a vertical column.</Text>
                        </View>

                        <View style={styles.itemRow}>
                            <Image source={require('../../assets/images/ring.png')} style={styles.itemImage} resizeMode="contain" />
                            <Text style={styles.itemDescription}>Ring: Clears a surrounding area.</Text>
                        </View>

                        <View style={styles.itemRow}>
                            <Image source={require('../../assets/images/kesigomu.png')} style={styles.itemImage} resizeMode="contain" />
                            <Text style={styles.itemDescription}>Eraser: Clears a horizontal row.</Text>
                        </View>

                        <Text style={styles.instructionText}>
                            4. Watch out for your remaining moves!
                        </Text>
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>BACK</Text>
                </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    content: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 20,
        flex: 1,
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    settingLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 15,
    },
    instructionsContainer: {
        flex: 1,
    },
    instructionText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        lineHeight: 24,
    },
    instructionSubText: {
        fontSize: 15,
        color: '#555',
        marginBottom: 5,
        marginLeft: 20,
        lineHeight: 22,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 10,
    },
    itemImage: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    itemDescription: {
        fontSize: 15,
        color: '#555',
        flex: 1,
    },
    backButton: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
