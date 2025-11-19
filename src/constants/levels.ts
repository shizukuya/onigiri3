/**
 * ステージ定義
 */

import { Level } from '../types/game';

const GRID_SIZE = 6;

const createEmptyLayout = () => Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));

const createWallLayout = () => {
  const layout = createEmptyLayout();
  for (let i = 1; i < 5; i++) {
    layout[i][3] = 1; // Wall at column 3
  }
  return layout;
};

const createCornersLayout = () => {
  const layout = createEmptyLayout();
  // Top-Left
  layout[0][0] = 1;
  // Top-Right
  layout[0][5] = 1;
  // Bottom-Left
  layout[5][0] = 1;
  // Bottom-Right
  layout[5][5] = 1;
  return layout;
};

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'キャンディ平原',
    description: '基本ステージ。目標スコアを達成してみよう。',
    targetScore: 800,
    moveLimit: 30,
    pieceTypes: 9,
    background: 'bg_stage1.png',
    layout: createEmptyLayout(),
  },
  {
    id: 2,
    name: 'シュガー洞窟',
    description: '壁が邪魔をしているぞ。隣で消して壊そう！',
    targetScore: 1400,
    moveLimit: 26,
    pieceTypes: 9,
    background: 'bg_stage2.png',
    layout: createWallLayout(),
  },
  {
    id: 3,
    name: 'キャラメル崖',
    description: '四隅が埋まっている。中央でコンボを狙え！',
    targetScore: 2000,
    moveLimit: 24,
    pieceTypes: 9,
    background: 'bg_stage3.png',
    layout: createCornersLayout(),
  },
];
