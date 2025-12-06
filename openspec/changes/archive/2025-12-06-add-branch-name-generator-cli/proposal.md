## Why

開発者がgitのブランチ名を考える際、適切な命名規則に従ったブランチ名を生成するのは時間がかかります。LLMを活用して、開発したい機能の説明から適切なブランチ名の案を自動生成することで、開発効率を向上させます。

## What Changes

- コマンドラインアプリケーションとして、npm install -gでインストール可能なCLIツールを追加
- 設定可能な接頭辞（feature/, hotfix/, topic/など）の管理機能
- 対話的な機能説明の入力インターフェース
- ChatGPT APIを使用したブランチ名生成機能
- 生成されたブランチ名の案を出力する機能

## Impact

- Affected specs: `branch-name-generator` (新規追加)
- Affected code: 
  - CLIエントリーポイント（bin/）
  - 設定管理モジュール
  - LLM API統合モジュール
  - 対話的入力処理モジュール
  - package.json（npmパッケージ設定）
