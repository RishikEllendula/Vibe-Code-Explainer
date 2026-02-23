import * as vscode from 'vscode';
import { Logger } from '../utils/logger';

export class LLMClient {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async generateExplanation(prompt: string): Promise<string> {
    try {
      const config = vscode.workspace.getConfiguration('vibeCodeExplainer');
      const provider = config.get<string>('aiProvider', 'openai');

      switch (provider) {
        case 'openai':
          return await this.generateWithOpenAI(prompt);
        case 'anthropic':
          return await this.generateWithAnthropic(prompt);
        case 'local':
          return await this.generateWithLocalLLM(prompt);
        default:
          throw new Error(`Unknown AI provider: ${provider}`);
      }
    } catch (error) {
      Logger.error('Error generating explanation:', error);
      throw error;
    }
  }

  private async generateWithOpenAI(prompt: string): Promise<string> {
    const config = vscode.workspace.getConfiguration('vibeCodeExplainer');
    const apiKey = config.get<string>('apiKey', '');

    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // Using dynamic import to avoid bundling issues
      const { default: OpenAI } = await import('openai');
      
      const openai = new OpenAI({ apiKey });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful coding assistant that explains code changes clearly and concisely.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0].message.content || 'No explanation generated';
    } catch (error) {
      Logger.error('OpenAI API error:', error);
      throw new Error('Failed to generate explanation with OpenAI');
    }
  }

  private async generateWithAnthropic(prompt: string): Promise<string> {
    const config = vscode.workspace.getConfiguration('vibeCodeExplainer');
    const apiKey = config.get<string>('apiKey', '');

    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const axios = (await import('axios')).default;

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
        }
      );

      return response.data.content[0].text || 'No explanation generated';
    } catch (error) {
      Logger.error('Anthropic API error:', error);
      throw new Error('Failed to generate explanation with Anthropic');
    }
  }

  private async generateWithLocalLLM(prompt: string): Promise<string> {
    // Placeholder for local LLM integration
    // This could integrate with Ollama, LocalAI, or other local models
    Logger.warn('Local LLM not yet implemented, using fallback explanation');
    return this.generateFallbackExplanation(prompt);
  }

  private generateFallbackExplanation(prompt: string): string {
    // Simple rule-based fallback when AI is not available
    return `Code Change Detected

This is a fallback explanation. To get detailed AI-powered explanations:
1. Configure your AI provider in settings
2. Add your API key
3. Restart VS Code

Basic Analysis:
- Code has been modified
- Review the changes carefully
- Consider the impact on your application
- Test thoroughly before committing`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const testPrompt = 'Test connection';
      await this.generateExplanation(testPrompt);
      return true;
    } catch (error) {
      return false;
    }
  }
}
