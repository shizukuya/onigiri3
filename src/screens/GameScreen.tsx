/**
 * GameScreenコンポーネント - メインゲーム画面
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
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
import { SpecialEffectOverlay } from '../components/game/SpecialEffect/SpecialEffectOverlay';
import { GameOverModal, StageResultModal } from '../components/ui/Modal';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSound } from '../hooks/useSound';
import { Position } from '../types/game';
import { COLORS } from '../constants/colors';
import { saveGameData } from '../utils/storage';

const { width } = Dimensions.get('window');

interface GameScreenProps {
  onBack?: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onBack }) => {
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
    levelIndex,
    lives,
    highScore,
    recentMatches,
    hintPositions,
    handleSwap,
    retryLevel,
    startNextLevel,
    resetRun,
    reshuffleCount,
    activeEffects,
    removeSpecialEffect,
    isLoading,
  } = useGameLogic();

  const { playBgm, stopBgm } = useSound();

  // Save progress on stage clear
  useEffect(() => {
    if (stageCleared) {
      saveGameData({ currentLevel: levelIndex + 1 });
    }
  }, [stageCleared, levelIndex]);

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



  // BGM Control
  useEffect(() => {
    playBgm(currentLevel.bgm);
    return () => {
      stopBgm();
    };
  }, [currentLevel.bgm]); // Re-run if BGM changes

  // Background Image Mapping
  const getBackgroundImage = (bgName?: string) => {
    switch (bgName) {
      case 'bg_stage2.png': return require('../../assets/images/bg_stage2.png');
      case 'bg_stage3.png': return require('../../assets/images/bg_stage3.png');
      default: return require('../../assets/images/bg_stage1.png');
    }
  };

  return (
    <ImageBackground
      source={getBackgroundImage(currentLevel.background)}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Full screen semi-transparent overlay */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>TOP</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Header title={`Stage ${currentLevel.id}: ${currentLevel.name}`} />
            </View>
          </View>

          <ScoreBoard
            score={score}
            moves={moves}
            highScore={highScore}
            targetScore={currentLevel.targetScore}
            lives={lives}
          />

          <Animated.View style={[styles.gameContainer, shakeStyle]}>
            <ComboDisplay combo={combo} />
            <View style={{ width: width - 8, height: width - 8 }}>
              <Grid
                grid={grid}
                onSwipe={handleSwipeGesture}
                selectedPosition={selectedPosition}
                isProcessing={isProcessing}
                matchPositions={recentMatches}
                hintPositions={hintPositions}
              />
              {/* Special Effects Overlay */}
              {activeEffects.map((effect) => (
                <SpecialEffectOverlay
                  key={effect.id}
                  type={effect.type}
                  position={effect.position}
                  onComplete={() => removeSpecialEffect(effect.id)}
                />
              ))}
            </View>

            {floatingScores.map((s) => (
              <FloatingScore
                key={s.id}
                score={s.score}
                position={s.position}
                combo={s.combo}
                onComplete={() => handleScoreComplete(s.id)}
              />
            ))}

            {/* Reset Text Overlay */}
            {isProcessing && reshuffleCount > 0 && (
              <View style={styles.resetOverlay}>
                <Text style={styles.resetText}>RESET</Text>
              </View>
            )}
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

      {/* Loading Overlay - Outside SafeAreaView */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Image source={require('../../assets/images/loading.png')} style={styles.loadingImage} resizeMode="contain" />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingVertical: 20, // Remove padding here as it's handled by SafeAreaView
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
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
  resetOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    width: 200,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    zIndex: 100,
  },
  resetText: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingImage: {
    width: 200,
    height: 200,
  },
});
