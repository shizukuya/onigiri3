/**
 * ゲームに関する型定義
 */

export const PIECE_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const BLOCK_TYPE = 99;
export type PieceType = typeof PIECE_TYPES[number] | typeof BLOCK_TYPE;

export interface Position {
  row: number;
  col: number;
}

export type SpecialType = 'none' | 'bomb' | 'dokan' | 'ring' | 'kesigomu';

export interface Piece {
  type: PieceType;
  id: string;
  special?: SpecialType;
  isBlock?: boolean; // New: Obstacle block
}

export type Grid = Piece[][];

export interface Match {
  type: PieceType;
  positions: Position[];
  count: number;
  specialType: SpecialType;
  triggerPosition?: Position;
}

export interface GameState {
  grid: Grid;
  score: number;
  moves: number;
  combo: number;
  isProcessing: boolean;
  gameOver: boolean;
  highScore: number;
}

export interface SwapResult {
  success: boolean;
  matchCount: number;
  comboCount: number;
}

export interface AnimationConfig {
  duration: number;
  easing?: string;
}

export interface Level {
  id: number;
  name: string;
  description?: string;
  targetScore: number;
  moveLimit: number;
  pieceTypes?: number;
  background?: string;
  bgm?: string; // New: Background music filename
  layout?: number[][]; // New: 0 = empty, 1 = block
}
