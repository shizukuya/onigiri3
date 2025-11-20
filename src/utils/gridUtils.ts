/**
 * グリッド操作に関するユーティリティ関数
 */

import { Grid, Piece, Position, PieceType, PIECE_TYPES, Match, BLOCK_TYPE } from '../types/game';
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
          type: 99, // BLOCK_TYPE
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

    // Special piece effects
    if (piece.special === 'bomb') {
      // Bomb: Row + Col
      for (let i = 0; i < GAME_CONFIG.GRID_SIZE; i++) {
        addToRemove(row, i);
        addToRemove(i, col);
      }
    } else if (piece.special === 'dokan') {
      // Pipe: Column
      for (let i = 0; i < GAME_CONFIG.GRID_SIZE; i++) {
        addToRemove(i, col);
      }
    } else if (piece.special === 'ring') {
      // Ring: Surrounding 3x3
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < GAME_CONFIG.GRID_SIZE && c >= 0 && c < GAME_CONFIG.GRID_SIZE) {
            addToRemove(r, c);
          }
        }
      }
    } else if (piece.special === 'kesigomu') {
      // Eraser: Row
      for (let i = 0; i < GAME_CONFIG.GRID_SIZE; i++) {
        addToRemove(row, i);
      }
    } else if (piece.special === 'superpink') {
      // Super Pink: Refresh board with 70% char6/char9
      // We need to modify the grid directly here, but removeMatches returns a new grid.
      // However, we are currently just marking pieces for removal.
      // Super Pink is unique: it transforms the board, not just removes pieces.
      // Strategy: Mark EVERYTHING for removal (to clear board), then we need a way to refill specially.
      // Actually, if we mark everything for removal, the normal refill logic will kick in with random pieces.
      // We want specific pieces (char6/char9).

      // Alternative: Don't mark for removal. Instead, MUTATE the newGrid directly to change pieces?
      // But we want the "explosion" effect of the Super Pink itself.
      // Let's mark the Super Pink itself for removal.
      addToRemove(row, col);

      // Then, we need to trigger a "special refill" mode?
      // Or we can just mutate the grid here and now?
      // If we mutate `newGrid` here, the pieces will change immediately.
      // But we want them to "fall" or "appear"?
      // User said "Refresh board".
      // Interpretation: The current board is wiped, and a NEW board appears with that composition.
      // So:
      // 1. Clear entire board (addToRemove all).
      // 2. But wait, if we remove them, they disappear.
      // 3. Then `fillEmptyPositions` fills them randomly.

      // We need to override `fillEmptyPositions` or handle it here.
      // Since `removeMatches` is just for removing, maybe we can't do the refill here.
      // BUT, we can change the pieces in `newGrid` to be the new types, and NOT mark them for removal?
      // No, then they won't match/explode.

      // User wants: "Board refreshed... 70% char6 or char9".
      // Interpretation: The current board is wiped, and a NEW board appears with that composition.
      // So:
      // 1. Clear entire board (addToRemove all).
      // 2. And we need to signal that the NEXT fill should be special.
      // We can't do that easily without changing the architecture.

      // Alternative:
      // Transform the pieces IN PLACE to char6/char9, and DON'T remove them (except the Super Pink).
      // Then they will be on the board immediately.
      // This might be less "flashy" but easier to implement.
      // Let's try:
      // 1. Remove Super Pink.
      // 2. Iterate all other cells.
      // 3. Randomly change them to char6 (6) or char9 (9) with 70% total probability.
      //    (35% char6, 35% char9, 30% random/unchanged?)
      //    User said "70% is char6 or char9".
      //    So 30% is something else.

      for (let r = 0; r < GAME_CONFIG.GRID_SIZE; r++) {
        for (let c = 0; c < GAME_CONFIG.GRID_SIZE; c++) {
          if (r === row && c === col) continue; // Skip Super Pink (already removed)

          // Don't touch blocks?
          if (newGrid[r][c].isBlock) continue;

          const rand = Math.random();
          if (rand < 0.7) {
            // 70% chance to be char6 or char9
            // Let's say 50/50 split between them
            const isChar6 = Math.random() < 0.5;
            newGrid[r][c] = {
              ...newGrid[r][c],
              type: isChar6 ? 6 : 9, // char6 or char9
              special: 'none', // Reset special?
              id: generatePieceId(), // New ID to trigger update
            };
          } else {
            // 30% chance: Keep existing? Or Random?
            // "Refresh" implies new. Let's randomize.
            newGrid[r][c] = {
              ...newGrid[r][c],
              type: getRandomPieceType(),
              special: 'none',
              id: generatePieceId(),
            };
          }
        }
      }
    }
  }

  // Delete matched pieces
  toRemove.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    (newGrid[r][c] as any) = null;
  });

  // Spawn special pieces
  matches.forEach(match => {
    if (match.specialType !== 'none' && match.triggerPosition) {
      const { row, col } = match.triggerPosition;
      // Revive the piece at trigger position and transform it
      // Ensure it's not null (it was just removed)
      // We create a new piece there.
      newGrid[row][col] = {
        type: match.type,
        id: generatePieceId(), // New ID to trigger animation? Or keep old? New is safer.
        special: match.specialType,
        isBlock: false,
      };
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
  }
  return newGrid as Grid;
};

export const fillEmptyPositions = (grid: Grid): Grid => {
  const newGrid = grid.map(row => row.map(piece => (piece ? { ...piece } : null)));

  for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      if (!newGrid[row][col]) {
        // Spawn new piece with rarity logic
        const rand = Math.random() * 100;
        let special: any = 'none';

        // S: Super Pink (0.1%), A: Bomb (0.5%), B: Pipe (1%), C: Ring (1.5%), D: Eraser (2%)
        if (rand < 0.1) special = 'superpink';
        else if (rand < 0.6) special = 'bomb';
        else if (rand < 1.6) special = 'dokan';
        else if (rand < 3.1) special = 'ring';
        else if (rand < 5.1) special = 'kesigomu';

        newGrid[row][col] = {
          type: getRandomPieceType(),
          id: generatePieceId(),
          special,
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
