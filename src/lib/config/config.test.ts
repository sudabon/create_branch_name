import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ConfigManager } from './config';

// テスト用の設定ファイルパス
const TEST_CONFIG_DIR = path.join(os.tmpdir(), 'create-branch-name-test');

describe('ConfigManager', () => {
  beforeEach(() => {
    // テスト用ディレクトリのクリーンアップ
    if (fs.existsSync(TEST_CONFIG_DIR)) {
      fs.rmSync(TEST_CONFIG_DIR, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // テスト用ディレクトリのクリーンアップ
    if (fs.existsSync(TEST_CONFIG_DIR)) {
      fs.rmSync(TEST_CONFIG_DIR, { recursive: true, force: true });
    }
  });

  describe('getPrefix', () => {
    it('デフォルトの接頭辞を返す', () => {
      const prefix = ConfigManager.getPrefix();
      expect(prefix).toBe('feature/');
    });
  });

  describe('setPrefix', () => {
    it('接頭辞を設定できる', () => {
      ConfigManager.setPrefix('hotfix/');
      const prefix = ConfigManager.getPrefix();
      expect(prefix).toBe('hotfix/');
    });
  });

  describe('loadConfig', () => {
    it('設定ファイルが存在しない場合は空のオブジェクトを返す', () => {
      const config = ConfigManager.loadConfig();
      expect(config).toEqual({});
    });
  });
});
