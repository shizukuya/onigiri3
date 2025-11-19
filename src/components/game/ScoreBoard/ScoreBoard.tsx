/**
 * ScoreBoardコンポーネント - スコアと手数の表示
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ScoreBoard.styles';

interface ScoreBoardProps {
  score: number;
  moves: number;
  highScore: number;
  targetScore: number;
  lives: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  moves,
  highScore,
  targetScore,
  lives,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreSection}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
      </View>

      <View style={styles.movesSection}>
        <Text style={styles.label}>MOVES</Text>
        <Text style={[styles.movesValue, moves <= 5 && styles.movesWarning]}>
          {moves}
        </Text>
      </View>

      <View style={styles.targetSection}>
        <Text style={styles.label}>TARGET</Text>
        <Text style={styles.targetValue}>{targetScore.toLocaleString()}</Text>
      </View>

      <View style={styles.livesSection}>
        <Text style={styles.label}>LIVES</Text>
        <Text style={styles.livesValue}>{lives}</Text>
      </View>

      {highScore > 0 && (
        <View style={styles.highScoreSection}>
          <Text style={styles.highScoreLabel}>Best: {highScore.toLocaleString()}</Text>
        </View>
      )}
    </View>
  );
};
