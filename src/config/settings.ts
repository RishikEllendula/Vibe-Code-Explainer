export interface ExtensionSettings {
  autoExplain: boolean;
  explanationDetail: 'brief' | 'detailed' | 'expert';
  showNotifications: boolean;
  aiProvider: 'openai' | 'anthropic' | 'local';
  apiKey: string;
}

export const defaultSettings: ExtensionSettings = {
  autoExplain: true,
  explanationDetail: 'detailed',
  showNotifications: true,
  aiProvider: 'openai',
  apiKey: '',
};
