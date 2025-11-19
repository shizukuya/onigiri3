/**
 * ゲームロジック用カスタムフック
 */

import { useState, useCallback, useEffect } from 'react';
import { Grid, Position, GameState, SwapResult } from '../types/game';
import { GAME_CONFIG, ANIMATION_DURATION } from '../constants/game';
import {
  generateInitialGrid,
  swapPieces,
  removeMatches,
  applyGravity,
} from '../utils/gridUtils';
import { findMatches, areAdjacent } from '../utils/matchUtils';
import { useHaptics } from './useHaptics';

const { BASE_SCORE_PER_PIECE, INITIAL_MOVES } = GAME_CONFIG;

export const useGameLogic = () => {
  const haptics = useHaptics();

  const [grid, setGrid] = useState<Grid>(generateInitialGrid);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(INITIAL_MOVES);
  const [combo, setCombo] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // ゲームオーバーチェック
  useEffect(() => {
    if (moves <= 0 && !isProcessing) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [moves, isProcessing, score, highScore]);

  /**
   * マッチ処理と連鎖を処理
   */
  const processMatches = useCallback(
    async (
      currentGrid: Grid,
      currentCombo: number = 0
    ): Promise<{ grid: Grid; combo: number; matches: number }> => {
      const matches = findMatches(currentGrid);

      if (matches.length === 0) {
        return { grid: currentGrid, combo: 0, matches: 0 };
      }

      // ハプティックフィードバック
      if (currentCombo > 0) {
        haptics.heavy();
      } else if (matches.length >= 5) {
        haptics.medium();
      } else {
        haptics.light();
      }

      // スコア加算（連鎖ボーナスあり）
      const comboMultiplier = currentCombo + 1;
      const points = matches.length * BASE_SCORE_PER_PIECE * comboMultiplier;
      setScore((prev) => prev + points);
      setCombo(comboMultiplier);

      // マッチしたピースを削除
      let newGrid = removeMatches(currentGrid, matches);

      // アニメーション待機
      await new Promise((resolve) =>
        setTimeout(resolve, ANIMATION_DURATION.MATCH)
      );

      // 重力を適用
      newGrid = applyGravity(newGrid);

      // アニメーション待機
      await new Promise((resolve) =>
        setTimeout(resolve, ANIMATION_DURATION.FALL)
      );

      // 再帰的に新しいマッチをチェック（連鎖）
      return processMatches(newGrid, comboMultiplier);
    },
    [haptics]
  );

  /**
   * ピースを入れ替えてマッチをチェック
   */
  const handleSwap = useCallback(
    async (pos1: Position, pos2: Position): Promise<SwapResult> => {
      if (isProcessing || gameOver) {
        return { success: false, matchCount: 0, comboCount: 0 };
      }

      if (!areAdjacent(pos1, pos2)) {
        haptics.warning();
        return { success: false, matchCount: 0, comboCount: 0 };
      }

      setIsProcessing(true);
      haptics.selection();

      // 入れ替え
      let swappedGrid = swapPieces(grid, pos1, pos2);

      // マッチがあるかチェック
      const matches = findMatches(swappedGrid);

      if (matches.length === 0) {
        // マッチがない場合は元に戻す
        haptics.warning();
        setIsProcessing(false);
        return { success: false, matchCount: 0, comboCount: 0 };
      }

      // マッチがある場合
      setGrid(swappedGrid);
      setMoves((prev) => prev - 1);

      // 即座にマッチ処理と連鎖を実行
      const result = await processMatches(swappedGrid, 0);
      setGrid(result.grid);

      // コンボをリセット
      setTimeout(() => {
        setCombo(0);
      }, ANIMATION_DURATION.COMBO_DISPLAY);

      setIsProcessing(false);
      haptics.success();

      return {
        success: true,
        matchCount: matches.length,
        comboCount: result.combo,
      };
    },
    [grid, isProcessing, gameOver, haptics, processMatches]
  );

  /**
   * ゲームをリセット
   */
  const resetGame = useCallback(() => {
    setGrid(generateInitialGrid());
    setScore(0);
    setMoves(INITIAL_MOVES);
    setCombo(0);
    setIsProcessing(false);
    setGameOver(false);
    haptics.light();
  }, [haptics]);

  /**
   * 新しいゲームを開始
   */
  const startNewGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return {
    grid,
    score,
    moves,
    combo,
    isProcessing,
    gameOver,
    highScore,
    handleSwap,
    resetGame,
    startNewGame,
  };
};
