#!/bin/bash

# Create remaining utility files
cat > src/utils/diffUtils.ts << 'EOF'
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
EOF

cat > src/utils/formatters.ts << 'EOF'
export class Formatters {
  static formatTimestamp(date: Date): string {
    return date.toLocaleString();
  }

  static formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  static truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }

  static formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
EOF

cat > src/utils/validators.ts << 'EOF'
export class Validators {
  static isValidApiKey(key: string): boolean {
    return key.length > 0 && key.trim() !== '';
  }

  static isValidFilePath(path: string): boolean {
    return path.length > 0 && !path.includes('..');
  }

  static isValidLanguage(language: string): boolean {
    const supported = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust'];
    return supported.includes(language.toLowerCase());
  }
}
EOF

echo "Utils created successfully!"

# Create service files
cat > src/services/learningService.ts << 'EOF'
import { StorageService } from './storageService';
import { LearningProgress, LearningProgressModel } from '../models/LearningProgress';

export class LearningService {
  private storage: StorageService;
  private progress: LearningProgress | null = null;

  constructor(storage: StorageService) {
    this.storage = storage;
    this.loadProgress();
  }

  private loadProgress(): void {
    const data = this.storage.getGlobal<string>('learningProgress');
    if (data) {
      this.progress = LearningProgressModel.deserialize(data);
    } else {
      this.progress = LearningProgressModel.create();
    }
  }

  async saveProgress(): Promise<void> {
    if (this.progress) {
      const serialized = LearningProgressModel.serialize(this.progress);
      await this.storage.setGlobal('learningProgress', serialized);
    }
  }

  getProgress(): LearningProgress | null {
    return this.progress;
  }

  async addConcept(concept: string, related: string[] = []): Promise<void> {
    if (this.progress) {
      this.progress = LearningProgressModel.addConcept(this.progress, concept, related);
      await this.saveProgress();
    }
  }

  async updateStreak(): Promise<void> {
    if (this.progress) {
      this.progress = LearningProgressModel.updateStreak(this.progress);
      await this.saveProgress();
    }
  }
}
EOF

cat > src/services/sessionService.ts << 'EOF'
import { StorageService } from './storageService';
import { Session, SessionModel } from '../models/Session';
import { Change } from '../models/Change';
import { ChangeAnalysis } from '../core/changeAnalyzer';

export class SessionService {
  private storage: StorageService;
  private currentSession: Session | null = null;

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  startSession(): void {
    this.currentSession = SessionModel.create();
  }

  endSession(): void {
    if (this.currentSession) {
      this.currentSession = SessionModel.endSession(this.currentSession);
      this.saveSession();
      this.currentSession = null;
    }
  }

  recordChanges(changes: Change[], analysis: ChangeAnalysis): void {
    if (!this.currentSession) {
      this.startSession();
    }
    
    changes.forEach(change => {
      if (this.currentSession) {
        this.currentSession = SessionModel.addChange(this.currentSession, change, analysis);
      }
    });
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  private async saveSession(): Promise<void> {
    if (this.currentSession) {
      const sessions = this.storage.getGlobal<string[]>('sessions', []);
      sessions.push(SessionModel.serialize(this.currentSession));
      await this.storage.setGlobal('sessions', sessions);
    }
  }
}
EOF

cat > src/services/telemetryService.ts << 'EOF'
export class TelemetryService {
  private enabled: boolean = false;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;
    // Placeholder for telemetry implementation
    console.log('Event:', eventName, properties);
  }

  trackError(error: Error, context?: string): void {
    if (!this.enabled) return;
    console.error('Error:', context, error);
  }
}
EOF

echo "Services created successfully!"

# Create command files
cat > src/commands/explainChange.ts << 'EOF'
import { Explainer } from '../core/explainer';
import { ChangeNotifier } from '../ui/notifications/changeNotifier';

export function explainChange(explainer: Explainer, notifier: ChangeNotifier) {
  return async () => {
    // Command implementation
    console.log('Explain change command executed');
  };
}
EOF

cat > src/commands/showDiff.ts << 'EOF'
import { DiffDetector } from '../core/diffDetector';

export function showDiff(detector: DiffDetector) {
  return async () => {
    console.log('Show diff command executed');
  };
}
EOF

cat > src/commands/generateSummary.ts << 'EOF'
import { SessionService } from '../services/sessionService';

export function generateSummary(sessionService: SessionService) {
  return async () => {
    console.log('Generate summary command executed');
  };
}
EOF

cat > src/commands/openLearningPath.ts << 'EOF'
import { LearningService } from '../services/learningService';

export function openLearningPath(learningService: LearningService) {
  return async () => {
    console.log('Open learning path command executed');
  };
}
EOF

cat > src/commands/index.ts << 'EOF'
export * from './explainChange';
export * from './showDiff';
export * from './generateSummary';
export * from './openLearningPath';
EOF

echo "Commands created successfully!"

# Create config files
cat > src/config/constants.ts << 'EOF'
export const EXTENSION_NAME = 'Vibe Code Explainer';
export const EXTENSION_ID = 'vibeCodeExplainer';

export const DEFAULT_AI_PROVIDER = 'openai';
export const DEFAULT_DETAIL_LEVEL = 'detailed';

export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
];

export const MAX_EXPLANATION_LENGTH = 5000;
export const MAX_CHANGES_PER_SESSION = 1000;
EOF

cat > src/config/settings.ts << 'EOF'
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
EOF

cat > src/config/languages.ts << 'EOF'
export const languageConfigs = {
  javascript: {
    extensions: ['.js', '.jsx'],
    commentStyle: '//',
    supportsAsync: true,
  },
  typescript: {
    extensions: ['.ts', '.tsx'],
    commentStyle: '//',
    supportsAsync: true,
  },
  python: {
    extensions: ['.py'],
    commentStyle: '#',
    supportsAsync: true,
  },
};
EOF

echo "Config files created successfully!"

echo "All remaining files created successfully!"
