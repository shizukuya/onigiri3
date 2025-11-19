import React, { useEffect } from 'react';
import { StyleSheet, Text, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { Position } from '../../../types/game';
import { GAME_CONFIG } from '../../../constants/game';
import { COLORS } from '../../../constants/colors';

interface FloatingScoreProps {
    score: number;
    position: Position;
    onComplete: () => void;
    combo?: number;
}

export const FloatingScore: React.FC<FloatingScoreProps> = ({
    score,
    position,
    onComplete,
    combo = 0,
}) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(0.5);
    const comboScale = useSharedValue(0.5);

    useEffect(() => {
        translateY.value = withSequence(
            withTiming(-50, { duration: 600, easing: Easing.out(Easing.back(1.5)) }),
            withTiming(-80, { duration: 400 })
        );

        scale.value = withSequence(
            withTiming(1.2, { duration: 200 }),
            withTiming(1, { duration: 200 })
        );

        opacity.value = withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0, { duration: 400 }, (finished) => {
                if (finished) {
                    runOnJS(onComplete)();
                }
            })
        );

        if (combo > 1) {
            comboScale.value = withSequence(
                withTiming(1.5 + Math.min(combo * 0.1, 1), { duration: 200, easing: Easing.bounce }),
                withTiming(1, { duration: 200 })
            );
        }
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { scale: scale.value },
            ],
            opacity: opacity.value,
        };
    });

    const comboAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: comboScale.value }],
        };
    });

    const getComboColor = (c: number) => {
        if (c < 3) return '#FF4500'; // Orange Red
        if (c < 5) return '#FFD700'; // Gold
        if (c < 8) return '#FF1493'; // Deep Pink
        return '#00FFFF'; // Aqua (Rainbow-ish)
    };

    // グリッド座標をピクセル座標に変換
    const { width } = Dimensions.get('window');
    const BOARD_PADDING = 20;
    const BOARD_SIZE = width - BOARD_PADDING * 2;
    const pieceSize = BOARD_SIZE / GAME_CONFIG.GRID_SIZE;

    return (
        <Animated.View
            style={[
                styles.container,
                animatedStyle,
                {
                    top: position.row * pieceSize + pieceSize / 2 - 20,
                    left: position.col * pieceSize + pieceSize / 2,
                },
            ]}
            pointerEvents="none"
        >
            <Text style={styles.text}>+{score}</Text>
            {combo > 1 && (
                <Animated.Text
                    style={[
                        styles.comboText,
                        comboAnimatedStyle,
                        { color: getComboColor(combo), fontSize: 18 + Math.min(combo * 2, 20) }
                    ]}
                >
                    {combo} Combo!
                </Animated.Text>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    text: {
        color: COLORS.textAccent,
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    comboText: {
        fontWeight: 'bold',
        marginTop: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
});
