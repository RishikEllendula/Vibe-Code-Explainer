export interface Change {
  id: string;
  filePath: string;
  fileName: string;
  startLine: number;
  endLine: number;
  oldContent: string;
  newContent: string;
  changeType: 'addition' | 'deletion' | 'modification';
  timestamp: Date;
  language: string;
  explained?: boolean;
  explanationId?: string;
}

export class ChangeModel {
  static create(data: Partial<Change>): Change {
    return {
      id: data.id || this.generateId(),
      filePath: data.filePath || '',
      fileName: data.fileName || '',
      startLine: data.startLine || 0,
      endLine: data.endLine || 0,
      oldContent: data.oldContent || '',
      newContent: data.newContent || '',
      changeType: data.changeType || 'modification',
      timestamp: data.timestamp || new Date(),
      language: data.language || 'plaintext',
      explained: data.explained || false,
      explanationId: data.explanationId,
    };
  }

  static generateId(): string {
    return `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static serialize(change: Change): string {
    return JSON.stringify(change);
  }

  static deserialize(data: string): Change {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      timestamp: new Date(parsed.timestamp),
    };
  }

  static getLinesChanged(change: Change): number {
    const oldLines = change.oldContent.split('\n').length;
    const newLines = change.newContent.split('\n').length;
    return Math.abs(newLines - oldLines) + Math.min(oldLines, newLines);
  }

  static getComplexityScore(change: Change): number {
    let score = 0;
    
    // Lines changed
    score += this.getLinesChanged(change);
    
    // Type of change
    if (change.changeType === 'modification') {
      score += 5;
    }
    
    // Code complexity indicators
    const content = change.newContent + change.oldContent;
    if (content.match(/if|else|switch|for|while/g)) {
      score += 3;
    }
    if (content.match(/function|class|interface/g)) {
      score += 5;
    }
    if (content.match(/async|await|Promise/g)) {
      score += 4;
    }
    
    return score;
  }

  static toTreeItem(change: Change): any {
    return {
      label: change.fileName,
      description: `Lines ${change.startLine}-${change.endLine}`,
      tooltip: `${change.changeType} at ${change.timestamp.toLocaleString()}`,
      contextValue: 'change',
      id: change.id,
    };
  }
}
