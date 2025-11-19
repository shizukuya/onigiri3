const fs = require('fs');
const path = require('path');

const GRID_SIZE = 8; // Assuming 8 based on previous context, but let's check game.ts if possible. 
// Actually, I'll just use the function calls strings in the output.

const generateLevels = () => {
  let content = `import { Level } from '../types/game';
import { GAME_CONFIG } from './game';

const { GRID_SIZE } = GAME_CONFIG;

// Helper to create empty layout
const createEmptyLayout = (): number[][] => {
  return Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
};

// Helper to create wall layout
const createWallLayout = (): number[][] => {
  const layout = createEmptyLayout();
  // Add some walls (1 = block)
  for (let i = 2; i < GRID_SIZE - 2; i++) {
    layout[i][3] = 1;
    layout[i][4] = 1;
  }
  return layout;
};

// Helper to create corners layout
const createCornersLayout = (): number[][] => {
  const layout = createEmptyLayout();
  layout[0][0] = 1;
  layout[0][GRID_SIZE - 1] = 1;
  layout[GRID_SIZE - 1][0] = 1;
  layout[GRID_SIZE - 1][GRID_SIZE - 1] = 1;
  return layout;
};

export const LEVELS: Level[] = [
`;

  // Manual Levels 1-3
  content += `  {
    id: 1,
    name: 'キャンディ平原',
    description: '基本ステージ。目標スコアを達成してみよう。',
    targetScore: 800,
    moveLimit: 30,
    pieceTypes: 9,
    background: 'bg_stage1.png',
    bgm: 'bgm_stage1.mp3',
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
    bgm: 'bgm_stage1.mp3',
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
    bgm: 'bgm_stage1.mp3',
    layout: createCornersLayout(),
  },
`;

  // Generated Levels 4-100
  for (let i = 4; i <= 100; i++) {
    const isBoss = i % 10 === 0;
    const targetScore = 2000 + ((i - 3) * 800);
    const moveLimit = Math.max(15, 25 - Math.floor((i - 4) / 8));

    let layoutCall = 'createEmptyLayout()';
    const layoutType = i % 3;
    if (layoutType === 1) layoutCall = 'createCornersLayout()';
    else if (layoutType === 2) layoutCall = 'createWallLayout()';

    const description = isBoss ? 'ボス級の難易度だ！慎重にいこう。' : 'どんどん難しくなるぞ！';

    content += `  {
    id: ${i},
    name: 'Stage ${i}',
    description: '${description}',
    targetScore: ${targetScore},
    moveLimit: ${moveLimit},
    pieceTypes: 9,
    background: 'bg_stage${i}.png',
    bgm: 'bgm_stage1.mp3',
    layout: ${layoutCall},
  },
`;
  }

  content += `];
`;

  fs.writeFileSync(path.join(__dirname, 'src/constants/levels.ts'), content);
  console.log('levels.ts generated successfully');
};

generateLevels();
