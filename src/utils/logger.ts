export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private static level: LogLevel = LogLevel.INFO;
  private static output: any[] = [];

  static setLevel(level: LogLevel): void {
    this.level = level;
  }

  static debug(...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log('[DEBUG]', new Date().toISOString(), ...args);
      this.output.push({ level: 'DEBUG', timestamp: new Date(), args });
    }
  }

  static info(...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log('[INFO]', new Date().toISOString(), ...args);
      this.output.push({ level: 'INFO', timestamp: new Date(), args });
    }
  }

  static warn(...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn('[WARN]', new Date().toISOString(), ...args);
      this.output.push({ level: 'WARN', timestamp: new Date(), args });
    }
  }

  static error(...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error('[ERROR]', new Date().toISOString(), ...args);
      this.output.push({ level: 'ERROR', timestamp: new Date(), args });
    }
  }

  static getOutput(): any[] {
    return this.output;
  }

  static clear(): void {
    this.output = [];
  }
}
