/**
 * GameScreenコンポーネント - メインゲーム画面
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/ui/Header';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { Grid } from '../components/game/Grid';
import { ComboDisplay } from '../components/game/ComboDisplay';
import { GameOverModal, StageResultModal } from '../components/ui/Modal';
import { useGameLogic } from '../hooks/useGameLogic';
import { Position } from '../types/game';
import { COLORS } from '../constants/colors';

export const GameScreen: React.FC = () => {
  const {
    grid,
    score,
    moves,
    combo,
    isProcessing,
    gameOver,
    stageCleared,
    stageFailed,
    currentLevel,
    lives,
    highScore,
    recentMatches,
    hintPositions,
    handleSwap,
    retryLevel,
    startNextLevel,
    resetRun,
  } = useGameLogic();

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );

  const handleSwipeGesture = async (pos1: Position, pos2: Position) => {
    if (isProcessing || gameOver) return;

    // スワイプでピースを入れ替え
    setSelectedPosition(pos1); // 視覚的フィードバック用
    await handleSwap(pos1, pos2);
    setSelectedPosition(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header title={`Stage ${currentLevel.id}: ${currentLevel.name}`} />

        <ScoreBoard
          score={score}
          moves={moves}
          highScore={highScore}
          targetScore={currentLevel.targetScore}
          lives={lives}
        />

        <View style={styles.gameContainer}>
          <ComboDisplay combo={combo} />
          <Grid
            grid={grid}
            onSwipe={handleSwipeGesture}
            selectedPosition={selectedPosition}
            isProcessing={isProcessing}
            matchPositions={recentMatches}
            hintPositions={hintPositions}
          />
        </View>

      </View>

      <StageResultModal
        visible={(stageCleared || stageFailed) && !gameOver}
        status={stageCleared ? 'clear' : 'fail'}
        score={score}
        targetScore={currentLevel.targetScore}
        lives={lives}
        levelName={currentLevel.name}
        onNext={startNextLevel}
        onRetry={retryLevel}
      />

      <GameOverModal
        visible={gameOver}
        score={score}
        highScore={highScore}
        onRestart={resetRun}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
