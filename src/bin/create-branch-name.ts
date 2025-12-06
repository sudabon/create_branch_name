#!/usr/bin/env node

import { ConfigManager } from '../lib/config/config';
import { OpenAIClient } from '../lib/llm/openai-client';
import { promptFeatureDescription } from '../lib/prompt/prompt';

async function main() {
  const args = process.argv.slice(2);

  // 接頭辞の一覧表示
  if (args.includes('--list-prefixes') || args.includes('-l')) {
    const prefixes = ConfigManager.getPrefixes();
    const defaultPrefix = ConfigManager.getPrefix();
    console.log('\n登録されている接頭辞:');
    prefixes.forEach((prefix) => {
      const marker = prefix === defaultPrefix ? ' (デフォルト)' : '';
      console.log(`  - ${prefix}${marker}`);
    });
    console.log('');
    return;
  }

  // 接頭辞の追加
  if (args.includes('--add-prefix')) {
    const prefixIndex = args.indexOf('--add-prefix');
    if (prefixIndex !== -1 && args[prefixIndex + 1]) {
      const prefix = args[prefixIndex + 1];
      ConfigManager.addPrefix(prefix);
      console.log(`接頭辞 "${prefix}" を追加しました。`);
      return;
    } else {
      // 対話的に接頭辞を追加
      const { promptPrefix } = await import('../lib/prompt/prompt');
      const prefixes = ConfigManager.getPrefixes();
      const prefix = await promptPrefix(prefixes);
      ConfigManager.addPrefix(prefix);
      console.log(`接頭辞 "${prefix}" を追加しました。`);
      return;
    }
  }

  // 接頭辞の削除
  if (args.includes('--remove-prefix')) {
    const prefixIndex = args.indexOf('--remove-prefix');
    if (prefixIndex !== -1 && args[prefixIndex + 1]) {
      const prefix = args[prefixIndex + 1];
      ConfigManager.removePrefix(prefix);
      console.log(`接頭辞 "${prefix}" を削除しました。`);
      return;
    } else {
      const prefixes = ConfigManager.getPrefixes();
      if (prefixes.length === 0) {
        console.log('削除できる接頭辞がありません。');
        return;
      }
      const { promptPrefix } = await import('../lib/prompt/prompt');
      const prefix = await promptPrefix(prefixes);
      ConfigManager.removePrefix(prefix);
      console.log(`接頭辞 "${prefix}" を削除しました。`);
      return;
    }
  }

  // デフォルト接頭辞の設定
  if (args.includes('--set-default-prefix') || args.includes('--set-prefix') || args.includes('-p')) {
    const prefixIndex = args.indexOf('--set-default-prefix') !== -1
      ? args.indexOf('--set-default-prefix')
      : args.indexOf('--set-prefix') !== -1
      ? args.indexOf('--set-prefix')
      : args.indexOf('-p');
    
    if (prefixIndex !== -1 && args[prefixIndex + 1]) {
      const prefix = args[prefixIndex + 1];
      ConfigManager.setDefaultPrefix(prefix);
      console.log(`デフォルト接頭辞を "${prefix}" に設定しました。`);
      return;
    } else {
      // 対話的にデフォルト接頭辞を設定
      const { promptPrefix } = await import('../lib/prompt/prompt');
      const prefixes = ConfigManager.getPrefixes();
      const prefix = await promptPrefix(prefixes);
      ConfigManager.setDefaultPrefix(prefix);
      console.log(`デフォルト接頭辞を "${prefix}" に設定しました。`);
      return;
    }
  }

  // 現在の接頭辞を表示
  if (args.includes('--show-prefix')) {
    const prefix = ConfigManager.getPrefix();
    const prefixes = ConfigManager.getPrefixes();
    console.log(`デフォルト接頭辞: ${prefix}`);
    console.log(`登録されている接頭辞: ${prefixes.join(', ')}`);
    return;
  }

  // APIキーの設定コマンド
  if (args.includes('--setup-api-key') || args.includes('--set-api-key')) {
    const { promptApiKeySetup } = await import('../lib/prompt/prompt');
    await promptApiKeySetup();
    return;
  }

  // ヘルプ表示
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
使用方法:
  create-branch-name                          機能説明を入力してブランチ名を生成
  create-branch-name --list-prefixes           登録されている接頭辞の一覧を表示
  create-branch-name --add-prefix <prefix>     接頭辞を追加
  create-branch-name --add-prefix              対話的に接頭辞を追加
  create-branch-name --remove-prefix <prefix>   接頭辞を削除
  create-branch-name --remove-prefix           対話的に接頭辞を削除
  create-branch-name --set-default-prefix <prefix>  デフォルト接頭辞を設定
  create-branch-name --set-default-prefix           対話的にデフォルト接頭辞を設定
  create-branch-name --set-prefix <prefix>     デフォルト接頭辞を設定（--set-default-prefixの短縮形）
  create-branch-name --show-prefix             現在の接頭辞を表示
  create-branch-name --setup-api-key           対話的にAPIキーを設定（設定方法を案内）
  create-branch-name --help                    このヘルプを表示

環境変数:
  OPENAI_API_KEY    OpenAI APIキー（必須）

設定ファイル:
  ${ConfigManager.getConfigPath()}
    `);
    return;
  }

  // メイン処理: ブランチ名を生成
  try {
    // APIキーの確認
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('エラー: OPENAI_API_KEY 環境変数が設定されていません。\n');
      console.error('APIキーを設定するには、以下のいずれかの方法を使用してください:\n');
      console.error('1. 対話的に設定:');
      console.error('   create-branch-name --setup-api-key\n');
      console.error('2. 手動で環境変数を設定:');
      console.error('   export OPENAI_API_KEY="your-api-key"\n');
      console.error('3. シェル設定ファイルに追加（永続化）:');
      console.error('   echo \'export OPENAI_API_KEY="your-api-key"\' >> ~/.zshrc');
      console.error('   source ~/.zshrc\n');
      process.exit(1);
    }

    // 設定の読み込み
    const registeredPrefixes = ConfigManager.getPrefixes();

    // 機能説明の入力
    const { featureDescription } = await promptFeatureDescription();

    // ブランチ名の生成（LLMが接頭辞も含めて生成）
    console.log('\nブランチ名を生成中...');
    const client = new OpenAIClient(apiKey);
    const branchName = await client.generateBranchName({
      featureDescription,
      prefixes: registeredPrefixes,
    });

    // 結果の表示
    console.log('\n生成されたブランチ名:');
    console.log(`  ${branchName}\n`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`エラー: ${error.message}`);
    } else {
      console.error('予期しないエラーが発生しました:', error);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('予期しないエラーが発生しました:', error);
  process.exit(1);
});
