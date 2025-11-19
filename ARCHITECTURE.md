# プロジェクトアーキテクチャ

本格的な製品版Match-3パズルゲームのアーキテクチャドキュメント

## フォルダ構造

```
onigiri3/
├── src/
│   ├── components/          # UIコンポーネント
│   │   ├── game/           # ゲーム関連コンポーネント
│   │   │   ├── Piece/      # 個別ピースコンポーネント
│   │   │   │   ├── Piece.tsx
│   │   │   │   ├── Piece.styles.ts
│   │   │   │   └── index.ts
│   │   │   ├── Grid/       # グリッドコンポーネント
│   │   │   │   ├── Grid.tsx
│   │   │   │   ├── Grid.styles.ts
│   │   │   │   └── index.ts
│   │   │   ├── ScoreBoard/ # スコア表示コンポーネント
│   │   │   │   ├── ScoreBoard.tsx
│   │   │   │   ├── ScoreBoard.styles.ts
│   │   │   │   └── index.ts
│   │   │   └── ComboDisplay/ # コンボ表示コンポーネント
│   │   │       ├── ComboDisplay.tsx
│   │   │       ├── ComboDisplay.styles.ts
│   │   │       └── index.ts
│   │   └── ui/             # 汎用UIコンポーネント
│   │       ├── Button/     # ボタンコンポーネント
│   │       ├── Header/     # ヘッダーコンポーネント
│   │       └── Modal/      # モーダルコンポーネント
│   ├── hooks/              # カスタムフック
│   │   ├── useGameLogic.ts # ゲームロジックフック
│   │   └── useHaptics.ts   # ハプティックフィードバックフック
│   ├── utils/              # ユーティリティ関数
│   │   ├── gridUtils.ts    # グリッド操作関数
│   │   └── matchUtils.ts   # マッチ検出関数
│   ├── types/              # TypeScript型定義
│   │   └── game.ts         # ゲーム関連の型定義
│   ├── constants/          # 定数
│   │   ├── game.ts         # ゲーム設定定数
│   │   └── colors.ts       # カラーパレット
│   └── screens/            # スクリーン
│       └── GameScreen.tsx  # メインゲーム画面
├── assets/                 # 画像リソース
├── App.tsx                 # アプリケーションエントリーポイント
├── package.json
├── tsconfig.json
├── babel.config.js
└── app.json
```

## アーキテクチャの特徴

### 1. コンポーネント分離
各コンポーネントは独立したフォルダに配置され、以下を含みます：
- メインコンポーネント（`.tsx`）
- スタイル定義（`.styles.ts`）
- エクスポート用インデックス（`index.ts`）

### 2. カスタムフック
ビジネスロジックをコンポーネントから分離：
- `useGameLogic`: ゲームの状態管理とロジック
- `useHaptics`: ハプティックフィードバックの管理

### 3. ユーティリティ関数
再利用可能な純粋関数：
- `gridUtils.ts`: グリッド生成・操作
- `matchUtils.ts`: マッチ検出・検証

### 4. 型安全性
TypeScriptによる完全な型定義：
- すべてのコンポーネントにPropsインターフェース
- ゲームロジックの型定義
- 定数の型安全性

### 5. スタイル管理
一元化されたカラーパレットとテーマ：
- `colors.ts`: すべての色定義
- `game.ts`: ゲーム設定定数

## データフロー

```
App.tsx
  └─> GameScreen
        ├─> Header (UI)
        ├─> ScoreBoard (Game)
        ├─> Grid
        │     └─> Piece (複数)
        ├─> ComboDisplay
        ├─> Button (UI)
        └─> GameOverModal (UI)

フック:
  useGameLogic()
    ├─> gridUtils (初期化、操作)
    ├─> matchUtils (マッチ検出)
    └─> useHaptics() (振動フィードバック)
```

## 主要な設計パターン

### 1. Presentational/Container パターン
- **Container**: GameScreen（ロジックと状態管理）
- **Presentational**: Grid, Piece, ScoreBoard等（表示のみ）

### 2. Custom Hooks パターン
- ビジネスロジックをフックに抽出
- 再利用性と テスタビリティの向上

### 3. Atomic Design原則
- **Atoms**: Button, Piece
- **Molecules**: ScoreBoard, ComboDisplay
- **Organisms**: Grid, Header
- **Templates**: GameScreen

## パフォーマンス最適化

1. **useCallback** でメモ化された関数
2. **useSharedValue** による高速アニメーション
3. **React.memo** での不要な再レンダリング防止（必要に応じて）
4. 効率的な状態更新

## 拡張性

このアーキテクチャは以下の拡張が容易：
- 新しいゲームモードの追加
- パワーアップアイテムの実装
- レベルシステムの導入
- マルチプレイヤー機能
- アチーブメントシステム

## テスタビリティ

- ユーティリティ関数は純粋関数で単体テスト可能
- カスタムフックは独立してテスト可能
- コンポーネントはPropsを通じた依存性注入でテスト可能

## セキュリティ

- TypeScriptによる型安全性
- 入力検証（グリッド範囲チェック等）
- 不変性の原則（グリッド操作は常に新しいインスタンスを返す）
