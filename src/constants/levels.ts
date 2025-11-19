/**
 * ステージ定義
 */

import { Level } from '../types/game';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'キャンディ平原',
    description: '基本ステージ。目標スコアを達成してみよう。',
    targetScore: 800,
    moveLimit: 30,
    pieceTypes: 9,
    background: 'bg_stage1.png',
  },
  {
    id: 2,
    name: 'シュガー洞窟',
    description: '手数は少なめ。コンボを狙って突破！',
    targetScore: 1400,
    moveLimit: 26,
    pieceTypes: 9,
    background: 'bg_stage2.png',
  },
  {
    id: 3,
    name: 'キャラメル崖',
    description: '高スコアが必要。大連鎖を決めよう。',
    targetScore: 2000,
    moveLimit: 24,
    pieceTypes: 9,
    background: 'bg_stage3.png',
  },
];
