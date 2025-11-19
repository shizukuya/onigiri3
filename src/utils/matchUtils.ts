/**
 * マッチ検出に関するユーティリティ関数
 */

import { Grid, Position, PieceType } from '../types/game';
import { GAME_CONFIG } from '../constants/game';

const { GRID_SIZE, MIN_MATCH_COUNT } = GAME_CONFIG;

/**
 * グリッド全体のマッチを検出
 */
export const findMatches = (grid: Grid): Position[] => {
  const matches = new Set<string>();

  // 横方向のマッチを検出
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - (MIN_MATCH_COUNT - 1); col++) {
      const type = grid[row]?.[col]?.type;
      if (!type) continue;

      let matchLength = 1;
      for (let i = 1; i < GRID_SIZE - col; i++) {
        if (grid[row]?.[col + i]?.type === type) {
          matchLength++;
        } else {
          break;
        }
      }

      if (matchLength >= MIN_MATCH_COUNT) {
        for (let i = 0; i < matchLength; i++) {
          matches.add(`${row},${col + i}`);
        }
      }
    }
  }

  // 縦方向のマッチを検出
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE - (MIN_MATCH_COUNT - 1); row++) {
      const type = grid[row]?.[col]?.type;
      if (!type) continue;

      let matchLength = 1;
      for (let i = 1; i < GRID_SIZE - row; i++) {
        if (grid[row + i]?.[col]?.type === type) {
          matchLength++;
        } else {
          break;
        }
      }

      if (matchLength >= MIN_MATCH_COUNT) {
        for (let i = 0; i < matchLength; i++) {
          matches.add(`${row + i},${col}`);
        }
      }
    }
  }

  // Set を Position[] に変換
  return Array.from(matches).map((posStr) => {
    const [row, col] = posStr.split(',').map(Number);
    return { row, col };
  });
};

/**
 * 指定位置にピースを配置するとマッチが発生するかチェック
 */
export const wouldCreateMatch = (
  grid: Grid,
  row: number,
  col: number,
  type: PieceType
): boolean => {
  // 横方向のチェック
  let horizontalCount = 1;

  // 左方向
  let c = col - 1;
  while (c >= 0 && grid[row]?.[c]?.type === type) {
    horizontalCount++;
    c--;
  }

  // 右方向
  c = col + 1;
  while (c < GRID_SIZE && grid[row]?.[c]?.type === type) {
    horizontalCount++;
    c++;
  }

  if (horizontalCount >= MIN_MATCH_COUNT) return true;

  // 縦方向のチェック
  let verticalCount = 1;

  // 上方向
  let r = row - 1;
  while (r >= 0 && grid[r]?.[col]?.type === type) {
    verticalCount++;
    r--;
  }

  // 下方向
  r = row + 1;
  while (r < GRID_SIZE && grid[r]?.[col]?.type === type) {
    verticalCount++;
    r++;
  }

  if (verticalCount >= MIN_MATCH_COUNT) return true;

  return false;
};

/**
 * 2つの位置が隣接しているかチェック
 */
export const areAdjacent = (pos1: Position, pos2: Position): boolean => {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};
