/**
 * ComboDisplayコンポーネント - コンボ表示
 */

import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { styles } from './ComboDisplay.styles';
import { ANIMATION_DURATION } from '../../../constants/game';

interface ComboDisplayProps {
  combo: number;
}

export const ComboDisplay: React.FC<ComboDisplayProps> = ({ combo }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (combo > 1) {
      opacity.value = 1;
      scale.value = withSequence(
        withSpring(1.5, { damping: 8, stiffness: 150 }),
        withSpring(1.0, { damping: 8, stiffness: 150 })
      );

      // フェードアウト
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 });
      }, ANIMATION_DURATION.COMBO_DISPLAY);
    } else {
      opacity.value = 0;
    }
  }, [combo]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  if (combo <= 1) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.comboText}>COMBO x{combo}!</Text>
    </Animated.View>
  );
};
