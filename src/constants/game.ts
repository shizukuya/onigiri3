/**
 * ゲーム設定の定数
 */

export const GAME_CONFIG = {
  GRID_SIZE: 8,
  MIN_MATCH_COUNT: 3,
  BASE_SCORE_PER_PIECE: 10,
  INITIAL_MOVES: 30,
} as const;

export const ANIMATION_DURATION = {
  SWAP: 100,
  MATCH: 100,
  FALL: 150,
  COMBO_DISPLAY: 1000,
  PIECE_APPEAR: 200,
} as const;

export const HAPTIC_FEEDBACK = {
  SELECTION: 'selection',
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
} as const;
