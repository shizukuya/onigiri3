import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    runOnJS,
    Easing,
} from 'react-native-reanimated';
import { Position, PieceType } from '../../../types/game';
import { COLORS } from '../../../constants/colors';
import { GAME_CONFIG } from '../../../constants/game';

const { GRID_SIZE } = GAME_CONFIG;

interface ParticleProps {
    startPos: { x: number; y: number };
    color: string;
    angle: number;
    distance: number;
    delay: number;
}

const Particle: React.FC<ParticleProps> = ({ startPos, color, angle, distance, delay }) => {
    const opacity = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        const rad = (angle * Math.PI) / 180;
        const toX = Math.cos(rad) * distance;
        const toY = Math.sin(rad) * distance;

        translateX.value = withDelay(delay, withTiming(toX, { duration: 600, easing: Easing.out(Easing.quad) }));
        translateY.value = withDelay(delay, withTiming(toY, { duration: 600, easing: Easing.out(Easing.quad) }));
        opacity.value = withDelay(delay + 300, withTiming(0, { duration: 300 }));
        scale.value = withDelay(delay, withTiming(0, { duration: 600 }));
    }, []);

    const style = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ],
        };
    });

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    backgroundColor: color,
                    left: startPos.x,
                    top: startPos.y,
                },
                style,
            ]}
        />
    );
};

interface ParticleOverlayProps {
    positions: Position[];
    gridSize: number; // width of the board
    onComplete: () => void;
}

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({ positions, gridSize, onComplete }) => {
    const cellSize = gridSize / GRID_SIZE;

    useEffect(() => {
        const timer = setTimeout(onComplete, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Generate particles for each position
    const particles = positions.flatMap((pos, index) => {
        const centerX = pos.col * cellSize + cellSize / 2;
        const centerY = pos.row * cellSize + cellSize / 2;

        // Create 8 particles per match position
        return Array.from({ length: 8 }).map((_, i) => ({
            id: `${pos.row}-${pos.col}-${i}`,
            startPos: { x: centerX, y: centerY },
            color: '#FFF', // Can be dynamic based on piece type if passed
            angle: i * 45 + Math.random() * 20,
            distance: cellSize * 0.8 + Math.random() * 20,
            delay: index * 50, // Stagger slightly
        }));
    });

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map((p) => (
                <Particle
                    key={p.id}
                    startPos={p.startPos}
                    color={p.color}
                    angle={p.angle}
                    distance={p.distance}
                    delay={p.delay}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    particle: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
