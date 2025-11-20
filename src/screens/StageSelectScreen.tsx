import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LEVELS } from '../constants/levels';
import { loadGameData } from '../utils/storage';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

interface StageSelectScreenProps {
    onSelectLevel: (levelId: number) => void;
    onBack: () => void;
}

const STAGE_ICONS = [
    require('../../assets/char1.png'),
    require('../../assets/char2.png'),
    require('../../assets/char3.png'),
    require('../../assets/char4.png'),
    require('../../assets/char5.png'),
    require('../../assets/char6.png'),
    require('../../assets/char7.png'),
    require('../../assets/char8.png'),
    require('../../assets/char9.png'),
    require('../../assets/images/bomb.png'),
    require('../../assets/images/dokan.png'),
    require('../../assets/images/ring.png'),
    require('../../assets/images/kesigomu.png'),
];

export const StageSelectScreen: React.FC<StageSelectScreenProps> = ({
    onSelectLevel,
    onBack,
}) => {
    const [highScores, setHighScores] = useState<Record<number, number>>({});

    useEffect(() => {
        const loadData = async () => {
            const data = await loadGameData();
            setHighScores(data.highScores || {});
        };
        loadData();
    }, []);

    return (
        <ImageBackground
            source={require('../../assets/images/bg_stage1.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>STAGE MAP</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.mapContainer}>
                        {LEVELS.map((level, index) => {
                            // Unlock logic:
                            // Level 1 (index 0) is always unlocked.
                            // Other levels are unlocked if the PREVIOUS level has a high score > 0.
                            const prevLevelId = index > 0 ? LEVELS[index - 1].id : 0;
                            const isUnlocked = index === 0 || (highScores[prevLevelId] || 0) > 0;
                            const iconSource = STAGE_ICONS[index % STAGE_ICONS.length];

                            return (
                                <TouchableOpacity
                                    key={level.id}
                                    style={[
                                        styles.stageNode,
                                        isUnlocked ? styles.unlockedNode : styles.lockedNode,
                                    ]}
                                    onPress={() => {
                                        if (isUnlocked) {
                                            onSelectLevel(index);
                                        }
                                    }}
                                    disabled={!isUnlocked}
                                >
                                    {isUnlocked && (
                                        <Image
                                            source={iconSource}
                                            style={styles.nodeImage}
                                            resizeMode="contain"
                                        />
                                    )}
                                    <View style={styles.nodeContent}>
                                        {isUnlocked ? (
                                            <>
                                                {/* <Text style={styles.stageNumber}>{level.id}</Text> */}
                                            </>
                                        ) : (
                                            <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.5)" />
                                        )}
                                    </View>
                                    <Text style={styles.stageName}>{level.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </SafeAreaView>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    mapContainer: {
        padding: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
        paddingBottom: 40,
    },
    stageNode: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    unlockedNode: {
        // No background or border for unlocked nodes (image only)
        overflow: 'visible',
    },
    lockedNode: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        backgroundColor: '#333',
        borderColor: '#555',
    },
    nodeImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    nodeContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    stageNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    stageName: {
        position: 'absolute',
        bottom: -25,
        color: '#fff',
        fontSize: 10,
        width: 100,
        textAlign: 'center',
        fontWeight: '600',
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 2,
    },
});
