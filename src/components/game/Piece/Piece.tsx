/**
 * Pieceコンポーネント - 個々のゲームピース
 */

import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  withRepeat,
} from 'react-native-reanimated';
import { PieceType } from '../../../types/game';
import { styles } from './Piece.styles';

// キャラクター画像のマッピング
const PIECE_IMAGES: Record<PieceType, any> = {
  1: require('../../../../assets/char11.png'),
  2: require('../../../../assets/char2.png'),
  3: require('../../../../assets/char3.png'),
  4: require('../../../../assets/char4.png'),
  5: require('../../../../assets/char5.png'),
  6: require('../../../../assets/char6.png'),
  7: require('../../../../assets/char7.png'),
  8: require('../../../../assets/char8.png'),
  9: require('../../../../assets/char9.png'),
};

interface PieceProps {
  type: PieceType;
  size: number;
  isSelected: boolean;
  shouldDisappear?: boolean;
  isHint?: boolean;
}

export const Piece: React.FC<PieceProps> = ({
  type,
  size,
  isSelected,
  shouldDisappear = false,
  isHint = false,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const burst = useSharedValue(0);
  const hintPulse = useSharedValue(0);
  const shimmer = useSharedValue(0);

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
          withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
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
      burst.value = 0;
      burst.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) });
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
    const pulse = isHint ? 1 + hintPulse.value * 0.12 : 1;
    const glow = shimmer.value ? shimmer.value * 12 : 0;
    return {
      transform: [
        { scale: scale.value * pulse },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
      shadowColor: 'rgba(255,255,255,0.7)',
      shadowOpacity: shimmer.value ? 0.8 : 0.25,
      shadowRadius: 6 + glow,
      shadowOffset: { width: 0, height: shimmer.value ? 0 : 2 },
    };
  });

  const sparkStyles = Array.from({ length: 8 }).map((_, idx) => {
    const angle = (Math.PI * 2 * idx) / 8;
    const distance = size * 0.35;
    return useAnimatedStyle(() => {
      const progress = burst.value;
      const translateX = Math.cos(angle) * distance * progress;
      const translateY = Math.sin(angle) * distance * progress;
      const fade = 1 - progress;
      return {
        opacity: fade,
        transform: [
          { translateX },
          { translateY },
          { scale: 1 + progress * 0.5 },
        ],
      };
    });
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
            borderColor: '#FFD700',
          },
        ]}
      >
        {shouldDisappear && (
          <View style={styles.particleLayer} pointerEvents="none">
            {sparkStyles.map((animated, i) => (
              <Animated.View key={`spark-${i}`} style={[styles.spark, animated]} />
            ))}
          </View>
        )}
        <Image
          source={PIECE_IMAGES[type]}
          style={[styles.image, { width: size * 0.85, height: size * 0.85 }]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};
