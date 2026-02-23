import * as vscode from 'vscode';
import { Change } from '../models/Change';
import { Explanation } from '../models/Explanation';
import { LLMClient } from '../ai/llmClient';
import { Logger } from '../utils/logger';

export class Explainer {
  private llmClient: LLMClient;

  constructor(context: vscode.ExtensionContext) {
    this.llmClient = new LLMClient(context);
  }

  async explain(change: Change): Promise<Explanation> {
    try {
      Logger.info(`Generating explanation for change in ${change.fileName}`);

      const config = vscode.workspace.getConfiguration('vibeCodeExplainer');
      const detailLevel = config.get<string>('explanationDetail', 'detailed');

      const prompt = this.buildPrompt(change, detailLevel);
      const response = await this.llmClient.generateExplanation(prompt);

      const explanation: Explanation = {
        id: `exp-${change.id}`,
        changeId: change.id,
        summary: this.extractSummary(response),
        detailedExplanation: response,
        codeFlow: this.extractCodeFlow(response),
        keyChanges: this.extractKeyChanges(response),
        recommendations: this.extractRecommendations(response),
        timestamp: new Date(),
      };

      return explanation;
    } catch (error) {
      Logger.error('Error generating explanation:', error);
      throw error;
    }
  }

  async explainMultiple(changes: Change[]): Promise<Explanation[]> {
    const explanations: Explanation[] = [];

    for (const change of changes) {
      try {
        const explanation = await this.explain(change);
        explanations.push(explanation);
      } catch (error) {
        Logger.error(`Failed to explain change ${change.id}:`, error);
      }
    }

    return explanations;
  }

  async answerQuestion(change: Change, question: string): Promise<string> {
    try {
      const prompt = this.buildQuestionPrompt(change, question);
      const response = await this.llmClient.generateExplanation(prompt);
      return response;
    } catch (error) {
      Logger.error('Error answering question:', error);
      throw error;
    }
  }

  private buildPrompt(change: Change, detailLevel: string): string {
    const detailInstruction = this.getDetailInstruction(detailLevel);

    return `You are a code explanation expert. Explain the following code change to a developer.

File: ${change.fileName}
Language: ${change.language}
Change Type: ${change.changeType}

OLD CODE:
\`\`\`${change.language}
${change.oldContent}
\`\`\`

NEW CODE:
\`\`\`${change.language}
${change.newContent}
\`\`\`

${detailInstruction}

Please provide:
1. A brief summary (1-2 sentences)
2. Detailed explanation of what changed and why it matters
3. How the code flow is affected
4. Key changes and their implications
5. Recommendations or best practices

Format your response clearly with sections.`;
  }

  private buildQuestionPrompt(change: Change, question: string): string {
    return `You are a code explanation expert. Answer the following question about this code change:

File: ${change.fileName}
Language: ${change.language}

OLD CODE:
\`\`\`${change.language}
${change.oldContent}
\`\`\`

NEW CODE:
\`\`\`${change.language}
${change.newContent}
\`\`\`

Question: ${question}

Provide a clear, concise answer focused on this specific question.`;
  }

  private getDetailInstruction(detailLevel: string): string {
    switch (detailLevel) {
      case 'brief':
        return 'Keep the explanation concise and focus on the main points only.';
      case 'expert':
        return 'Provide an in-depth technical analysis including performance implications, design patterns, and advanced concepts.';
      case 'detailed':
      default:
        return 'Provide a comprehensive explanation suitable for developers with intermediate knowledge.';
    }
  }

  private extractSummary(response: string): string {
    const summaryMatch = response.match(/(?:summary|brief)[\s:]+(.+?)(?:\n\n|\n#)/is);
    if (summaryMatch) {
      return summaryMatch[1].trim();
    }
    return response.split('\n\n')[0].substring(0, 200);
  }

  private extractCodeFlow(response: string): string {
    const flowMatch = response.match(/(?:code flow|flow)[\s:]+(.+?)(?:\n\n|\n#)/is);
    if (flowMatch) {
      return flowMatch[1].trim();
    }
    return '';
  }

  private extractKeyChanges(response: string): string[] {
    const changesMatch = response.match(/(?:key changes|changes)[\s:]+(.+?)(?:\n\n|\n#)/is);
    if (changesMatch) {
      const text = changesMatch[1];
      const lines = text.split('\n').filter((line) => line.trim().startsWith('-'));
      return lines.map((line) => line.replace(/^-\s*/, '').trim());
    }
    return [];
  }

  private extractRecommendations(response: string): string[] {
    const recsMatch = response.match(/(?:recommendations|best practices)[\s:]+(.+?)(?:\n\n|\n#|$)/is);
    if (recsMatch) {
      const text = recsMatch[1];
      const lines = text.split('\n').filter((line) => line.trim().startsWith('-'));
      return lines.map((line) => line.replace(/^-\s*/, '').trim());
    }
    return [];
  }
}
