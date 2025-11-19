/**
 * グリッド操作に関するユーティリティ関数
 */

import { Grid, Piece, Position, PieceType, PIECE_TYPES, Match } from '../types/game';
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
export const generateInitialGrid = (layout?: number[][]): Grid => {
  const grid: Grid = [];
  for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
    const currentRow: Piece[] = [];
    for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
      // Check layout for blocks
      if (layout && layout[row] && layout[row][col] === 1) {
        currentRow.push({
          type: 1, // Dummy type for block
          id: generatePieceId(),
          special: 'none',
          isBlock: true,
        });
      } else {
        let type: PieceType;
        do {
          type = getRandomPieceType();
        } while (
          (col >= 2 &&
            currentRow[col - 1].type === type &&
            currentRow[col - 2].type === type) ||
          (row >= 2 &&
            grid[row - 1][col].type === type &&
            grid[row - 2][col].type === type)
        );
        currentRow.push({
          type,
          id: generatePieceId(),
          special: 'none',
          isBlock: false,
        });
      }
    }
    grid.push(currentRow);
  }
  return grid;
};

export const swapPieces = (
  grid: Grid,
  pos1: Position,
  pos2: Position
): Grid => {
  const newGrid = cloneGrid(grid);
  const piece1 = newGrid[pos1.row][pos1.col];
  const piece2 = newGrid[pos2.row][pos2.col];

  // Cannot swap blocks
  if (piece1.isBlock || piece2.isBlock) return grid;

  newGrid[pos1.row][pos1.col] = piece2;
  newGrid[pos2.row][pos2.col] = piece1;

  return newGrid;
};

export const removeMatches = (grid: Grid, matches: Match[]): Grid => {
  const newGrid = grid.map(row => row.map(piece => ({ ...piece })));
  const toRemove = new Set<string>();
  const queue: Position[] = [];

  // Helper to add position to removal queue
  const addToRemove = (r: number, c: number) => {
    const key = `${r},${c}`;
    if (!toRemove.has(key)) {
      toRemove.add(key);
      queue.push({ row: r, col: c });
    }
  };

  // Initial matches
  matches.forEach(m => {
    m.positions.forEach(p => addToRemove(p.row, p.col));
  });

  // Process queue for special effects and block destruction
  let head = 0;
  while (head < queue.length) {
    const { row, col } = queue[head++];
    const piece = grid[row][col];

    // Check adjacent for blocks to destroy
    const adjacentOffsets = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    adjacentOffsets.forEach(([dr, dc]) => {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < GAME_CONFIG.GRID_SIZE && nc >= 0 && nc < GAME_CONFIG.GRID_SIZE) {
        const adjacentPiece = newGrid[nr][nc];
        if (adjacentPiece.isBlock && !toRemove.has(`${nr},${nc}`)) {
          // Destroy block
          addToRemove(nr, nc);
        }
      }
    });

    if (!piece) continue;

    // Special piece effects (Bomb, Cross)
    if (piece.special === 'bomb') {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < GAME_CONFIG.GRID_SIZE && c >= 0 && c < GAME_CONFIG.GRID_SIZE) {
            addToRemove(r, c);
          }
        }
      }
    } else if (piece.special === 'cross') {
      for (let i = 0; i < GAME_CONFIG.GRID_SIZE; i++) {
        addToRemove(row, i); // Row
        addToRemove(i, col); // Column
      }
    }
  }

  // Delete matched pieces
  toRemove.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    (newGrid[r][c] as any) = null;
  });

  // Spawn special pieces
  matches.forEach(m => {
    if (m.specialType !== 'none' && m.triggerPosition) {
      const { row, col } = m.triggerPosition;
      // Don't spawn on top of a block (shouldn't happen if logic is correct)
      if (!newGrid[row][col]) {
        newGrid[row][col] = {
          type: m.type,
          id: generatePieceId(),
          special: m.specialType,
          isBlock: false,
        };
      }
    }
  });

  return newGrid;
};

export const applyGravity = (grid: Grid): Grid => {
  const newGrid = grid.map(row => row.map(piece => (piece ? { ...piece } : null)));

  for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
    let emptyRow = GAME_CONFIG.GRID_SIZE - 1;
    for (let row = GAME_CONFIG.GRID_SIZE - 1; row >= 0; row--) {
      const piece = newGrid[row][col];
      if (piece) {
        if (piece.isBlock) {
          // Blocks don't fall, and they reset the emptyRow pointer
          emptyRow = row - 1;
        } else {
          if (row !== emptyRow) {
            newGrid[emptyRow][col] = piece;
            newGrid[row][col] = null;
          }
          emptyRow--;
        }
      }
    }

    // Fill remaining empty spaces
    for (let row = emptyRow; row >= 0; row--) {
      // Don't overwrite blocks (though loop logic should prevent this)
      if (!newGrid[row][col]) {
        newGrid[row][col] = {
          type: getRandomPieceType(),
          id: generatePieceId(),
          special: 'none',
          isBlock: false,
        };
      }
    }
  }

  return newGrid as Grid;
};

/**
 * グリッドのディープコピー
 */
export const cloneGrid = (grid: Grid): Grid => {
  return grid.map(row => row.map(piece => ({ ...piece })));
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
