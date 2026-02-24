# SnapReport

Before / After 報告ツール

## セットアップ

```bash
npm install
npm run dev
```

→ http://localhost:3000 で確認

## デプロイ（Vercel）

1. GitHubにプッシュ
2. Vercelでリポジトリを連携
3. 設定不要でそのままデプロイ完了

## 技術構成

- Next.js 15 (App Router)
- Tailwind CSS
- IndexedDB（24時間データ保持）
- Canvas API（PNG生成）

## ディレクトリ構成

```
app/
  layout.tsx       ルートレイアウト
  page.tsx         メインページ（アプリ本体）
  globals.css      グローバルスタイル

components/
  LocationCard.tsx 場所カード（撮影UI）
  PhotoZone.tsx    撮影・アップロードゾーン
  ReportTab.tsx    レポート画面
  Toast.tsx        トースト通知

lib/
  types.ts         型定義
  resize.ts        画像リサイズ（短辺1920px / JPEG 80%）
  storage.ts       IndexedDB（24時間TTL）
  report.ts        PNG生成・ダウンロード
  utils.ts         cn() ユーティリティ
```
