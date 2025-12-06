# create-branch-name

LLM（ChatGPT）を使用してgitのブランチ名を自動生成するコマンドラインアプリケーション。

## インストール

### npmからインストール（公開後）

```bash
npm install -g @sudabon/create-branch-name@latest
```

### ローカルで開発・テストする場合

パッケージを公開する前にローカルでテストするには、以下の方法があります。

#### 方法1: npm linkを使用（推奨）

```bash
# プロジェクトのルートディレクトリで
npm run build
npm link

# これで create-branch-name コマンドがグローバルに利用可能になります
create-branch-name --help
```

#### 方法2: 直接実行

```bash
# ビルド
npm run build

# 直接実行
npm start
# または
node dist/bin/create-branch-name.js
```

## セットアップ

### OpenAI APIキーの設定

APIキーを設定するには、以下の3つの方法があります。

#### 方法1: 対話的に設定（推奨）

```bash
create-branch-name --setup-api-key
```

このコマンドを実行すると、シェルの種類を選択し、APIキーを入力すると、適切な設定コマンドが表示されます。

#### 方法2: 環境変数で手動設定

```bash
export OPENAI_API_KEY="your-api-key-here"
```

#### 方法3: シェル設定ファイルに追加（永続化）

```bash
# zshの場合
echo 'export OPENAI_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc

# bashの場合
echo 'export OPENAI_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc

# fishの場合
set -Ux OPENAI_API_KEY "your-api-key-here"
```

**注意**: APIキーは設定ファイルには保存されません。セキュリティ上の理由から、環境変数でのみ管理されます。

## 使用方法

### ブランチ名を生成する

```bash
create-branch-name
```

コマンドを実行すると、開発したい機能の説明を尋ねられます。説明を入力すると、LLMが登録されている接頭辞の中から適切なものを選択し、接頭辞付きのブランチ名を生成します。

### 接頭辞の管理

複数の接頭辞を登録して、その中から選択して使用できます。

#### 接頭辞の一覧を表示

```bash
create-branch-name --list-prefixes
```

#### 接頭辞を追加

```bash
# コマンドラインから追加
create-branch-name --add-prefix feature/
create-branch-name --add-prefix hotfix/
create-branch-name --add-prefix topic/

# 対話的に追加
create-branch-name --add-prefix
```

#### 接頭辞を削除

```bash
# コマンドラインから削除
create-branch-name --remove-prefix topic/

# 対話的に削除
create-branch-name --remove-prefix
```

#### デフォルト接頭辞を設定

```bash
# コマンドラインから設定
create-branch-name --set-default-prefix feature/
# または短縮形
create-branch-name --set-prefix feature/

# 対話的に設定
create-branch-name --set-default-prefix
```

#### 現在の接頭辞を確認

```bash
create-branch-name --show-prefix
```

**デフォルトの接頭辞:**
- `feature/` - 新機能開発用
- `hotfix/` - 緊急修正用
- `topic/` - トピックブランチ用
- `bugfix/` - バグ修正用
- `refactor/` - リファクタリング用

カスタム接頭辞も追加可能です。

**注意:** LLMが機能説明に基づいて、登録されている接頭辞の中から最も適切なものを自動的に選択します。ユーザーが接頭辞を選択する必要はありません。

### APIキーを設定する

```bash
create-branch-name --setup-api-key
```

対話的にAPIキーを設定し、環境変数の設定方法を案内します。

### ヘルプを表示する

```bash
create-branch-name --help
```

## 設定ファイル

設定は `~/.create-branch-name/config.json` に保存されます。

```json
{
  "prefixes": [
    "feature/",
    "hotfix/",
    "bugfix/",
    "refactor/",
    "topic/"
  ],
  "defaultPrefix": "feature/"
}
```

複数の接頭辞を登録しておくと、ブランチ名生成時に選択できます。

## 例

```bash
$ create-branch-name
開発したい機能を説明してください: ユーザー認証機能を追加する

ブランチ名を生成中...

生成されたブランチ名:
  feature/user-authentication
```

LLMが機能説明を分析し、登録されている接頭辞（feature/, hotfix/, bugfix/など）の中から適切なものを自動的に選択します。

## 開発

### ビルド

```bash
npm run build
```

### テスト

```bash
npm test
```

### リント

```bash
npm run lint
```

### フォーマット

```bash
npm run format
```

## ライセンス

MIT
