/**
 * ScoreBoardコンポーネント - スコアと手数の表示
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ScoreBoard.styles';
import { COLORS } from '../../../constants/colors';

interface ScoreBoardProps {
  score: number;
  moves: number;
  highScore: number;
  targetScore: number;
  lives: number;
}

const formatNumber = (value: number) => value.toLocaleString();

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  moves,
  highScore,
  targetScore,
  lives,
}) => {
  const progress = Math.min(score / targetScore, 1);
  const progressPercent = Math.round(progress * 100);

  const statCards = [
    {
      label: 'Score',
      value: formatNumber(score),
      accent: COLORS.primary,
    },
    {
      label: 'Moves',
      value: moves.toString(),
      accent: moves <= 5 ? '#FF6B6B' : COLORS.secondary,
    },
    {
      label: 'Target',
      value: formatNumber(targetScore),
      accent: '#FFD166',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.statRow}>
        {statCards.map((card) => (
          <View key={card.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{card.label}</Text>
            <Text style={[styles.statValue, card.label === 'Moves' && moves <= 5 && styles.movesWarning]}>
              {card.value}
            </Text>
          </View>
        ))}
        <View style={styles.livesCard}>
          <Text style={styles.statLabel}>Lives</Text>
          <View style={styles.livesRow}>
            {Array.from({ length: Math.min(lives, 5) }).map((_, index) => (
              <Ionicons
                key={index}
                name="heart"
                size={14}
                color="#FF99C8"
                style={styles.heartIcon}
              />
            ))}
          </View>
          <Text style={styles.livesCount}>{lives} left</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.progressTitleRow}>
            <Ionicons name="color-wand-outline" size={18} color={COLORS.primary} />
            <Text style={styles.progressTitle}>Stage target</Text>
          </View>
          {highScore > 0 && (
            <View style={styles.bestBadge}>
              <Ionicons name="ribbon-outline" size={14} color="#fff" />
              <Text style={styles.bestText}>{formatNumber(highScore)}</Text>
            </View>
          )}
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>
    </View>
  );
};
