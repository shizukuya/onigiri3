/**
 * ゲームロジック用カスタムフック
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Grid, Position, SwapResult, Level, Match } from '../types/game';
import { GAME_CONFIG, ANIMATION_DURATION } from '../constants/game';
import {
  generateInitialGrid,
  swapPieces,
  removeMatches,
  applyGravity,
} from '../utils/gridUtils';
import { findMatches, areAdjacent } from '../utils/matchUtils';
import { useHaptics } from './useHaptics';
import { LEVELS } from '../constants/levels';
import { useSound } from './useSound';

const { BASE_SCORE_PER_PIECE, GRID_SIZE } = GAME_CONFIG;

export const useGameLogic = () => {
  const haptics = useHaptics();
  const { playEffect, playBgm, stopBgm } = useSound();
  const [levelIndex, setLevelIndex] = useState(0);

  const currentLevel: Level = useMemo(
    () => LEVELS[Math.min(levelIndex, LEVELS.length - 1)],
    [levelIndex]
  );

  const [grid, setGrid] = useState<Grid>(generateInitialGrid);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(currentLevel.moveLimit);
  const [combo, setCombo] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stageCleared, setStageCleared] = useState(false);
  const [stageFailed, setStageFailed] = useState(false);
  const [gameOver, setGameOver] = useState(false); // ライフが尽きた状態
  const [lives, setLives] = useState<number>(GAME_CONFIG.INITIAL_LIVES);
  const [highScore, setHighScore] = useState(0);
  const [recentMatches, setRecentMatches] = useState<Position[]>([]);
  const [hintPositions, setHintPositions] = useState<Position[]>([]);
  const [reshuffleCount, setReshuffleCount] = useState(0);

  const findHint = useCallback(
    (board: Grid): Position[] => {
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          const pos: Position = { row, col };
          const right: Position = { row, col: col + 1 };
          const down: Position = { row: row + 1, col };

          // 右にスワップ
          if (col + 1 < board[row].length) {
            const swapped = swapPieces(board, pos, right);
            if (findMatches(swapped).length > 0) {
              return [pos, right];
            }
          }

          // 下にスワップ
          if (row + 1 < board.length) {
            const swapped = swapPieces(board, pos, down);
            if (findMatches(swapped).length > 0) {
              return [pos, down];
            }
          }
        }
      }
      return [];
    },
    []
  );

  const ensurePlayableGrid = useCallback(
    (baseGrid: Grid, playReshuffleSound: boolean = true) => {
      let candidate = baseGrid;
      let attempts = 0;
      let hint: Position[] = [];

      while (attempts < 5) {
        hint = findHint(candidate);
        if (hint.length > 0) break;
        candidate = generateInitialGrid();
        attempts++;
      }

      if (hint.length > 0) {
        if (attempts > 0 && playReshuffleSound) {
          playEffect('reset');
          setIsProcessing(true);
          setTimeout(() => {
            setGrid(candidate);
            setReshuffleCount(0);
            setIsProcessing(false);
          }, 2000);
        } else {
          setGrid(candidate);
          setReshuffleCount(0);
        }
      } else {
        setReshuffleCount((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            setGameOver(true);
          } else {
            const reshuffled = generateInitialGrid();
            if (playReshuffleSound) {
              playEffect('reset');
              setIsProcessing(true);
              setTimeout(() => {
                setGrid(reshuffled);
                setIsProcessing(false);
              }, 2000);
            } else {
              setGrid(reshuffled);
            }
          }
          return next;
        });
      }
    },
    [findHint, playEffect]
  );

  // Auto-hint timer
  useEffect(() => {
    if (isProcessing || gameOver || stageCleared || stageFailed) {
      setHintPositions([]);
      return;
    }

    const timer = setTimeout(() => {
      const hints = findHint(grid);
      setHintPositions(hints);
    }, 5000);

    return () => clearTimeout(timer);
  }, [grid, isProcessing, gameOver, stageCleared, stageFailed, findHint]);

  // ステージ/ライフの初期化
  useEffect(() => {
    const initial = generateInitialGrid();
    setGrid(initial);
    setMoves(currentLevel.moveLimit);
    setScore(0);
    setCombo(0);
    setIsProcessing(false);
    setStageCleared(false);
    setStageFailed(false);
    setReshuffleCount(0);
    ensurePlayableGrid(initial, false); // Don't play sound on init
    playBgm();
    return () => {
      stopBgm();
    };
  }, [currentLevel, playBgm, stopBgm, ensurePlayableGrid]);

  // 目標スコア達成チェック
  useEffect(() => {
    if (stageCleared || stageFailed || gameOver) return;
    // アニメーション処理中はクリア判定しない
    if (!isProcessing && score >= currentLevel.targetScore) {
      setStageCleared(true);
      if (score > highScore) setHighScore(score);
      playEffect('stageClear');
    }
  }, [score, isProcessing, currentLevel, stageCleared, stageFailed, highScore, gameOver, playEffect]);

  // 手数切れチェック
  useEffect(() => {
    if (stageCleared || stageFailed || gameOver) return;
    if (moves <= 0 && !isProcessing) {
      if (score >= currentLevel.targetScore) {
        setStageCleared(true);
        if (score > highScore) setHighScore(score);
      } else {
        setStageFailed(true);
        setLives((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next <= 0) {
            setGameOver(true);
          }
          return next;
        });
        playEffect('stageFail');
        if (score > highScore) setHighScore(score);
      }
    }
  }, [moves, isProcessing, currentLevel, stageCleared, stageFailed, score, highScore, gameOver, playEffect]);

  // 完全ゲームオーバー時のサウンド
  useEffect(() => {
    if (gameOver) {
      playEffect('gameOver');
    }
  }, [gameOver, playEffect]);

  /**
   * マッチ処理と連鎖を処理
   */
  const processMatches = useCallback(
    async (
      currentGrid: Grid,
      currentCombo: number = 0,
      manualMatches?: Match[] // レインボーなどで手動生成されたマッチ
    ): Promise<{ grid: Grid; combo: number; matches: number }> => {

      const matches = manualMatches || findMatches(currentGrid);

      if (matches.length === 0) {
        setRecentMatches([]);
        return { grid: currentGrid, combo: 0, matches: 0 };
      }

      // 表示用に全削除位置を収集
      const allMatchPositions: Position[] = [];
      matches.forEach(m => allMatchPositions.push(...m.positions));
      setRecentMatches(allMatchPositions);

      // ハプティックフィードバック
      if (currentCombo > 0) {
        haptics.heavy();
        playEffect('combo');
      } else if (allMatchPositions.length >= 5) {
        haptics.medium();
        playEffect('matchBig');
      } else {
        haptics.light();
        playEffect('matchSmall');
      }

      // スコア加算（連鎖ボーナスあり）
      const comboMultiplier = currentCombo + 1;
      const points = allMatchPositions.length * BASE_SCORE_PER_PIECE * comboMultiplier;
      setScore((prev) => prev + points);
      setCombo(comboMultiplier);

      // マッチしたピースを削除
      const afterRemoval = removeMatches(currentGrid, matches);

      // 消滅エフェクト時間分待機
      await new Promise((resolve) =>
        setTimeout(resolve, ANIMATION_DURATION.MATCH)
      );

      // 重力を適用
      const afterGravity = applyGravity(afterRemoval);
      playEffect('down');

      // 落下時間分待機
      await new Promise((resolve) =>
        setTimeout(resolve, ANIMATION_DURATION.FALL)
      );

      return processMatches(afterGravity, comboMultiplier);
    },
    [haptics, playEffect]
  );

  /**
   * ピースを入れ替えてマッチをチェック
   */
  const handleSwap = useCallback(
    async (pos1: Position, pos2: Position): Promise<SwapResult> => {
      if (isProcessing || gameOver || stageCleared || stageFailed) {
        return { success: false, matchCount: 0, comboCount: 0 };
      }

      if (!areAdjacent(pos1, pos2)) {
        haptics.warning();
        playEffect('swapFail');
        return { success: false, matchCount: 0, comboCount: 0 };
      }

      setIsProcessing(true);
      haptics.selection();

      // レインボーピースの判定
      const piece1 = grid[pos1.row][pos1.col];
      const piece2 = grid[pos2.row][pos2.col];
      const isRainbow1 = piece1.special === 'rainbow';
      const isRainbow2 = piece2.special === 'rainbow';

      if (isRainbow1 || isRainbow2) {
        setMoves((prev) => prev - 1);
        let targetPositions: Position[] = [];
        let rainbowPos = isRainbow1 ? pos1 : pos2;

        if (isRainbow1 && isRainbow2) {
          // ダブルレインボー: 全消し
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              targetPositions.push({ row: r, col: c });
            }
          }
        } else {
          // シングルレインボー: 色消し
          const targetType = isRainbow1 ? piece2.type : piece1.type;
          // レインボー自体も含める
          targetPositions.push(rainbowPos);
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              if (grid[r][c].type === targetType) {
                targetPositions.push({ row: r, col: c });
              }
            }
          }
        }

        const rainbowMatch: Match = {
          type: isRainbow1 ? piece2.type : piece1.type, // ダミータイプ
          positions: targetPositions,
          count: targetPositions.length,
          specialType: 'none', // レインボー発動自体は新しいスペシャルピースを作らない
          triggerPosition: rainbowPos
        };

        // レインボー処理実行
        const result = await processMatches(grid, 0, [rainbowMatch]);
        ensurePlayableGrid(result.grid);

        setTimeout(() => {
          setCombo(0);
          setRecentMatches([]);
        }, ANIMATION_DURATION.COMBO_DISPLAY);

        setIsProcessing(false);
        haptics.success();
        return { success: true, matchCount: targetPositions.length, comboCount: result.combo };
      }

      // 通常の入れ替え処理
      let swappedGrid = swapPieces(grid, pos1, pos2);

      // マッチがあるかチェック (pos2をトリガー位置とする)
      const matches = findMatches(swappedGrid, pos2);

      if (matches.length === 0) {
        // マッチがない場合は元に戻す
        haptics.warning();
        playEffect('swapFail');
        setIsProcessing(false);
        return { success: false, matchCount: 0, comboCount: 0 };
      }

      // マッチがある場合
      setGrid(swappedGrid);
      setMoves((prev) => prev - 1);

      // 即座にマッチ処理と連鎖を実行
      const result = await processMatches(swappedGrid, 0);
      ensurePlayableGrid(result.grid);

      // コンボをリセット
      setTimeout(() => {
        setCombo(0);
        setRecentMatches([]);
      }, ANIMATION_DURATION.COMBO_DISPLAY);

      setIsProcessing(false);
      haptics.success();

      return {
        success: true,
        matchCount: matches.length,
        comboCount: result.combo,
      };
    },
    [grid, isProcessing, gameOver, stageCleared, stageFailed, haptics, processMatches, playEffect, ensurePlayableGrid]
  );

  /**
   * 現在のステージをリトライ
   */
  const retryLevel = useCallback(() => {
    if (gameOver) return;
    const nextGrid = generateInitialGrid(currentLevel.layout);
    ensurePlayableGrid(nextGrid, false);
    setScore(0);
    setMoves(currentLevel.moveLimit);
    setCombo(0);
    setIsProcessing(false);
    setStageCleared(false);
    setStageFailed(false);
    haptics.light();
  }, [currentLevel, gameOver, haptics, ensurePlayableGrid]);

  /**
   * 次のステージへ
   */
  const startNextLevel = useCallback(() => {
    const nextIndex =
      levelIndex + 1 < LEVELS.length ? levelIndex + 1 : levelIndex;
    setLevelIndex(nextIndex);
    // Note: The useEffect will trigger on levelIndex change and handle grid generation
  }, [levelIndex]);

  /**
   * ライフを全回復して最初から
   */
  const resetRun = useCallback(() => {
    setLives(GAME_CONFIG.INITIAL_LIVES);
    setLevelIndex(0);
    // Note: The useEffect will trigger on levelIndex change
    setScore(0);
    setMoves(LEVELS[0].moveLimit);
    setCombo(0);
    setIsProcessing(false);
    setStageCleared(false);
    setStageFailed(false);
    setStageFailed(false);
    setGameOver(false);
    playEffect('reset');
  }, [playEffect]);

  return {
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
  };
};
