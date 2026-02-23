export class DiffUtils {
  static formatDiff(oldText: string, newText: string): string {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    let result = '';
    
    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < oldLines.length && i < newLines.length) {
        if (oldLines[i] !== newLines[i]) {
          result += `- ${oldLines[i]}\n+ ${newLines[i]}\n`;
        }
      } else if (i < oldLines.length) {
        result += `- ${oldLines[i]}\n`;
      } else {
        result += `+ ${newLines[i]}\n`;
      }
    }
    return result;
  }

  static calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const maxLen = Math.max(len1, len2);
    if (maxLen === 0) return 1.0;
    let matches = 0;
    for (let i = 0; i < Math.min(len1, len2); i++) {
      if (str1[i] === str2[i]) matches++;
    }
    return matches / maxLen;
  }
}
