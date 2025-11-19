# Match-3 パズルゲーム

React Native (Expo) と TypeScript で作成された、中毒性の高い Match-3 パズルゲームです。

## 特徴

- **8x8 グリッド**: 広々としたゲームフィールド
- **9種類のキャラクター**: カラフルで多様なピース
- **連鎖システム**: 連続したマッチでコンボボーナス
- **滑らかなアニメーション**: react-native-reanimated による 60fps のアニメーション
- **ハプティックフィードバック**: 触覚フィードバックで没入感を向上
- **爽快なエフェクト**: ピースの消滅、落下、スコアアップの演出

## 技術スタック

- **React Native**: クロスプラットフォームモバイルアプリフレームワーク
- **Expo**: React Native 開発ツール
- **TypeScript**: 型安全性を確保
- **react-native-reanimated**: 高性能なアニメーション
- **react-native-gesture-handler**: ジェスチャー処理
- **expo-haptics**: ハプティックフィードバック

## セットアップ

### 前提条件

- Node.js (v18 以上推奨)
- npm または yarn
- Expo CLI

### インストール

1. 依存関係のインストール:

```bash
npm install
```

2. キャラクター画像の配置:

   `assets` フォルダに以下の画像を配置してください：
   - `char1.png` ~ `char9.png` (9種類のキャラクター画像)
   - `icon.png`, `splash.png`, `adaptive-icon.png`, `favicon.png` (Expo アプリ用画像)

   詳細は `assets/README.md` を参照してください。

3. アプリの起動:

```bash
npm start
```

### 実行

- **iOS シミュレータ**: `npm run ios`
- **Android エミュレータ**: `npm run android`
- **Web ブラウザ**: `npm run web`
- **Expo Go アプリ**: QRコードをスキャン

## ゲームの遊び方

1. 隣り合う2つのピースをタップして選択
2. 縦または横に3つ以上揃うとピースが消える
3. 消えたピースの上にあるピースが落下
4. 連鎖が発生するとコンボボーナスが加算される
5. 高得点を目指そう！

## ファイル構成

```
onigiri3/
├── src/
│   ├── components/        # UIコンポーネント
│   │   ├── game/         # ゲーム関連コンポーネント
│   │   │   ├── Piece/    # 個別ピース
│   │   │   ├── Grid/     # グリッド
│   │   │   ├── ScoreBoard/ # スコア表示
│   │   │   └── ComboDisplay/ # コンボ表示
│   │   └── ui/           # 汎用UI
│   │       ├── Button/
│   │       ├── Header/
│   │       └── Modal/
│   ├── hooks/            # カスタムフック
│   │   ├── useGameLogic.ts
│   │   └── useHaptics.ts
│   ├── utils/            # ユーティリティ関数
│   │   ├── gridUtils.ts
│   │   └── matchUtils.ts
│   ├── types/            # 型定義
│   │   └── game.ts
│   ├── constants/        # 定数
│   │   ├── game.ts
│   │   └── colors.ts
│   └── screens/          # スクリーン
│       └── GameScreen.tsx
├── assets/               # 画像リソース
├── App.tsx              # エントリーポイント
├── package.json         # 依存関係
├── tsconfig.json        # TypeScript設定
├── babel.config.js      # Babel設定
├── app.json            # Expo設定
└── ARCHITECTURE.md     # アーキテクチャドキュメント
```

詳細なアーキテクチャについては `ARCHITECTURE.md` を参照してください。

## カスタマイズ

### グリッドサイズの変更

`src/constants/game.ts` の `GRID_SIZE` 定数を変更してください。

```typescript
export const GAME_CONFIG = {
  GRID_SIZE: 7, // 7x7 グリッドに変更
  MIN_MATCH_COUNT: 3,
  BASE_SCORE_PER_PIECE: 10,
  INITIAL_MOVES: 30,
} as const;
```

### キャラクター数の変更

`src/types/game.ts` の `PIECE_TYPES` 配列を編集してください。

```typescript
export const PIECE_TYPES = [1, 2, 3, 4, 5, 6] as const; // 6種類に変更
```

対応する色とアイコンも `src/constants/colors.ts` で変更してください。

### カラースキーム

`src/constants/colors.ts` でアプリ全体のカラーテーマを変更できます。

```typescript
export const COLORS = {
  background: '#1a1a2e',      // 背景色
  boardBackground: '#16213e', // ボード背景色
  textPrimary: '#ffffff',     // プライマリテキスト
  textAccent: '#ffd700',      // アクセントテキスト
  // ...
};
```

## ライセンス

ISC

## 開発者向け情報

### 主要な実装ポイント

1. **連鎖検出**: `processMatches` 関数が再帰的に新しいマッチを検出
2. **重力処理**: `applyGravity` 関数がピースを落下させ、新しいピースを生成
3. **アニメーション**: `withSpring` と `withTiming` を使用した自然な動き
4. **ハプティック**: 各アクションに応じた適切な振動フィードバック

### パフォーマンス最適化

- `useCallback` でメモ化された関数
- `useSharedValue` による高速なアニメーション
- 効率的な状態管理

## トラブルシューティング

### 画像が表示されない

- `assets` フォルダに `char1.png` ~ `char9.png` が存在するか確認
- 画像ファイル名が正確か確認
- Expo を再起動してキャッシュをクリア

### アニメーションがカクつく

- Expo Go アプリではなく、開発ビルドまたはスタンドアロンアプリで実行
- `babel.config.js` に `react-native-reanimated/plugin` が含まれているか確認

## 今後の改善案

- [ ] レベルシステムの追加
- [ ] タイマーモードの実装
- [ ] パワーアップアイテム（爆弾、レインボーピースなど）
- [ ] ハイスコアの保存（AsyncStorage）
- [ ] サウンドエフェクトと BGM
- [ ] オンラインランキング

### npm install react-native-google-mobile-ads


npx expo start

cd ios
pod install --repo-update
cd ..

Xcodeでbuild

npx expo-doctor --verbose

リリース
eas build -p ios

提出
eas submit -p ios

枠がない場合(本番)
eas build --platform ios --local
eas build --platform android --local

枠がない場合(開発)
eas build --profile development --platform ios --local
neas build --profile development --platform android --local

eas build -p android

ビルド完了後、Google Play Consoleへの提出

eas submit -p android

開発build
eas build --profile development --platform ios
eas build --profile development --platform android

expoでbuildし端末に開発中アプリをinstall
npx expo start --dev-client


その他
npx expo prebuild --platform ios
cd ios
pod install
cd ..

方法1: ローカルでビルド（推奨）
# Android
npx expo run:android

# iOS (Macのみ)
npx expo run:ios

方法2: EAS Buildでdevelopment build作成
# Development build
eas build --profile development --platform android
eas build --profile development --platform ios

expoでbuildし端末に開発中アプリをinstall
npx expo start --dev-client

# 本番ビルド
eas build --profile production --platform android
eas build --profile production --platform ios

アプリid: アンドロイド
ca-app-pub-5081824799734894~1945341361

バナー広告: アンドロイド(開発)
ca-app-pub-3940256099942544/9214589741

バナー広告: アンドロイド(本番)
ca-app-pub-5081824799734894/5471978241

リワード広告: アンドロイド(開発)
ca-app-pub-3940256099942544/5224354917

リワード広告: アンドロイド(本番)
ca-app-pub-5081824799734894/2706214109

アプリid: iOS
ca-app-pub-5081824799734894~9383001774

バナー広告: iOS(開発)
ca-app-pub-3940256099942544/2435281174

バナー広告: iOS(本番)
ca-app-pub-5081824799734894/6785059914

リワード広告: iOS(開発)
ca-app-pub-3940256099942544/1712485313

リワード広告: iOS(本番)
ca-app-pub-5081824799734894/2248593691