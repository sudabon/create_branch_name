# npmパッケージ公開手順

このドキュメントでは、`@sudabon/create-branch-name` をnpmに公開する手順を説明します。

## 前提条件

1. npmアカウントを持っていること
2. `@sudabon` スコープの所有者であること（またはスコープなしのパッケージ名を使用）

## 公開前の確認

### 1. ビルドの確認

```bash
npm run build
```

### 2. テストの実行

```bash
npm test
```

### 3. リントチェック

```bash
npm run lint
```

### 4. ローカルでの動作確認

```bash
# npm linkでローカルインストール
npm link

# 動作確認
create-branch-name --help
```

## 公開手順

### 1. npmにログイン

```bash
npm login
```

ユーザー名、パスワード、メールアドレス、2要素認証コードを入力します。

### 2. スコープ付きパッケージの場合

`@sudabon` スコープを使用する場合、公開前に以下の設定が必要です。

#### オプションA: パブリックスコープとして公開

```bash
npm publish --access public
```

#### オプションB: package.jsonに設定を追加

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

その後、通常通り公開:

```bash
npm publish
```

### 3. パッケージの公開

```bash
npm publish
```

初回公開の場合は、バージョン `0.1.0` が公開されます。

### 4. 公開の確認

```bash
npm view @sudabon/create-branch-name
```

または、ブラウザで以下にアクセス:

```
https://www.npmjs.com/package/@sudabon/create-branch-name
```

## バージョンアップ

### パッチバージョン（0.1.0 → 0.1.1）

```bash
npm version patch
npm publish
```

### マイナーバージョン（0.1.0 → 0.2.0）

```bash
npm version minor
npm publish
```

### メジャーバージョン（0.1.0 → 1.0.0）

```bash
npm version major
npm publish
```

## トラブルシューティング

### エラー: "You do not have permission to publish"

- `@sudabon` スコープの所有者でない可能性があります
- スコープなしのパッケージ名（例: `create-branch-name`）に変更するか、スコープの所有者に連絡してください

### エラー: "Package name already exists"

- パッケージ名が既に使用されています
- `package.json` の `name` フィールドを変更してください

### エラー: "Access token expired"

```bash
npm logout
npm login
```

## 注意事項

- 公開前に必ず `npm run build` を実行してください
- `.npmignore` ファイルで、不要なファイルが公開されないように確認してください
- `package.json` の `version` フィールドが正しいことを確認してください
