/**
 * GameScreenコンポーネント - メインゲーム画面
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { Header } from '../components/ui/Header';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { Grid } from '../components/game/Grid';
import { ComboDisplay } from '../components/game/ComboDisplay';
import { FloatingScore } from '../components/game/FloatingScore/FloatingScore';
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

  // Floating Scores State
  const [floatingScores, setFloatingScores] = useState<
    { id: string; score: number; position: Position; combo: number }[]
  >([]);
  const prevScore = useRef(score);
  const scoreIdCounter = useRef(0);

  // Screen Shake
  const shakeTranslateX = useSharedValue(0);
  const shakeTranslateY = useSharedValue(0);

  // Score update effect
  useEffect(() => {
    if (score > prevScore.current) {
      const diff = score - prevScore.current;
      const position = recentMatches.length > 0 ? recentMatches[0] : { row: 3, col: 3 };

      const newScore = {
        id: `score-${scoreIdCounter.current++}`,
        score: diff,
        position,
        combo,
      };

      setFloatingScores((prev) => [...prev, newScore]);

      // Screen Shake for big matches or combos
      if (diff >= 100 || combo > 1) {
        const intensity = Math.min(25, combo * 4 + (diff / 30)); // Increased intensity
        shakeTranslateX.value = withSequence(
          withTiming(intensity, { duration: 40 }),
          withRepeat(withTiming(-intensity, { duration: 80 }), 5, true), // More shakes
          withTiming(0, { duration: 40 })
        );
        shakeTranslateY.value = withSequence(
          withTiming(intensity, { duration: 40 }),
          withRepeat(withTiming(-intensity, { duration: 80 }), 5, true), // More shakes
          withTiming(0, { duration: 40 })
        );
      }
    }
    prevScore.current = score;
  }, [score, combo, recentMatches]);

  const handleSwipeGesture = async (pos1: Position, pos2: Position) => {
    if (isProcessing || gameOver) return;

    // スワイプでピースを入れ替え
    setSelectedPosition(pos1); // 視覚的フィードバック用
    await handleSwap(pos1, pos2);
    setSelectedPosition(null);
  };

  const handleScoreComplete = (id: string) => {
    setFloatingScores((prev) => prev.filter((s) => s.id !== id));
  };

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: shakeTranslateX.value },
        { translateY: shakeTranslateY.value },
      ],
    };
  });

  const getBackgroundColor = (levelId: number) => {
    switch (levelId % 3) {
      case 1: return '#f0f8ff'; // AliceBlue (Stage 1)
      case 2: return '#fff0f5'; // LavenderBlush (Stage 2)
      case 0: return '#f5f5dc'; // Beige (Stage 3)
      default: return COLORS.background;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getBackgroundColor(currentLevel.id) }]}>
      <View style={styles.content}>
        <Header title={`Stage ${currentLevel.id}: ${currentLevel.name}`} />

        <ScoreBoard
          score={score}
          moves={moves}
          highScore={highScore}
          targetScore={currentLevel.targetScore}
          lives={lives}
        />

        <Animated.View style={[styles.gameContainer, shakeStyle]}>
          <ComboDisplay combo={combo} />
          <Grid
            grid={grid}
            onSwipe={handleSwipeGesture}
            selectedPosition={selectedPosition}
            isProcessing={isProcessing}
            matchPositions={recentMatches}
            hintPositions={hintPositions}
          />
          {floatingScores.map((s) => (
            <FloatingScore
              key={s.id}
              score={s.score}
              position={s.position}
              combo={s.combo}
              onComplete={() => handleScoreComplete(s.id)}
            />
          ))}
        </Animated.View>
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
