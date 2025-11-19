/**
 * グリッド操作に関するユーティリティ関数
 */

import { Grid, Piece, Position, PieceType, PIECE_TYPES } from '../types/game';
import { GAME_CONFIG } from '../constants/game';
import { wouldCreateMatch } from './matchUtils';

const { GRID_SIZE } = GAME_CONFIG;

// ピースIDカウンター
let pieceIdCounter = 0;

/**
 * ユニークなIDを生成
 */
export const generatePieceId = (): string => {
  return `piece-${pieceIdCounter++}-${Date.now()}`;
};

/**
 * ランダムなピースタイプを生成
 */
export const getRandomPieceType = (): PieceType => {
  return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
};

/**
 * 初期グリッドを生成（マッチがないことを保証）
 */
export const generateInitialGrid = (): Grid => {
  const grid: Grid = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      let type: PieceType;
      let attempts = 0;
      const maxAttempts = 100;

      do {
        type = getRandomPieceType();
        attempts++;

        if (attempts > maxAttempts) {
          type = getRandomPieceType();
          break;
        }
      } while (wouldCreateMatch(grid, row, col, type));

      grid[row][col] = { type, id: generatePieceId() };
    }
  }

  return grid;
};

/**
 * 2つのピースを入れ替え
 */
export const swapPieces = (
  grid: Grid,
  pos1: Position,
  pos2: Position
): Grid => {
  const newGrid = grid.map(row => [...row]);
  const temp = newGrid[pos1.row][pos1.col];
  newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col];
  newGrid[pos2.row][pos2.col] = temp;
  return newGrid;
};

/**
 * マッチしたピースを削除
 */
export const removeMatches = (grid: Grid, matches: Position[]): Grid => {
  const newGrid = grid.map(row => [...row]);

  matches.forEach(({ row, col }) => {
    (newGrid[row][col] as any) = null;
  });

  return newGrid;
};

/**
 * ピースを落下させて空いた場所を埋める
 */
export const applyGravity = (grid: Grid): Grid => {
  const newGrid: Grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );

  for (let col = 0; col < GRID_SIZE; col++) {
    let writeRow = GRID_SIZE - 1;

    // 下から上に向かってnullでないピースを詰める
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (grid[row][col] !== null && grid[row][col] !== undefined) {
        newGrid[writeRow][col] = grid[row][col];
        writeRow--;
      }
    }

    // 残りの空いた場所に新しいピースを生成
    while (writeRow >= 0) {
      newGrid[writeRow][col] = {
        type: getRandomPieceType(),
        id: generatePieceId(),
      };
      writeRow--;
    }
  }

  return newGrid;
};

/**
 * グリッドのディープコピー
 */
export const cloneGrid = (grid: Grid): Grid => {
  return grid.map(row => [...row]);
};

/**
 * グリッドが有効かチェック
 */
export const isValidGrid = (grid: Grid): boolean => {
  if (!grid || grid.length !== GRID_SIZE) return false;

  for (let row = 0; row < GRID_SIZE; row++) {
    if (!grid[row] || grid[row].length !== GRID_SIZE) return false;
    for (let col = 0; col < GRID_SIZE; col++) {
      const piece = grid[row][col];
      if (!piece || !piece.type || !piece.id) return false;
    }
  }

  return true;
};
