export interface Explanation {
  id: string;
  changeId: string;
  summary: string;
  detailedExplanation: string;
  codeFlow: string;
  keyChanges: string[];
  recommendations: string[];
  timestamp: Date;
  userRating?: number;
  userFeedback?: string;
}

export class ExplanationModel {
  static create(data: Partial<Explanation>): Explanation {
    return {
      id: data.id || this.generateId(),
      changeId: data.changeId || '',
      summary: data.summary || '',
      detailedExplanation: data.detailedExplanation || '',
      codeFlow: data.codeFlow || '',
      keyChanges: data.keyChanges || [],
      recommendations: data.recommendations || [],
      timestamp: data.timestamp || new Date(),
      userRating: data.userRating,
      userFeedback: data.userFeedback,
    };
  }

  static generateId(): string {
    return `explanation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static serialize(explanation: Explanation): string {
    return JSON.stringify(explanation);
  }

  static deserialize(data: string): Explanation {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      timestamp: new Date(parsed.timestamp),
    };
  }

  static getQualityScore(explanation: Explanation): number {
    let score = 0;
    
    // Has summary
    if (explanation.summary.length > 10) {
      score += 20;
    }
    
    // Has detailed explanation
    if (explanation.detailedExplanation.length > 50) {
      score += 30;
    }
    
    // Has code flow
    if (explanation.codeFlow.length > 0) {
      score += 20;
    }
    
    // Has key changes
    score += Math.min(explanation.keyChanges.length * 5, 15);
    
    // Has recommendations
    score += Math.min(explanation.recommendations.length * 5, 15);
    
    return score;
  }

  static truncateSummary(summary: string, maxLength: number = 100): string {
    if (summary.length <= maxLength) {
      return summary;
    }
    return summary.substring(0, maxLength - 3) + '...';
  }

  static toMarkdown(explanation: Explanation): string {
    let markdown = `# Explanation\n\n`;
    
    markdown += `## Summary\n${explanation.summary}\n\n`;
    
    if (explanation.detailedExplanation) {
      markdown += `## Detailed Explanation\n${explanation.detailedExplanation}\n\n`;
    }
    
    if (explanation.codeFlow) {
      markdown += `## Code Flow\n${explanation.codeFlow}\n\n`;
    }
    
    if (explanation.keyChanges.length > 0) {
      markdown += `## Key Changes\n`;
      explanation.keyChanges.forEach(change => {
        markdown += `- ${change}\n`;
      });
      markdown += '\n';
    }
    
    if (explanation.recommendations.length > 0) {
      markdown += `## Recommendations\n`;
      explanation.recommendations.forEach(rec => {
        markdown += `- ${rec}\n`;
      });
      markdown += '\n';
    }
    
    return markdown;
  }

  static toHTML(explanation: Explanation): string {
    let html = `<div class="explanation">`;
    
    html += `<h2>Summary</h2><p>${this.escapeHtml(explanation.summary)}</p>`;
    
    if (explanation.detailedExplanation) {
      html += `<h2>Detailed Explanation</h2><p>${this.escapeHtml(explanation.detailedExplanation)}</p>`;
    }
    
    if (explanation.codeFlow) {
      html += `<h2>Code Flow</h2><p>${this.escapeHtml(explanation.codeFlow)}</p>`;
    }
    
    if (explanation.keyChanges.length > 0) {
      html += `<h2>Key Changes</h2><ul>`;
      explanation.keyChanges.forEach(change => {
        html += `<li>${this.escapeHtml(change)}</li>`;
      });
      html += `</ul>`;
    }
    
    if (explanation.recommendations.length > 0) {
      html += `<h2>Recommendations</h2><ul>`;
      explanation.recommendations.forEach(rec => {
        html += `<li>${this.escapeHtml(rec)}</li>`;
      });
      html += `</ul>`;
    }
    
    html += `</div>`;
    return html;
  }

  private static escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}
