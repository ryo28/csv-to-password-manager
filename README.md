# Authenticator CSV Converter

Microsoft Authenticator の CSV を Bitwarden 形式の CSV に変換する、クライアント完結型の Web ツールです。  
フォームやデータベースを使わず、ファイル処理はすべてブラウザ上で完結します。

## 利用方法

1. Microsoft Authenticator からエクスポートした CSV をアップロード
2. Bitwarden 形式に変換された CSV をダウンロード

## 技術スタック

- [Next.js](https://nextjs.org)
- TypeScript
- Tailwind CSS
- PapaParse（CSV 変換ライブラリ）

## セットアップ方法（開発者向け）

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```
