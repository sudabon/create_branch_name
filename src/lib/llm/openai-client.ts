import OpenAI from 'openai';

export interface BranchNameOptions {
  featureDescription: string;
  prefixes?: string[];
}

export class OpenAIClient {
  private client: OpenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.client = new OpenAI({
        apiKey: apiKey,
      });
    }
  }

  /**
   * APIキーが設定されているか確認
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * ブランチ名を生成する
   */
  async generateBranchName(options: BranchNameOptions): Promise<string> {
    if (!this.client) {
      throw new Error(
        'OpenAI APIキーが設定されていません。環境変数 OPENAI_API_KEY を設定してください。'
      );
    }

    const prompt = this.buildPrompt(options.featureDescription, options.prefixes);

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that generates git branch names. Generate a complete branch name including the appropriate prefix based on the feature description. Return only the branch name in the format "prefix/branch-name" without any explanation.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.7,
      });

      const branchName = response.choices[0]?.message?.content?.trim();
      if (!branchName) {
        throw new Error('ブランチ名の生成に失敗しました。');
      }

      // LLMが返したブランチ名をそのまま返す（接頭辞も含まれている）
      return branchName;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error(
            'OpenAI APIキーが無効です。環境変数 OPENAI_API_KEY を確認してください。'
          );
        }
        if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('ネットワークエラーが発生しました。接続を確認してください。');
        }
      }
      throw new Error(`ブランチ名の生成に失敗しました: ${error}`);
    }
  }

  /**
   * プロンプトを構築する
   */
  private buildPrompt(featureDescription: string, prefixes?: string[]): string {
    let prompt = `以下の機能説明に基づいて、適切なgitブランチ名を生成してください。\n\n機能説明: ${featureDescription}`;

    if (prefixes && prefixes.length > 0) {
      prompt += `\n\n使用可能な接頭辞:\n${prefixes.map((p) => `- ${p}`).join('\n')}`;
      prompt +=
        '\n\n上記の接頭辞の中から、機能説明に最も適した接頭辞を選択してください。';
      prompt +=
        '\n- 新機能開発: feature/';
      prompt +=
        '\n- 緊急修正: hotfix/';
      prompt +=
        '\n- バグ修正: bugfix/';
      prompt +=
        '\n- リファクタリング: refactor/';
      prompt +=
        '\n- その他のトピック: topic/';
    } else {
      prompt +=
        '\n\n一般的な接頭辞を使用してください（feature/, hotfix/, bugfix/, refactor/, topic/など）。';
    }

    prompt +=
      '\n\nブランチ名は以下の規則に従ってください:';
    prompt +=
      '\n- 接頭辞を含めた完全なブランチ名を返す（例: feature/user-authentication）';
    prompt +=
      '\n- 小文字のみ使用';
    prompt +=
      '\n- 単語はハイフン(-)で区切る';
    prompt +=
      '\n- 簡潔で意味が明確';
    prompt +=
      '\n- 30文字以内（接頭辞を含む）';

    return prompt;
  }
}
