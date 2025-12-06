import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Config {
  prefixes?: string[];
  defaultPrefix?: string;
  // 後方互換性のため、旧形式のprefixもサポート
  prefix?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.create-branch-name');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_PREFIXES = ['feature/', 'hotfix/', 'bugfix/', 'refactor/', 'topic/'];
const DEFAULT_PREFIX = 'feature/';

export class ConfigManager {
  /**
   * 設定ファイルを読み込む
   */
  static loadConfig(): Config {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
        const config = JSON.parse(content) as Config;
        
        // 後方互換性: 旧形式のprefixがある場合は、prefixesに変換
        if (config.prefix && !config.prefixes) {
          config.prefixes = [config.prefix];
          config.defaultPrefix = config.prefix;
          delete config.prefix;
          this.saveConfig(config);
        }
        
        return config;
      }
    } catch (error) {
      console.error('設定ファイルの読み込みに失敗しました:', error);
    }
    return {};
  }

  /**
   * 設定を保存する
   */
  static saveConfig(config: Config): void {
    try {
      // 設定ディレクトリが存在しない場合は作成
      if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
      }
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    } catch (error) {
      console.error('設定ファイルの保存に失敗しました:', error);
      throw error;
    }
  }

  /**
   * 接頭辞を設定する（後方互換性のため残す）
   */
  static setPrefix(prefix: string): void {
    const config = this.loadConfig();
    if (!config.prefixes) {
      config.prefixes = [prefix];
    } else if (!config.prefixes.includes(prefix)) {
      config.prefixes.push(prefix);
    }
    config.defaultPrefix = prefix;
    this.saveConfig(config);
  }

  /**
   * 接頭辞を取得する（設定されていない場合はデフォルト値を返す）
   */
  static getPrefix(): string {
    const config = this.loadConfig();
    return config.defaultPrefix || config.prefix || DEFAULT_PREFIX;
  }

  /**
   * すべての接頭辞を取得する
   */
  static getPrefixes(): string[] {
    const config = this.loadConfig();
    if (config.prefixes && config.prefixes.length > 0) {
      return config.prefixes;
    }
    // 後方互換性: 旧形式のprefixがある場合
    if (config.prefix) {
      return [config.prefix];
    }
    return DEFAULT_PREFIXES;
  }

  /**
   * 接頭辞を追加する
   */
  static addPrefix(prefix: string): void {
    const config = this.loadConfig();
    if (!config.prefixes) {
      config.prefixes = [];
    }
    if (!config.prefixes.includes(prefix)) {
      config.prefixes.push(prefix);
      this.saveConfig(config);
    }
  }

  /**
   * 接頭辞を削除する
   */
  static removePrefix(prefix: string): void {
    const config = this.loadConfig();
    if (config.prefixes) {
      config.prefixes = config.prefixes.filter((p) => p !== prefix);
      // 削除した接頭辞がデフォルトの場合、デフォルトをリセット
      if (config.defaultPrefix === prefix) {
        config.defaultPrefix = config.prefixes[0] || DEFAULT_PREFIX;
      }
      this.saveConfig(config);
    }
  }

  /**
   * デフォルト接頭辞を設定する
   */
  static setDefaultPrefix(prefix: string): void {
    const config = this.loadConfig();
    // 接頭辞が登録されていない場合は追加
    if (!config.prefixes) {
      config.prefixes = [];
    }
    if (!config.prefixes.includes(prefix)) {
      config.prefixes.push(prefix);
    }
    config.defaultPrefix = prefix;
    this.saveConfig(config);
  }

  /**
   * 設定ファイルのパスを取得する
   */
  static getConfigPath(): string {
    return CONFIG_FILE;
  }
}
