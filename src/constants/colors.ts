/**
 * カラーパレット
 */

import { PieceType } from '../types/game';

export const COLORS = {
  // 背景色
  background: '#1a1a2e',
  boardBackground: '#16213e',

  // テキスト色
  textPrimary: '#ffffff',
  textSecondary: '#a0a0a0',
  textAccent: '#ffd700',

  // ボタン色
  buttonPrimary: '#e94560',
  buttonSecondary: '#4ECDC4',
  buttonDisabled: '#6c757d',

  // Brand Colors
  primary: '#e94560',
  secondary: '#4ECDC4',

  // ステータス色
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',

  // コンボ色
  combo: '#ff5722',
  comboGlow: 'rgba(255, 87, 34, 0.9)',

  // シャドウ
  shadow: '#000000',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.3)',
  shadowHeavy: 'rgba(0, 0, 0, 0.5)',
} as const;

export const PIECE_COLORS: Record<PieceType, string> = {
  1: '#FF6B6B', // 赤
  2: '#4ECDC4', // 青緑
  3: '#45B7D1', // 青
  4: '#FFA07A', // オレンジ
  5: '#98D8C8', // ミント
  6: '#F7DC6F', // 黄色
  7: '#BB8FCE', // 紫
  8: '#85C1E2', // 水色
  9: '#F8B500', // 金色
};

export const PIECE_ICONS: Record<PieceType, string> = {
  1: '🍎',
  2: '🍊',
  3: '🍋',
  4: '🍇',
  5: '🍓',
  6: '🍌',
  7: '🍉',
  8: '🍑',
  9: '🍒',
};
