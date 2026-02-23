# Vibe Code Explainer - Project Overview

## 🎯 Project Purpose

Vibe Code Explainer is a VS Code extension designed to help developers understand AI-generated code changes. It bridges the gap between using AI coding tools and truly understanding what the AI has done to your code.

## 📁 Project Structure

```
vibe-code-explainer/
├── src/                          # Extension source code
│   ├── extension.ts              # Main entry point
│   ├── core/                     # Core business logic
│   │   ├── diffDetector.ts       # Detects code changes
│   │   ├── changeAnalyzer.ts     # Analyzes changes
│   │   ├── explainer.ts          # Generates explanations
│   │   └── patternMatcher.ts     # Identifies patterns
│   ├── ai/                       # AI integrations
│   │   ├── llmClient.ts          # Unified LLM interface
│   │   ├── promptTemplates.ts    # Prompt templates
│   │   ├── openaiClient.ts       # OpenAI integration
│   │   └── localLLM.ts           # Local LLM support
│   ├── ui/                       # User interface
│   │   ├── webview/              # React webview
│   │   ├── views/                # Tree views
│   │   └── notifications/        # Notifications
│   ├── models/                   # Data models
│   │   ├── Change.ts             # Change model
│   │   ├── Explanation.ts        # Explanation model
│   │   ├── Session.ts            # Session model
│   │   └── LearningProgress.ts   # Learning model
│   ├── services/                 # Application services
│   │   ├── storageService.ts     # Data persistence
│   │   ├── learningService.ts    # Learning tracking
│   │   └── sessionService.ts     # Session management
│   ├── integrations/             # Tool integrations
│   │   ├── cursor/               # Cursor adapter
│   │   ├── windsurf/             # Windsurf adapter
│   │   └── copilot/              # Copilot adapter
│   ├── utils/                    # Utility functions
│   ├── config/                   # Configuration
│   └── commands/                 # Command handlers
│
├── webview-ui/                   # React application
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── hooks/                # Custom hooks
│   │   ├── utils/                # UI utilities
│   │   └── styles/               # CSS styles
│   └── public/                   # Static assets
│
├── test/                         # Test files
│   └── suite/                    # Test suites
│
├── docs/                         # Documentation
│   ├── architecture.md           # Architecture docs
│   ├── api.md                    # API documentation
│   ├── user-guide.md             # User guide
│   └── contributing.md           # Contributing guide
│
├── resources/                    # Extension resources
│   ├── icons/                    # Icons
│   └── templates/                # Templates
│
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript config
├── README.md                     # Main readme
├── CHANGELOG.md                  # Version history
├── LICENSE                       # MIT license
└── setup.sh                      # Setup script
```

## 🚀 Getting Started

### Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Run setup script
./setup.sh

# Or manually:
npm install
cd webview-ui && npm install && cd ..
npm run compile
npm run build:webview

# Open in VS Code and press F5
```

### Development Workflow

1. **Make changes** to TypeScript files in `src/`
2. **Run in watch mode**: `npm run watch`
3. **Test changes**: Press F5 to launch Extension Development Host
4. **Build webview**: `npm run build:webview` (if UI changes)
5. **Run tests**: `npm test`

## 🏗️ Architecture

### Core Components

1. **DiffDetector**: Monitors file changes and calculates diffs
2. **ChangeAnalyzer**: Analyzes complexity and impact
3. **Explainer**: Generates AI-powered explanations
4. **LLMClient**: Interfaces with AI providers

### Data Flow

```
User Change → DiffDetector → ChangeAnalyzer → Explainer → UI Display
                                    ↓
                              LearningService (tracks concepts)
                                    ↓
                              StorageService (persists data)
```

## 🎨 Key Features

### 1. Automatic Change Detection
- Monitors workspace for code changes
- Calculates precise diffs
- Identifies change types (addition/deletion/modification)

### 2. AI-Powered Explanations
- Connects to multiple AI providers
- Generates contextual explanations
- Adapts detail level to user preference

### 3. Learning Path Tracking
- Identifies programming concepts
- Tracks mastery levels
- Maintains learning streaks
- Awards milestones

### 4. Session Management
- Records all changes in a session
- Provides session summaries
- Tracks productivity metrics

### 5. Visual Diff Viewer
- Side-by-side code comparison
- Syntax highlighting
- Impact indicators

## 🔧 Configuration

### Required Settings

```json
{
  "vibeCodeExplainer.aiProvider": "openai",
  "vibeCodeExplainer.apiKey": "your-api-key"
}
```

### Optional Settings

```json
{
  "vibeCodeExplainer.autoExplain": true,
  "vibeCodeExplainer.explanationDetail": "detailed",
  "vibeCodeExplainer.showNotifications": true
}
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Test Structure
- `test/suite/`: Integration tests
- `*.test.ts`: Unit tests alongside source

### Writing Tests
```typescript
import * as assert from 'assert';

suite('Feature Test Suite', () => {
  test('Should work correctly', () => {
    assert.strictEqual(result, expected);
  });
});
```

## 📦 Building & Packaging

### Development Build
```bash
npm run compile
npm run build:webview
```

### Production Package
```bash
npm run vscode:prepublish
vsce package
```

This creates a `.vsix` file that can be installed in VS Code.

## 🔌 Extending the Extension

### Adding a New AI Provider

1. Create provider class in `src/ai/`
2. Implement the LLMClient interface
3. Add configuration in `package.json`
4. Update settings schema

### Adding a New Integration

1. Create adapter in `src/integrations/`
2. Implement BaseAdapter interface
3. Add detection logic
4. Register in extension.ts

### Adding UI Components

1. Create React component in `webview-ui/src/components/`
2. Add TypeScript types
3. Import and use in App.tsx

## 🐛 Debugging

### Extension Debugging
- Press F5 in VS Code
- Opens Extension Development Host
- View logs in Debug Console

### Webview Debugging
- Right-click webview → Inspect Element
- Opens Chrome DevTools
- View console logs and network requests

## 📊 Performance Considerations

- Debounced change detection (300ms)
- Cached explanations
- Lazy loading of AI responses
- Efficient diff algorithms
- Background processing

## 🔒 Security & Privacy

- API keys stored in VS Code Secrets
- No data sent without user consent
- Local LLM option available
- Telemetry can be disabled
- Open source code (MIT license)

## 🤝 Contributing

See [docs/contributing.md](docs/contributing.md) for detailed guidelines.

Quick contribution steps:
1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📚 Documentation

- **Architecture**: `docs/architecture.md`
- **API Reference**: `docs/api.md`
- **User Guide**: `docs/user-guide.md`
- **Contributing**: `docs/contributing.md`

## 🗺️ Roadmap

### Version 0.2.0 (Planned)
- Enhanced visualization with flow diagrams
- Team collaboration features
- More AI provider integrations
- Performance optimizations

### Version 0.3.0 (Future)
- Mobile companion app
- Browser extension version
- Cloud sync for learning data
- Advanced analytics dashboard

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: `docs/` folder
- **Email**: support@example.com

## 🙏 Acknowledgments

- VS Code Extension API
- OpenAI and Anthropic APIs
- React and TypeScript communities
- All contributors

---

**Built with ❤️ for developers who want to learn while using AI coding tools**
