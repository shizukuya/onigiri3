/**
 * GameOverModalコンポーネント - ゲームオーバーモーダル
 */

import React from 'react';
import { View, Text, Modal as RNModal } from 'react-native';
import { Button } from '../Button';
import { styles } from './GameOverModal.styles';

import { useRewardedAd } from 'react-native-google-mobile-ads';
import { AdMobConfig } from '../../../constants/AdMobConfig';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  highScore: number;
  onRestart: () => void;
  onClose?: () => void;
  onRevive?: () => void; // New prop for revival
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  highScore,
  onRestart,
  onClose,
  onRevive,
}) => {
  const isNewHighScore = score >= highScore && highScore > 0;

  const { isLoaded, isEarnedReward, load, show } = useRewardedAd(
    AdMobConfig.rewardedAdUnitId,
    {
      requestNonPersonalizedAdsOnly: true,
    }
  );

  // Load ad when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      load();
    }
  }, [visible, load]);

  // Handle reward
  React.useEffect(() => {
    if (isEarnedReward && onRevive) {
      onRevive();
    }
  }, [isEarnedReward, onRevive]);

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
            {/* Watch Ad Button */}
            {isLoaded && onRevive && (
              <Button
                title="Watch Ad to Revive"
                onPress={() => show()}
                variant="secondary"
                style={{ marginBottom: 10 }}
              />
            )}
            <Button title="PLAY AGAIN" onPress={onRestart} variant="primary" />
          </View>
        </View>
      </View>
    </RNModal>
  );
};
