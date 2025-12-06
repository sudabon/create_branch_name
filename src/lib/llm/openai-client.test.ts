import { OpenAIClient } from './openai-client';

describe('OpenAIClient', () => {
  describe('isConfigured', () => {
    it('APIキーが設定されていない場合はfalseを返す', () => {
      const client = new OpenAIClient();
      expect(client.isConfigured()).toBe(false);
    });

    it('APIキーが設定されている場合はtrueを返す', () => {
      const client = new OpenAIClient('test-api-key');
      expect(client.isConfigured()).toBe(true);
    });
  });

  describe('generateBranchName', () => {
    it('APIキーが設定されていない場合はエラーを投げる', async () => {
      const client = new OpenAIClient();
      await expect(
        client.generateBranchName({
          featureDescription: 'test feature',
        })
      ).rejects.toThrow('OpenAI APIキーが設定されていません');
    });
  });
});
