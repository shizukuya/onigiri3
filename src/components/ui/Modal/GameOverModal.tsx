/**
 * GameOverModalコンポーネント - ゲームオーバーモーダル
 */

import React from 'react';
import { View, Text, Modal as RNModal } from 'react-native';
import { Button } from '../Button';
import { styles } from './GameOverModal.styles';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  highScore: number;
  onRestart: () => void;
  onClose?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  highScore,
  onRestart,
  onClose,
}) => {
  const isNewHighScore = score >= highScore && highScore > 0;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>GAME OVER</Text>

          {isNewHighScore && (
            <Text style={styles.newHighScore}>🎉 NEW HIGH SCORE! 🎉</Text>
          )}

          <View style={styles.scoreSection}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          </View>

          {highScore > 0 && (
            <View style={styles.highScoreSection}>
              <Text style={styles.highScoreLabel}>Best Score</Text>
              <Text style={styles.highScoreValue}>
                {highScore.toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button title="PLAY AGAIN" onPress={onRestart} variant="primary" />
          </View>
        </View>
      </View>
    </RNModal>
  );
};
