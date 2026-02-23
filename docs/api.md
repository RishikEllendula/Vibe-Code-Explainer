# Vibe Code Explainer - API Documentation

## Extension API

The Vibe Code Explainer provides an API for other extensions to integrate with.

## Core Interfaces

### Change Interface

```typescript
interface Change {
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
```

### Explanation Interface

```typescript
interface Explanation {
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
```

### ChangeAnalysis Interface

```typescript
interface ChangeAnalysis {
  complexity: 'simple' | 'medium' | 'complex';
  impact: 'low' | 'medium' | 'high';
  affectedConcepts: string[];
  potentialIssues: string[];
  suggestedTests: string[];
  changeCategory: string;
}
```

## Services

### ExplainerService

Generate explanations for code changes.

```typescript
import { Explainer } from 'vibe-code-explainer';

const explainer = new Explainer(context);

// Explain a single change
const explanation = await explainer.explain(change);

// Explain multiple changes
const explanations = await explainer.explainMultiple(changes);

// Ask a question about a change
const answer = await explainer.answerQuestion(change, "Why was this changed?");
```

### LearningService

Track user learning progress.

```typescript
import { LearningService } from 'vibe-code-explainer';

const learningService = new LearningService(storageService);

// Add a concept
await learningService.addConcept('Async Programming', ['Promises', 'Callbacks']);

// Get progress
const progress = learningService.getProgress();

// Update streak
await learningService.updateStreak();
```

### SessionService

Manage coding sessions.

```typescript
import { SessionService } from 'vibe-code-explainer';

const sessionService = new SessionService(storageService);

// Start session
sessionService.startSession();

// Record changes
sessionService.recordChanges(changes, analysis);

// End session
sessionService.endSession();

// Get current session
const session = sessionService.getCurrentSession();
```

## Events

### Change Detected Event

Listen for code changes:

```typescript
import * as vscode from 'vscode';

vscode.workspace.onDidChangeTextDocument((event) => {
  // Handle change
});
```

### Explanation Generated Event

Subscribe to explanation events:

```typescript
const disposable = explainer.onExplanationGenerated((explanation) => {
  // Handle explanation
});
```

## Commands

Execute extension commands programmatically:

### Explain Change
```typescript
vscode.commands.executeCommand('vibeCodeExplainer.explainChange');
```

### Show Diff
```typescript
vscode.commands.executeCommand('vibeCodeExplainer.showDiff');
```

### Generate Summary
```typescript
vscode.commands.executeCommand('vibeCodeExplainer.generateSummary');
```

### Open Learning Path
```typescript
vscode.commands.executeCommand('vibeCodeExplainer.openLearningPath');
```

## Configuration

Access extension configuration:

```typescript
import * as vscode from 'vscode';

const config = vscode.workspace.getConfiguration('vibeCodeExplainer');

// Get values
const autoExplain = config.get<boolean>('autoExplain');
const detailLevel = config.get<string>('explanationDetail');
const provider = config.get<string>('aiProvider');

// Update values
await config.update('autoExplain', true, true);
```

## Storage API

Store and retrieve data:

```typescript
import { StorageService } from 'vibe-code-explainer';

const storage = new StorageService(context);

// Global storage
await storage.setGlobal('key', value);
const value = storage.getGlobal('key');

// Workspace storage
await storage.setWorkspace('key', value);
const value = storage.getWorkspace('key');

// Secrets
await storage.setSecret('apiKey', key);
const key = await storage.getSecret('apiKey');
```

## Custom Integrations

### Creating a Custom Adapter

Integrate with a new AI coding tool:

```typescript
import { BaseAdapter } from 'vibe-code-explainer';

export class MyToolAdapter implements BaseAdapter {
  name = 'MyTool';

  isAvailable(): boolean {
    // Check if tool is available
    return true;
  }

  async detectChanges(): Promise<Change[]> {
    // Detect changes from your tool
    return changes;
  }
}
```

### Registering Custom Adapter

```typescript
import { IntegrationManager } from 'vibe-code-explainer';

const manager = new IntegrationManager();
manager.registerAdapter(new MyToolAdapter());
```

## Custom AI Provider

Add support for a new AI provider:

```typescript
import { LLMClient } from 'vibe-code-explainer';

export class MyAIProvider {
  async generateExplanation(prompt: string): Promise<string> {
    // Call your AI API
    return explanation;
  }
}
```

## Webview API

Communicate with the webview:

```typescript
// Send message to webview
panel.webview.postMessage({
  command: 'showExplanation',
  explanation: explanation
});

// Receive message from webview
panel.webview.onDidReceiveMessage(
  message => {
    switch (message.command) {
      case 'requestExplanation':
        // Handle request
        break;
    }
  }
);
```

## Testing

### Unit Testing

```typescript
import * as assert from 'assert';
import { ChangeAnalyzer } from 'vibe-code-explainer';

suite('ChangeAnalyzer Tests', () => {
  test('Should analyze simple change', async () => {
    const analyzer = new ChangeAnalyzer();
    const analysis = await analyzer.analyze(changes);
    assert.strictEqual(analysis.complexity, 'simple');
  });
});
```

### Integration Testing

```typescript
import * as vscode from 'vscode';

suite('Extension Integration Tests', () => {
  test('Should activate extension', async () => {
    const ext = vscode.extensions.getExtension('publisher.vibe-code-explainer');
    await ext?.activate();
    assert.ok(ext?.isActive);
  });
});
```

## Error Handling

Handle errors gracefully:

```typescript
try {
  const explanation = await explainer.explain(change);
} catch (error) {
  if (error instanceof APIKeyError) {
    // Handle API key error
  } else if (error instanceof NetworkError) {
    // Handle network error
  } else {
    // Handle other errors
  }
}
```

## Rate Limiting

Respect API rate limits:

```typescript
import { RateLimiter } from 'vibe-code-explainer';

const limiter = new RateLimiter({
  maxRequests: 10,
  perMinutes: 1
});

await limiter.execute(async () => {
  return await explainer.explain(change);
});
```

## Caching

Cache explanations for performance:

```typescript
import { ExplanationCache } from 'vibe-code-explainer';

const cache = new ExplanationCache();

// Check cache
const cached = cache.get(change.id);
if (cached) {
  return cached;
}

// Generate and cache
const explanation = await explainer.explain(change);
cache.set(change.id, explanation);
```

## Utilities

### Code Parser

```typescript
import { CodeParser } from 'vibe-code-explainer';

const parser = new CodeParser();
const parsed = parser.parse(code, 'typescript');

console.log(parsed.functions);
console.log(parsed.classes);
console.log(parsed.imports);
```

### Diff Utils

```typescript
import { DiffUtils } from 'vibe-code-explainer';

const diff = DiffUtils.formatDiff(oldCode, newCode);
const similarity = DiffUtils.calculateSimilarity(str1, str2);
```

### Formatters

```typescript
import { Formatters } from 'vibe-code-explainer';

const timestamp = Formatters.formatTimestamp(date);
const duration = Formatters.formatDuration(milliseconds);
const truncated = Formatters.truncateString(str, maxLength);
```

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch
2. **Rate Limiting**: Respect API limits
3. **Caching**: Cache results when possible
4. **Performance**: Use debouncing for frequent changes
5. **Privacy**: Respect user privacy settings
6. **Testing**: Write tests for custom integrations

## Migration Guide

### From v0.0.x to v0.1.0

```typescript
// Old API
explainer.explain(change, 'detailed');

// New API
const config = { detailLevel: 'detailed' };
explainer.explain(change);
```

## Support

For API questions and issues:
- GitHub Issues
- API Documentation: docs/api.md
- Examples: examples/

---

**Version**: 0.1.0  
**Last Updated**: February 2024
