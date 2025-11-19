/**
 * Headerコンポーネント - ゲームヘッダー
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Header.styles';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Match-3 Puzzle' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
