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
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/ui/Header';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { Grid } from '../components/game/Grid';
import { ComboDisplay } from '../components/game/ComboDisplay';
import { FloatingScore } from '../components/game/FloatingScore/FloatingScore';
import { SpecialEffectOverlay } from '../components/game/SpecialEffect/SpecialEffectOverlay';
import { ParticleOverlay } from '../components/game/Particles/ParticleOverlay';
import { GameOverModal, StageResultModal } from '../components/ui/Modal';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSound } from '../hooks/useSound';
import { Position } from '../types/game';
import { COLORS } from '../constants/colors';
import { saveGameData, saveHighScore } from '../utils/storage';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AdMobConfig } from '../constants/AdMobConfig';

const { width } = Dimensions.get('window');
const GRID_BOARD_SIZE = width - 8;

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
    recoverLife,
  } = useGameLogic();

  const { playBgm, stopBgm } = useSound();

  // Save progress on stage clear
  // Save progress on stage clear
  useEffect(() => {
    const saveProgress = async () => {
      if (stageCleared && score >= currentLevel.targetScore) {
        // Await sequentially to avoid race conditions in file storage
        await saveGameData({ currentLevel: levelIndex + 1 });
        await saveHighScore(currentLevel.id, score);
      }
    };
    saveProgress();
  }, [stageCleared, levelIndex, score, currentLevel.id, currentLevel.targetScore]);

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
        const intensity = Math.min(10, combo * 2 + (diff / 50)); // Reduced intensity significantly
        shakeTranslateX.value = withSequence(
          withTiming(intensity, { duration: 50 }),
          withRepeat(withTiming(-intensity, { duration: 100 }), 3, true), // Fewer shakes, slower
          withTiming(0, { duration: 50 })
        );
        shakeTranslateY.value = withSequence(
          withTiming(intensity, { duration: 50 }),
          withRepeat(withTiming(-intensity, { duration: 100 }), 3, true), // Fewer shakes, slower
          withTiming(0, { duration: 50 })
        );
      }
    }
    prevScore.current = score;
  }, [score, combo, recentMatches]);

  // Particles State
  const [particleEffects, setParticleEffects] = useState<{ id: string; positions: Position[] }[]>([]);

  useEffect(() => {
    if (recentMatches.length > 0) {
      const id = Math.random().toString(36).substr(2, 9);
      setParticleEffects(prev => [...prev, { id, positions: recentMatches }]);
    }
  }, [recentMatches]);

  const handleParticleComplete = (id: string) => {
    setParticleEffects((prev) => prev.filter((p) => p.id !== id));
  };

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

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    }
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
    let isActive = true;

    const runBgmTransition = async () => {
      await stopBgm();
      if (!isActive) return;
      await playBgm(currentLevel.bgm);
    };

    runBgmTransition();

    return () => {
      isActive = false;
      stopBgm();
    };
  }, [currentLevel.bgm, playBgm, stopBgm]); // Re-run if BGM changes

  const bgImages: Record<string, any> = {
    'bg_stage1.png': require('../../assets/images/bg_stage1.png'),
    'bg_stage2.png': require('../../assets/images/bg_stage2.png'),
    'bg_stage3.png': require('../../assets/images/bg_stage3.png'),
    'bg_stage4.png': require('../../assets/images/bg_stage4.png'),
    'bg_stage5.png': require('../../assets/images/bg_stage5.png'),
    'bg_stage6.png': require('../../assets/images/bg_stage6.png'),
    'bg_stage7.png': require('../../assets/images/bg_stage7.png'),
    'bg_stage8.png': require('../../assets/images/bg_stage8.png'),
    'bg_stage9.png': require('../../assets/images/bg_stage9.png'),
    'bg_stage10.png': require('../../assets/images/bg_stage10.png'),
    'bg_stage11.png': require('../../assets/images/bg_stage11.png'),
    'bg_stage12.png': require('../../assets/images/bg_stage12.png'),
    'bg_stage13.png': require('../../assets/images/bg_stage13.png'),
    'bg_stage14.png': require('../../assets/images/bg_stage14.png'),
    'bg_stage15.png': require('../../assets/images/bg_stage15.png'),
    'bg_stage16.png': require('../../assets/images/bg_stage16.png'),
    'bg_stage17.png': require('../../assets/images/bg_stage17.png'),
    'bg_stage18.png': require('../../assets/images/bg_stage18.png'),
    'bg_stage19.png': require('../../assets/images/bg_stage19.png'),
    'bg_stage20.png': require('../../assets/images/bg_stage20.png'),
    'bg_stage21.png': require('../../assets/images/bg_stage21.png'),
    'bg_stage22.png': require('../../assets/images/bg_stage22.png'),
    'bg_stage23.png': require('../../assets/images/bg_stage23.png'),
    'bg_stage24.png': require('../../assets/images/bg_stage24.png'),
    'bg_stage25.png': require('../../assets/images/bg_stage25.png'),
    'bg_stage26.png': require('../../assets/images/bg_stage26.png'),
    'bg_stage27.png': require('../../assets/images/bg_stage27.png'),
    'bg_stage28.png': require('../../assets/images/bg_stage28.png'),
    'bg_stage29.png': require('../../assets/images/bg_stage29.png'),
    'bg_stage30.png': require('../../assets/images/bg_stage30.png'),
    'bg_stage31.png': require('../../assets/images/bg_stage31.png'),
    'bg_stage32.png': require('../../assets/images/bg_stage32.png'),
    'bg_stage33.png': require('../../assets/images/bg_stage33.png'),
    'bg_stage34.png': require('../../assets/images/bg_stage34.png'),
    'bg_stage35.png': require('../../assets/images/bg_stage35.png'),
    'bg_stage36.png': require('../../assets/images/bg_stage36.png'),
    'bg_stage37.png': require('../../assets/images/bg_stage37.png'),
    'bg_stage38.png': require('../../assets/images/bg_stage38.png'),
    'bg_stage39.png': require('../../assets/images/bg_stage39.png'),
    'bg_stage40.png': require('../../assets/images/bg_stage40.png'),
    'bg_stage41.png': require('../../assets/images/bg_stage41.png'),
    'bg_stage42.png': require('../../assets/images/bg_stage42.png'),
    'bg_stage43.png': require('../../assets/images/bg_stage43.png'),
    'bg_stage44.png': require('../../assets/images/bg_stage44.png'),
    'bg_stage45.png': require('../../assets/images/bg_stage45.png'),
    'bg_stage46.png': require('../../assets/images/bg_stage46.png'),
    'bg_stage47.png': require('../../assets/images/bg_stage47.png'),
    'bg_stage48.png': require('../../assets/images/bg_stage48.png'),
    'bg_stage49.png': require('../../assets/images/bg_stage49.png'),
    'bg_stage50.png': require('../../assets/images/bg_stage50.png'),
    'bg_stage51.png': require('../../assets/images/bg_stage51.png'),
    'bg_stage52.png': require('../../assets/images/bg_stage52.png'),
    'bg_stage53.png': require('../../assets/images/bg_stage53.png'),
    'bg_stage54.png': require('../../assets/images/bg_stage54.png'),
    'bg_stage55.png': require('../../assets/images/bg_stage55.png'),
    'bg_stage56.png': require('../../assets/images/bg_stage56.png'),
    'bg_stage57.png': require('../../assets/images/bg_stage57.png'),
    'bg_stage58.png': require('../../assets/images/bg_stage58.png'),
    'bg_stage59.png': require('../../assets/images/bg_stage59.png'),
    'bg_stage60.png': require('../../assets/images/bg_stage60.png'),
    'bg_stage61.png': require('../../assets/images/bg_stage61.png'),
    'bg_stage62.png': require('../../assets/images/bg_stage62.png'),
    'bg_stage63.png': require('../../assets/images/bg_stage63.png'),
    'bg_stage64.png': require('../../assets/images/bg_stage64.png'),
    'bg_stage65.png': require('../../assets/images/bg_stage65.png'),
    'bg_stage66.png': require('../../assets/images/bg_stage66.png'),
    'bg_stage67.png': require('../../assets/images/bg_stage67.png'),
    'bg_stage68.png': require('../../assets/images/bg_stage68.png'),
    'bg_stage69.png': require('../../assets/images/bg_stage69.png'),
    'bg_stage70.png': require('../../assets/images/bg_stage70.png'),
    'bg_stage71.png': require('../../assets/images/bg_stage71.png'),
    'bg_stage72.png': require('../../assets/images/bg_stage72.png'),
    'bg_stage73.png': require('../../assets/images/bg_stage73.png'),
    'bg_stage74.png': require('../../assets/images/bg_stage74.png'),
    'bg_stage75.png': require('../../assets/images/bg_stage75.png'),
    'bg_stage76.png': require('../../assets/images/bg_stage76.png'),
    'bg_stage77.png': require('../../assets/images/bg_stage77.png'),
    'bg_stage78.png': require('../../assets/images/bg_stage78.png'),
    'bg_stage79.png': require('../../assets/images/bg_stage79.png'),
    'bg_stage80.png': require('../../assets/images/bg_stage80.png'),
    'bg_stage81.png': require('../../assets/images/bg_stage81.png'),
    'bg_stage82.png': require('../../assets/images/bg_stage82.png'),
    'bg_stage83.png': require('../../assets/images/bg_stage83.png'),
    'bg_stage84.png': require('../../assets/images/bg_stage84.png'),
    'bg_stage85.png': require('../../assets/images/bg_stage85.png'),
    'bg_stage86.png': require('../../assets/images/bg_stage86.png'),
    'bg_stage87.png': require('../../assets/images/bg_stage87.png'),
    'bg_stage88.png': require('../../assets/images/bg_stage88.png'),
    'bg_stage89.png': require('../../assets/images/bg_stage89.png'),
    'bg_stage90.png': require('../../assets/images/bg_stage90.png'),
    'bg_stage91.png': require('../../assets/images/bg_stage91.png'),
    'bg_stage92.png': require('../../assets/images/bg_stage92.png'),
    'bg_stage93.png': require('../../assets/images/bg_stage93.png'),
    'bg_stage94.png': require('../../assets/images/bg_stage94.png'),
    'bg_stage95.png': require('../../assets/images/bg_stage95.png'),
    'bg_stage96.png': require('../../assets/images/bg_stage96.png'),
    'bg_stage97.png': require('../../assets/images/bg_stage97.png'),
    'bg_stage98.png': require('../../assets/images/bg_stage98.png'),
    'bg_stage99.png': require('../../assets/images/bg_stage99.png'),
    'bg_stage100.png': require('../../assets/images/bg_stage100.png'),
  };

  // Background Image Mapping
  const getBackgroundImage = (bgName?: string) => {
    const key = bgName ?? 'bg_stage1.png';
    return bgImages[key] ?? bgImages['bg_stage1.png'];
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
        <View style={styles.topHud}>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.navButton} onPress={handleBackPress} activeOpacity={0.85}>
              <Ionicons name="chevron-back" size={18} color="#1a1a1a" />
              <Text style={styles.navButtonText}>Title</Text>
            </TouchableOpacity>

          </View>
          <Header
            title={currentLevel.name}
            description={currentLevel.description}
            badge={`Stage ${currentLevel.id}`}
          />
          <ScoreBoard
            score={score}
            moves={moves}
            highScore={highScore}
            targetScore={currentLevel.targetScore}
            lives={lives}
          />
        </View>

        <Animated.View style={[styles.gameContainer, shakeStyle]}>
          <ComboDisplay combo={combo} />
          <View style={styles.boardShell}>
            <View style={styles.boardWrapper}>
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

              {floatingScores.map((s) => (
                <FloatingScore
                  key={s.id}
                  score={s.score}
                  position={s.position}
                  combo={s.combo}
                  onComplete={() => handleScoreComplete(s.id)}
                />
              ))}

              {particleEffects.map((effect) => (
                <ParticleOverlay
                  key={effect.id}
                  positions={effect.positions}
                  gridSize={GRID_BOARD_SIZE}
                  onComplete={() => handleParticleComplete(effect.id)}
                />
              ))}
            </View>
          </View>

          {/* Reset Text Overlay */}
          {isProcessing && reshuffleCount > 0 && (
            <View style={styles.resetOverlay}>
              <Text style={styles.resetText}>RESET</Text>
            </View>
          )}
        </Animated.View>

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
          onRevive={recoverLife}
        />

        {/* Banner Ad */}
        <View style={styles.bannerContainer}>
          <BannerAd
            unitId={AdMobConfig.bannerAdUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  topHud: {
    width: '100%',
    gap: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFAACF',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  modeChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingBottom: 30,
  },
  boardShell: {
    padding: 14,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardWrapper: {
    width: GRID_BOARD_SIZE,
    height: GRID_BOARD_SIZE,
    position: 'relative',
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
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: 0,
  },
});
