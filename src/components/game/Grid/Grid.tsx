/**
 * Gridコンポーネント - ゲームグリッド（スワイプジェスチャー対応）
 */

import React, { useState, useRef, useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Piece } from '../Piece';
import { Grid as GridType, Position } from '../../../types/game';
import { GAME_CONFIG } from '../../../constants/game';
import { styles } from './Grid.styles';

const { width } = Dimensions.get('window');
const BOARD_PADDING = 20;
const BOARD_SIZE = width - BOARD_PADDING * 2;
const SWIPE_THRESHOLD = 30; // スワイプ検出の最小距離

interface GridProps {
  grid: GridType;
  onSwipe: (pos1: Position, pos2: Position) => void;
  selectedPosition: Position | null;
  isProcessing: boolean;
  matchPositions?: Position[];
  hintPositions?: Position[];
}

export const Grid: React.FC<GridProps> = ({
  grid,
  onSwipe,
  selectedPosition,
  isProcessing,
  matchPositions = [],
  hintPositions = [],
}) => {
  const pieceSize = BOARD_SIZE / GAME_CONFIG.GRID_SIZE;
  const swipeStartPos = useRef<Position | null>(null);
  const matchSet = useMemo(
    () => new Set(matchPositions.map((p) => `${p.row}-${p.col}`)),
    [matchPositions]
  );
  const hintSet = useMemo(
    () => new Set(hintPositions.map((p) => `${p.row}-${p.col}`)),
    [hintPositions]
  );

  const isSelected = (row: number, col: number): boolean => {
    if (!selectedPosition) return false;
    return selectedPosition.row === row && selectedPosition.col === col;
  };

  // タッチ位置からグリッド座標を計算
  const getGridPosition = (x: number, y: number): Position | null => {
    const col = Math.floor(x / pieceSize);
    const row = Math.floor(y / pieceSize);

    if (row >= 0 && row < GAME_CONFIG.GRID_SIZE && col >= 0 && col < GAME_CONFIG.GRID_SIZE) {
      return { row, col };
    }
    return null;
  };

  // スワイプ開始
  const handleGestureBegin = (event: any) => {
    if (isProcessing) return;
    const pos = getGridPosition(event.nativeEvent.x, event.nativeEvent.y);
    if (pos) {
      swipeStartPos.current = pos;
    }
  };

  // スワイプ終了
  const handleGestureEnd = (event: any) => {
    if (isProcessing || !swipeStartPos.current) {
      swipeStartPos.current = null;
      return;
    }

    const deltaX = event.nativeEvent.translationX;
    const deltaY = event.nativeEvent.translationY;

    // スワイプ方向を判定
    let targetPos: Position | null = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 横方向のスワイプ
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0) {
          // 右方向
          targetPos = { row: swipeStartPos.current.row, col: swipeStartPos.current.col + 1 };
        } else {
          // 左方向
          targetPos = { row: swipeStartPos.current.row, col: swipeStartPos.current.col - 1 };
        }
      }
    } else {
      // 縦方向のスワイプ
      if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
        if (deltaY > 0) {
          // 下方向
          targetPos = { row: swipeStartPos.current.row + 1, col: swipeStartPos.current.col };
        } else {
          // 上方向
          targetPos = { row: swipeStartPos.current.row - 1, col: swipeStartPos.current.col };
        }
      }
    }

    // 有効なターゲット位置の場合、スワップを実行
    if (
      targetPos &&
      targetPos.row >= 0 &&
      targetPos.row < GAME_CONFIG.GRID_SIZE &&
      targetPos.col >= 0 &&
      targetPos.col < GAME_CONFIG.GRID_SIZE
    ) {
      onSwipe(swipeStartPos.current, targetPos);
    }

    swipeStartPos.current = null;
  };

  return (
    <PanGestureHandler
      onBegan={handleGestureBegin}
      onEnded={handleGestureEnd}
      onCancelled={() => { swipeStartPos.current = null; }}
      onFailed={() => { swipeStartPos.current = null; }}
    >
      <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        {grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((piece, colIndex) => (
              <Piece
                key={piece.id}
                type={piece.type}
                size={pieceSize}
                isSelected={isSelected(rowIndex, colIndex)}
                shouldDisappear={matchSet.has(`${rowIndex}-${colIndex}`)}
                isHint={hintSet.has(`${rowIndex}-${colIndex}`)}
              />
            ))}
          </View>
        ))}
      </View>
    </PanGestureHandler>
  );
};
