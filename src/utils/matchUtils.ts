/**
 * マッチ検出に関するユーティリティ関数
 */

import { Grid, Position, PieceType, Match, SpecialType, Piece } from '../types/game';
import { GAME_CONFIG } from '../constants/game';

const { GRID_SIZE, MIN_MATCH_COUNT } = GAME_CONFIG;

interface Segment {
  type: PieceType;
  positions: Position[];
  direction: 'horizontal' | 'vertical';
}

/**
 * グリッド全体のマッチを検出
 */
export const findMatches = (grid: Grid, swapPos?: Position): Match[] => {
  const segments: Segment[] = [];

  // Horizontal matches
  for (let row = 0; row < GRID_SIZE; row++) {
    let matchStart = 0;
    let matchLength = 1;
    let currentType: PieceType | undefined = (grid[row][0] && !grid[row][0]!.isBlock) ? grid[row][0]!.type : undefined;

    for (let col = 1; col < GRID_SIZE; col++) {
      const piece: Piece | undefined = grid[row][col];
      // Ignore blocks and empty spaces
      if (piece && !piece.isBlock && piece.type === currentType) {
        matchLength++;
      } else {
        if (matchLength >= MIN_MATCH_COUNT && currentType) {
          segments.push({
            type: currentType,
            positions: Array.from({ length: matchLength }, (_, i) => ({
              row,
              col: matchStart + i,
            })),
            direction: 'horizontal',
          });
        }
        matchStart = col;
        matchLength = 1;
        currentType = piece && !piece.isBlock ? piece.type : undefined;
      }
    }
    if (matchLength >= MIN_MATCH_COUNT && currentType) {
      segments.push({
        type: currentType,
        positions: Array.from({ length: matchLength }, (_, i) => ({
          row,
          col: matchStart + i,
        })),
        direction: 'horizontal',
      });
    }
  }

  // Vertical matches
  for (let col = 0; col < GRID_SIZE; col++) {
    let matchStart = 0;
    let matchLength = 1;
    let currentType: PieceType | undefined = (grid[0][col] && !grid[0][col]!.isBlock) ? grid[0][col]!.type : undefined;

    for (let row = 1; row < GRID_SIZE; row++) {
      const piece: Piece | undefined = grid[row][col];
      // Ignore blocks and empty spaces
      if (piece && !piece.isBlock && piece.type === currentType) {
        matchLength++;
      } else {
        if (matchLength >= MIN_MATCH_COUNT && currentType) {
          segments.push({
            type: currentType,
            positions: Array.from({ length: matchLength }, (_, i) => ({
              row: matchStart + i,
              col,
            })),
            direction: 'vertical',
          });
        }
        matchStart = row;
        matchLength = 1;
        currentType = piece && !piece.isBlock ? piece.type : undefined;
      }
    }
    if (matchLength >= MIN_MATCH_COUNT && currentType) {
      segments.push({
        type: currentType,
        positions: Array.from({ length: matchLength }, (_, i) => ({
          row: matchStart + i,
          col,
        })),
        direction: 'vertical',
      });
    }
  }

  // Group intersecting segments
  const matches: Match[] = [];
  const processedSegments = new Set<number>();

  for (let i = 0; i < segments.length; i++) {
    if (processedSegments.has(i)) continue;

    const currentMatchSegments = [segments[i]];
    processedSegments.add(i);

    // Find all intersecting segments
    let added = true;
    while (added) {
      added = false;
      for (let j = 0; j < segments.length; j++) {
        if (processedSegments.has(j)) continue;
        if (segments[j].type !== segments[i].type) continue; // Only group segments of the same type

        const isIntersecting = currentMatchSegments.some(seg1 =>
          segments[j].positions.some(p2 =>
            seg1.positions.some(p1 => p1.row === p2.row && p1.col === p2.col)
          )
        );

        if (isIntersecting) {
          currentMatchSegments.push(segments[j]);
          processedSegments.add(j);
          added = true;
        }
      }
    }

    // Determine match type and properties
    const allPositions = currentMatchSegments.flatMap(s => s.positions);
    const uniquePositions = Array.from(
      new Set(allPositions.map(p => `${p.row},${p.col}`))
    ).map(s => {
      const [row, col] = s.split(',').map(Number);
      return { row, col };
    });

    const type = currentMatchSegments[0].type;
    // No special generation from matches anymore
    const specialType: SpecialType = 'none';
    const triggerPosition: Position = uniquePositions[0];

    matches.push({
      type,
      positions: uniquePositions,
      count: uniquePositions.length,
      specialType,
      triggerPosition,
    });
  }

  return matches;
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
