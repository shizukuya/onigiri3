# Onigiri3 - Match-3 Puzzle Game

React Native (Expo) と TypeScript で作成された、中毒性の高い本格的な Match-3 パズルゲームです。

## ゲームのルールと仕様

### 基本ルール
1.  **マッチング**: 隣り合う2つのピースをスワイプして入れ替えます。
2.  **消去**: 縦または横に **3つ以上** 同じ種類のピースが揃うと消えます。
3.  **連鎖 (Combo)**: 消えたピースの上から新しいピースが落下し、さらに揃うと連鎖が発生します。連鎖するほどスコア倍率が上がります。
4.  **フリー移動**: マッチしなくてもピースを自由に動かすことができます（戦略的な配置が可能）。

### 特殊アイテム (Special Items)
4つ以上のピースを同時に消すと、強力な特殊アイテムが生成されます。

| アイテム名 | 生成条件 | 効果 |
| :--- | :--- | :--- |
| **土管 (Pipe)** | 縦に4つ消す | **縦一列** を全て消去します。 |
| **消しゴム (Eraser)** | 横に4つ消す | **横一列** を全て消去します。 |
| **爆弾 (Bomb)** | T字またはL字に5つ消す | 周囲のピースを爆発させて消去します。 |
| **リング (Ring)** | 一直線に5つ消す | **周囲3x3マス** を広範囲に消去します（レインボー効果）。 |

*   **発動方法**: 特殊アイテムを隣のピースと入れ替える（スワイプする）だけで発動します。
*   **自然発生**: ピース補充時に約5%の確率でランダムに特殊アイテムが降ってくることがあります。

### ステージと難易度
全100ステージ以上のレベル制です。

*   **クリア条件**: 指定された「手数 (Move Limit)」以内に「目標スコア (Target Score)」を達成すること。
*   **難易度カーブ**:
    *   **Stage 1-10**: チュートリアル級（手数20回程度）
    *   **Stage 11-40**: ノーマル（手数25-30回程度）
    *   **Stage 41+**: ハード/ボス級（手数35-45回程度）
    *   **ボスステージ**: 10ステージごとに少し手数の多いボスステージが登場します。
*   **ライフ**: ステージ失敗時にライフが1つ減ります。ライフが0になるとゲームオーバーです。

### スコアリング
*   **基本スコア**: ピース1つにつき 10点
*   **コンボボーナス**: (コンボ数 + 1) 倍のスコアが入ります。
    *   例: 1コンボ目 (通常) = 1倍
    *   2コンボ目 = 2倍
    *   3コンボ目 = 3倍...
*   **特殊アイテムボーナス**: 特殊アイテムで消したピースには追加ボーナスが入ります。

## 技術スタック

- **Core**: React Native, Expo
- **Language**: TypeScript
- **Animation**: react-native-reanimated (60fps smooth animations)
- **Gesture**: react-native-gesture-handler
- **Audio**: expo-av
- **Haptics**: expo-haptics

## セットアップ

### インストール
```bash
npm install
```

### 実行
```bash
npm start
```
*   **iOS**: `npm run ios`
*   **Android**: `npm run android`

## ファイル構成
```
src/
├── components/   # UI & ゲームパーツ (Piece, Grid, ParticleOverlay)
├── hooks/        # ロジック (useGameLogic, useSound)
├── screens/      # 画面 (GameScreen, StageSelectScreen)
├── constants/    # 定数 (levels.ts, game.ts)
└── utils/        # 計算処理 (gridUtils.ts, matchUtils.ts)
```

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
eas build --profile development --platform android --local

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
ca-app-pub-5081824799734894~6536969289

バナー広告: アンドロイド(開発)
ca-app-pub-3940256099942544/9214589741

バナー広告: アンドロイド(本番)
ca-app-pub-5081824799734894/6956713636

リワード広告: アンドロイド(開発)
ca-app-pub-3940256099942544/5224354917

リワード広告: アンドロイド(本番)
ca-app-pub-5081824799734894/1695706143

アプリid: iOS
ca-app-pub-5081824799734894~1197120491

バナー広告: iOS(開発)
ca-app-pub-3940256099942544/2435281174

バナー広告: iOS(本番)
ca-app-pub-5081824799734894/2785426531

リワード広告: iOS(開発)
ca-app-pub-3940256099942544/1712485313

リワード広告: iOS(本番)
ca-app-pub-5081824799734894/3687444668
