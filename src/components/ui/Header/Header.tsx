/**
 * Headerコンポーネント - ゲームヘッダー
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Header.styles';

interface HeaderProps {
  title?: string;
  description?: string;
  badge?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Match-3 Puzzle',
  description = 'Ease into a soft-focus run.',
  badge = 'Chill Session',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};
