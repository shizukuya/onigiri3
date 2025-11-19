/**
 * StageResultModalコンポーネント - ステージクリア/失敗用モーダル
 */

import React from 'react';
import { View, Text, Modal as RNModal } from 'react-native';
import { Button } from '../Button';
import { styles } from './StageResultModal.styles';

type ResultStatus = 'clear' | 'fail';

interface StageResultModalProps {
  visible: boolean;
  status: ResultStatus;
  score: number;
  targetScore: number;
  lives: number;
  levelName: string;
  onNext: () => void;
  onRetry: () => void;
}

export const StageResultModal: React.FC<StageResultModalProps> = ({
  visible,
  status,
  score,
  targetScore,
  lives,
  levelName,
  onNext,
  onRetry,
}) => {
  const isClear = status === 'clear';
  const title = isClear ? 'STAGE CLEAR!' : 'TRY AGAIN';
  const description = isClear
    ? '次のステージへ進もう！'
    : '手数が尽きました。もう一度挑戦しましょう。';

  return (
    <RNModal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.levelName}>{levelName}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.scoreBlock}>
            <Text style={styles.label}>SCORE</Text>
            <Text style={styles.value}>{score.toLocaleString()}</Text>
          </View>

          <View style={styles.scoreBlock}>
            <Text style={styles.label}>TARGET</Text>
            <Text style={styles.value}>{targetScore.toLocaleString()}</Text>
          </View>

          <Text style={styles.lives}>LIVES LEFT: {lives}</Text>

          <View style={styles.buttonRow}>
            {isClear ? (
              <>
                <Button title="NEXT STAGE" onPress={onNext} variant="primary" />
                <Button
                  title="REPLAY"
                  onPress={onRetry}
                  variant="secondary"
                  style={styles.secondaryButton}
                />
              </>
            ) : (
              <Button
                title={lives > 0 ? 'RETRY' : 'NO LIVES LEFT'}
                onPress={onRetry}
                variant="secondary"
                disabled={lives <= 0}
                style={styles.fullWidthButton}
              />
            )}
          </View>
        </View>
      </View>
    </RNModal>
  );
};
