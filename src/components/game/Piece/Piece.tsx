/**
 * Pieceコンポーネント - 個々のゲームピース
 */

import React, { useEffect, useMemo } from 'react';
import { Image, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';
import { PieceType, SpecialType } from '../../../types/game';
import { styles } from './Piece.styles';

// キャラクター画像のマッピング
const PIECE_IMAGES: Record<PieceType, any> = {
  1: require('../../../../assets/char1.png'),
  2: require('../../../../assets/char2.png'),
  3: require('../../../../assets/char3.png'),
  4: require('../../../../assets/char4.png'),
  5: require('../../../../assets/char5.png'),
  6: require('../../../../assets/char6.png'),
  7: require('../../../../assets/char7.png'),
  8: require('../../../../assets/char8.png'),
  9: require('../../../../assets/char9.png'),
  99: require('../../../../assets/images/block.png'), // Fallback/Type satisfaction
};

// Special Images
const SPECIAL_IMAGES: Record<string, any> = {
  bomb: require('../../../../assets/images/bomb.png'),
  dokan: require('../../../../assets/images/dokan.png'),
  ring: require('../../../../assets/images/ring.png'),
  kesigomu: require('../../../../assets/images/kesigomu.png'),
  superpink: require('../../../../assets/images/superpink.png'),
};

interface ParticleProps {
  x: number;
  y: number;
  color: string;
  delay: number;
  shouldDisappear: boolean;
}

const Particle: React.FC<ParticleProps> = ({ x, y, color, delay, shouldDisappear }) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (!shouldDisappear) {
      return {
        opacity: 0,
        transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 0 }],
      };
    }

    return {
      opacity: withDelay(
        delay,
        withSequence(withTiming(1, { duration: 50 }), withTiming(0, { duration: 350 }))
      ),
      transform: [
        {
          translateX: withDelay(
            delay,
            withTiming(x, { duration: 400, easing: Easing.out(Easing.exp) })
          ),
        },
        {
          translateY: withDelay(
            delay,
            withTiming(y, { duration: 400, easing: Easing.out(Easing.exp) })
          ),
        },
        {
          scale: withDelay(
            delay,
            withSequence(withTiming(1, { duration: 50 }), withTiming(0, { duration: 350 }))
          ),
        },
      ],
      backgroundColor: color,
    };
  });

  return <Animated.View style={[styles.spark, animatedStyle]} />;
};

interface PieceProps {
  type: PieceType;
  size: number;
  isSelected: boolean;
  shouldDisappear?: boolean;
  isHint?: boolean;
  special?: SpecialType;
  isBlock?: boolean;
}

export const Piece = React.memo(({
  type,
  size,
  isSelected,
  shouldDisappear = false,
  isHint = false,
  special = 'none',
  isBlock = false,
}: PieceProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const hintPulse = useSharedValue(0);
  const shimmer = useSharedValue(0);
  const specialPulse = useSharedValue(0);

  // Special piece animation
  useEffect(() => {
    if (special !== 'none') {
      specialPulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1.0, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      specialPulse.value = 1;
    }
  }, [special]);

  // 選択時のアニメーション
  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 300 }),
        withSpring(1.05, { damping: 8, stiffness: 300 })
      );
    } else {
      scale.value = withSpring(1.0, { damping: 8, stiffness: 300 });
    }
  }, [isSelected]);

  // ヒントハイライト
  useEffect(() => {
    if (isHint) {
      hintPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 800, easing: Easing.in(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      hintPulse.value = 0;
    }
  }, [isHint]);

  // 消滅時のアニメーション
  useEffect(() => {
    if (shouldDisappear) {
      scale.value = withTiming(0, {
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(0, {
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      rotation.value = withTiming(360, {
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      shimmer.value = withTiming(1, { duration: 150 });
    } else {
      scale.value = withSpring(1.0, {
        damping: 6,
        stiffness: 200,
      });
      opacity.value = 1;
      rotation.value = 0;
      shimmer.value = 0;
    }
  }, [shouldDisappear]);

  const animatedStyle = useAnimatedStyle(() => {
    const pulse = isHint ? 1 + hintPulse.value * 0.2 : 1;
    const glow = shimmer.value ? shimmer.value * 12 : 0;
    const sPulse = special !== 'none' ? specialPulse.value : 1;

    return {
      transform: [
        { scale: scale.value * pulse * sPulse },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
      shadowColor: special !== 'none' ? '#FFD700' : 'rgba(255,255,255,0.7)',
      shadowOpacity: shimmer.value ? 0.8 : (special !== 'none' ? 0.6 : 0.25),
      shadowRadius: 6 + glow + (special !== 'none' ? 5 : 0),
      shadowOffset: { width: 0, height: shimmer.value ? 0 : 2 },
    };
  });

  // パーティクル生成
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = Math.random() * 40 + 20;
      const delay = Math.random() * 100;
      const color = ['#FFD700', '#FF6347', '#00BFFF', '#32CD32'][Math.floor(Math.random() * 4)];

      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        delay,
        color,
      };
    });
  }, []);

  const hintOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: isHint ? hintPulse.value * 0.5 : 0,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.pieceContainer,
          animatedStyle,
          {
            width: size * 0.9,
            height: size * 0.9,
            borderRadius: 12,
            borderWidth: isSelected ? 3 : 0,
            borderColor: isSelected ? '#FFD700' : 'transparent',
            backgroundColor: isBlock ? '#555' : undefined,
          },
        ]}
      >
        {shouldDisappear && (
          <View style={styles.particleLayer} pointerEvents="none">
            {particles.map((p, i) => (
              <Particle
                key={i}
                x={p.x}
                y={p.y}
                color={p.color}
                delay={p.delay}
                shouldDisappear={shouldDisappear}
              />
            ))}
          </View>
        )}

        {/* Block Overlay */}
        {isBlock ? (
          <Image
            source={require('../../../../assets/images/block.png')}
            style={[
              styles.image,
              {
                width: size * 0.9,
                height: size * 0.9,
              }
            ]}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={special !== 'none' && SPECIAL_IMAGES[special] ? SPECIAL_IMAGES[special] : PIECE_IMAGES[type]}
            style={[
              styles.image,
              {
                width: size * 0.85,
                height: size * 0.85,
              }
            ]}
            resizeMode="contain"
          />
        )}
        {/* Hint Overlay */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              borderRadius: 12,
            },
            hintOverlayStyle
          ]}
        />
      </Animated.View>
    </View>
  );
});
