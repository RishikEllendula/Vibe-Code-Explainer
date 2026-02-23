# Vibe Code Explainer - Architecture

## Overview

The Vibe Code Explainer is built as a VS Code extension with a modular, scalable architecture designed to integrate with various AI coding tools and provide intelligent code explanations.

## Architecture Layers

### 1. Core Layer (`src/core/`)

The core layer contains the fundamental business logic:

- **DiffDetector**: Monitors file changes and calculates diffs
- **ChangeAnalyzer**: Analyzes complexity, impact, and patterns in code changes
- **Explainer**: Generates AI-powered explanations
- **PatternMatcher**: Identifies programming patterns and concepts

### 2. AI Layer (`src/ai/`)

Handles all AI provider integrations:

- **LLMClient**: Unified interface for different AI providers
- **PromptTemplates**: Structured templates for generating explanations
- **OpenAIClient**: OpenAI API integration
- **LocalLLM**: Support for local LLM runners (Ollama, LM Studio)

### 3. UI Layer (`src/ui/`)

Manages all user interface components:

- **Webview**: React-based rich UI for explanations and visualizations
- **Views**: VS Code tree views for sidebar (changes, learning, sessions)
- **Notifications**: Toast notifications and tooltips

### 4. Services Layer (`src/services/`)

Application services for data and state management:

- **StorageService**: Persistent storage using VS Code APIs
- **LearningService**: Tracks user progress and concepts learned
- **SessionService**: Manages coding sessions
- **TelemetryService**: Usage analytics (privacy-respecting)

### 5. Models Layer (`src/models/`)

Data models and business entities:

- **Change**: Represents a code change
- **Explanation**: Explanation data structure
- **Session**: Coding session with changes
- **LearningProgress**: User learning data

### 6. Integration Layer (`src/integrations/`)

Adapters for different AI coding tools:

- **BaseAdapter**: Common interface for all integrations
- **CursorAdapter**: Cursor IDE integration
- **WindsurfAdapter**: Windsurf integration
- **CopilotAdapter**: GitHub Copilot integration

## Data Flow

```
User makes code change
    ↓
DiffDetector captures change
    ↓
ChangeAnalyzer processes change
    ↓
PatternMatcher identifies concepts
    ↓
Explainer generates explanation (via LLMClient)
    ↓
UI displays results
    ↓
Services persist data
    ↓
LearningService updates progress
```

## Key Design Patterns

### 1. Adapter Pattern
Used for integrating different AI coding tools through a common interface.

### 2. Service Pattern
Separation of business logic into reusable services.

### 3. Observer Pattern
Event-based architecture for file change detection.

### 4. Strategy Pattern
Different AI providers can be swapped at runtime.

## Extension Points

The architecture supports extending functionality through:

1. **New AI Providers**: Implement the LLM client interface
2. **Custom Integrations**: Add new adapter implementations
3. **Visualization Components**: Add React components to webview
4. **Analysis Algorithms**: Extend ChangeAnalyzer with new metrics

## Technology Stack

- **Extension**: TypeScript, VS Code Extension API
- **UI**: React, TypeScript, Vite
- **AI Integration**: OpenAI SDK, Anthropic SDK, Fetch API
- **Storage**: VS Code Global State, Workspace State, Secrets API
- **Testing**: Mocha, VS Code Test Framework

## Security Considerations

- API keys stored securely using VS Code Secrets API
- No code sent to external services without user consent
- Optional local LLM support for privacy
- Telemetry can be disabled completely

## Performance Optimizations

- Debounced change detection
- Lazy loading of AI explanations
- Cached explanations for repeated queries
- Efficient diff algorithms
- Background processing for heavy operations

## Future Architecture Enhancements

1. Plugin system for community extensions
2. Language Server Protocol integration
3. Cloud sync for learning progress
4. Team collaboration features
5. Real-time collaborative learning
