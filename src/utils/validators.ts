export class Validators {
  static isValidApiKey(key: string): boolean {
    return key.length > 0 && key.trim() !== '';
  }

  static isValidFilePath(path: string): boolean {
    return path.length > 0 && !path.includes('..');
  }

  static isValidLanguage(language: string): boolean {
    const supported = ['javascript', 'typescript', 'python', 'java'];
    return supported.includes(language.toLowerCase());
  }
}
