import inquirer from 'inquirer';

export interface PromptResult {
  featureDescription: string;
}

/**
 * ユーザーに機能説明を尋ねる
 */
export async function promptFeatureDescription(): Promise<PromptResult> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'featureDescription',
      message: '開発したい機能を説明してください:',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return '機能説明を入力してください。';
        }
        if (input.trim().length < 10) {
          return 'もう少し詳しく説明してください（10文字以上）。';
        }
        return true;
      },
    },
  ]);

  return {
    featureDescription: answers.featureDescription.trim(),
  };
}

/**
 * 接頭辞の設定を尋ねる
 */
export async function promptPrefix(registeredPrefixes: string[] = []): Promise<string> {
  const defaultChoices = [
    { name: 'feature/', value: 'feature/' },
    { name: 'hotfix/', value: 'hotfix/' },
    { name: 'topic/', value: 'topic/' },
    { name: 'bugfix/', value: 'bugfix/' },
    { name: 'refactor/', value: 'refactor/' },
  ];

  // 登録済みの接頭辞とデフォルトの選択肢をマージ（重複を除去）
  const allChoices = [...new Set([...registeredPrefixes, ...defaultChoices.map((c) => c.value)])];
  const choices = allChoices.map((prefix) => ({
    name: prefix,
    value: prefix,
  }));

  choices.push({ name: 'カスタム接頭辞を追加', value: 'custom' });

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'prefix',
      message: '接頭辞を選択してください:',
      choices,
    },
  ]);

  if (answers.prefix === 'custom') {
    const customAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'customPrefix',
        message: 'カスタム接頭辞を入力してください（末尾に/を含める）:',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return '接頭辞を入力してください。';
          }
          if (!input.endsWith('/')) {
            return '接頭辞は "/" で終わる必要があります（例: feature/）。';
          }
          return true;
        },
      },
    ]);
    return customAnswer.customPrefix;
  }

  return answers.prefix;
}

/**
 * ブランチ名生成時に接頭辞を選択する
 */
export async function promptPrefixSelection(registeredPrefixes: string[], defaultPrefix: string): Promise<string> {
  if (registeredPrefixes.length === 0) {
    return defaultPrefix;
  }

  const choices = registeredPrefixes.map((prefix) => ({
    name: prefix === defaultPrefix ? `${prefix} (デフォルト)` : prefix,
    value: prefix,
  }));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'prefix',
      message: '使用する接頭辞を選択してください:',
      choices,
      default: defaultPrefix,
    },
  ]);

  return answers.prefix;
}

/**
 * APIキーの設定方法を案内する
 */
export async function promptApiKeySetup(): Promise<void> {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'shell',
      message: '使用しているシェルを選択してください:',
      choices: [
        { name: 'bash', value: 'bash' },
        { name: 'zsh', value: 'zsh' },
        { name: 'fish', value: 'fish' },
        { name: 'その他 / 手動設定', value: 'manual' },
      ],
    },
  ]);

  const apiKey = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'OpenAI APIキーを入力してください:',
      mask: '*',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'APIキーを入力してください。';
        }
        if (!input.startsWith('sk-')) {
          return 'OpenAI APIキーは "sk-" で始まる必要があります。';
        }
        return true;
      },
    },
  ]);

  const shell = answers.shell;
  const configFile = shell === 'bash' ? '~/.bashrc' : shell === 'zsh' ? '~/.zshrc' : shell === 'fish' ? '~/.config/fish/config.fish' : null;

  console.log('\n以下のコマンドを実行してAPIキーを設定してください:\n');

  if (configFile && shell !== 'manual') {
    const exportCommand = shell === 'fish' 
      ? `set -Ux OPENAI_API_KEY "${apiKey.apiKey}"`
      : `export OPENAI_API_KEY="${apiKey.apiKey}"`;
    
    console.log(`# 一時的に設定（現在のセッションのみ）`);
    console.log(`${exportCommand}\n`);
    
    console.log(`# 永続的に設定（${configFile}に追加）`);
    if (shell === 'fish') {
      console.log(`echo 'set -Ux OPENAI_API_KEY "${apiKey.apiKey}"' >> ${configFile}`);
    } else {
      console.log(`echo 'export OPENAI_API_KEY="${apiKey.apiKey}"' >> ${configFile}`);
      console.log(`source ${configFile}`);
    }
  } else {
    console.log(`export OPENAI_API_KEY="${apiKey.apiKey}"`);
    console.log('\nまたは、.bashrc や .zshrc に追加して永続化:');
    console.log(`echo 'export OPENAI_API_KEY="${apiKey.apiKey}"' >> ~/.bashrc`);
    console.log('source ~/.bashrc');
  }

  console.log('\n設定後、再度 create-branch-name コマンドを実行してください。\n');
}
