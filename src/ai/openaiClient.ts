import { Logger } from '../utils/logger';

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class OpenAIClient {
  private config: OpenAIConfig;
  private openai: any;

  constructor(config: OpenAIConfig) {
    this.config = {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1500,
      ...config,
    };
  }

  async initialize(): Promise<void> {
    try {
      const { default: OpenAI } = await import('openai');
      this.openai = new OpenAI({ apiKey: this.config.apiKey });
    } catch (error) {
      Logger.error('Failed to initialize OpenAI client:', error);
      throw new Error('OpenAI SDK not available');
    }
  }

  async generateCompletion(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.openai) {
      await this.initialize();
    }

    try {
      const messages: any[] = [];

      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      messages.push({
        role: 'user',
        content: prompt,
      });

      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      Logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  async streamCompletion(
    prompt: string,
    onChunk: (chunk: string) => void,
    systemPrompt?: string
  ): Promise<void> {
    if (!this.openai) {
      await this.initialize();
    }

    try {
      const messages: any[] = [];

      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      messages.push({
        role: 'user',
        content: prompt,
      });

      const stream = await this.openai.chat.completions.create({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          onChunk(content);
        }
      }
    } catch (error) {
      Logger.error('OpenAI streaming error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateCompletion('Test');
      return true;
    } catch (error) {
      return false;
    }
  }

  updateConfig(config: Partial<OpenAIConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
