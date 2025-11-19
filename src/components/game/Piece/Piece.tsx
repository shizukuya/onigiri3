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
}

export const Piece: React.FC<PieceProps> = ({
  type,
  size,
  isSelected,
  shouldDisappear = false,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

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
    } else {
      scale.value = withSpring(1.0, {
        damping: 6,
        stiffness: 200,
      });
      opacity.value = 1;
      rotation.value = 0;
    }
  }, [shouldDisappear]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
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
            borderColor: '#FFD700',
          },
        ]}
      >
        <Image
          source={PIECE_IMAGES[type]}
          style={[styles.image, { width: size * 0.85, height: size * 0.85 }]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};
