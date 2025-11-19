/**
 * ゲーム設定の定数
 */

export const GAME_CONFIG = {
  GRID_SIZE: 6,
  MIN_MATCH_COUNT: 3,
  BASE_SCORE_PER_PIECE: 10,
  INITIAL_MOVES: 30,
  INITIAL_LIVES: 3,
} as const;

export const ANIMATION_DURATION = {
  SWAP: 100, // Faster swap
  MATCH: 120, // Faster match disappear
  FALL: 80, // Faster fall
  COMBO_DISPLAY: 700, // Shorter combo display
  PIECE_APPEAR: 120,
} as const;

export const HAPTIC_FEEDBACK = {
  SELECTION: 'selection',
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
} as const;
