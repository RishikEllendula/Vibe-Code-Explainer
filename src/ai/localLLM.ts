import { Logger } from '../utils/logger';

export class LocalLLM {
  private endpoint: string;
  private model: string;

  constructor(endpoint: string = 'http://localhost:11434', model: string = 'codellama') {
    this.endpoint = endpoint;
    this.model = model;
  }

  async generate(prompt: string): Promise<string> {
    try {
      // This is a placeholder for Ollama integration
      // Ollama is a popular local LLM runner
      const response = await fetch(`${this.endpoint}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as { response?: string };
      return data.response || '';
    } catch (error) {
      Logger.error('Local LLM error:', error);
      throw new Error('Failed to generate with local LLM');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`);
      if (!response.ok) {
        return [];
      }

      const data = await response.json() as { models?: Array<{ name: string }> };
      return data.models?.map((m: any) => m.name) || [];
    } catch (error) {
      Logger.error('Error listing models:', error);
      return [];
    }
  }

  setModel(model: string): void {
    this.model = model;
  }

  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }
}

// Alternative: Integration with LM Studio
export class LMStudio {
  private endpoint: string;

  constructor(endpoint: string = 'http://localhost:1234') {
    this.endpoint = endpoint;
  }

  async generate(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.endpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as { choices: Array<{ message: { content?: string } }> };
      return data.choices[0].message.content || '';
    } catch (error) {
      Logger.error('LM Studio error:', error);
      throw new Error('Failed to generate with LM Studio');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpoint}/v1/models`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
