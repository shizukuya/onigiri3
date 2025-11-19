import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { Position, SpecialType } from '../../../types/game';
import { GAME_CONFIG } from '../../../constants/game';

const { width } = Dimensions.get('window');
const GRID_SIZE = GAME_CONFIG.GRID_SIZE;
const BOARD_PADDING = 4;
const BOARD_SIZE = width - BOARD_PADDING * 2;
const PIECE_SIZE = BOARD_SIZE / GRID_SIZE;

interface SpecialEffectOverlayProps {
    type: SpecialType;
    position: Position;
    onComplete: () => void;
}

export const SpecialEffectOverlay: React.FC<SpecialEffectOverlayProps> = ({
    type,
    position,
    onComplete,
}) => {
    const progress = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        progress.value = withSequence(
            withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) }),
            withTiming(1, { duration: 0 }, (finished) => {
                if (finished) {
                    runOnJS(onComplete)();
                }
            })
        );
        opacity.value = withSequence(
            withDelay(300, withTiming(0, { duration: 300 }))
        );
    }, []);

    // Calculate absolute position based on grid logic (simplified)
    // This assumes the overlay covers the entire grid area
    // We need to position the effect relative to the specific cell
    const top = position.row * PIECE_SIZE + PIECE_SIZE / 2;
    const left = position.col * PIECE_SIZE + PIECE_SIZE / 2;

    const bombStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: progress.value * 8 }], // Expand to cover ~3x3+
            opacity: opacity.value,
        };
    });

    const ringStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: progress.value * 6 }],
            borderWidth: 20 * (1 - progress.value),
            opacity: opacity.value,
        };
    });

    const beamVerticalStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scaleY: progress.value * GRID_SIZE * 2 }], // Stretch vertically
            opacity: opacity.value,
        };
    });

    const beamHorizontalStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scaleX: progress.value * GRID_SIZE * 2 }], // Stretch horizontally
            opacity: opacity.value,
        };
    });

    if (type === 'none') return null;

    return (
        <View style={[styles.container, { top, left }]} pointerEvents="none">
            {type === 'bomb' && (
                <Animated.View style={[styles.bomb, bombStyle]} />
            )}
            {type === 'ring' && (
                <Animated.View style={[styles.ring, ringStyle]} />
            )}
            {type === 'dokan' && (
                <Animated.View style={[styles.beamVertical, beamVerticalStyle]} />
            )}
            {type === 'kesigomu' && (
                <Animated.View style={[styles.beamHorizontal, beamHorizontalStyle]} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 0,
        height: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    bomb: {
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        borderRadius: PIECE_SIZE / 2,
        backgroundColor: 'rgba(255, 69, 0, 0.6)', // Red-Orange
        position: 'absolute',
    },
    ring: {
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        borderRadius: PIECE_SIZE / 2,
        borderColor: 'rgba(0, 191, 255, 0.8)', // Deep Sky Blue
        position: 'absolute',
    },
    beamVertical: {
        width: PIECE_SIZE * 0.8,
        height: PIECE_SIZE,
        backgroundColor: 'rgba(50, 205, 50, 0.7)', // Lime Green
        position: 'absolute',
    },
    beamHorizontal: {
        width: PIECE_SIZE,
        height: PIECE_SIZE * 0.8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // White
        position: 'absolute',
    },
});
