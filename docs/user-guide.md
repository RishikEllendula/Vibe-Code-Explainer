# Vibe Code Explainer - User Guide

## Table of Contents
1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Features](#features)
4. [Configuration](#configuration)
5. [Commands](#commands)
6. [Tips & Tricks](#tips--tricks)
7. [Troubleshooting](#troubleshooting)

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Vibe Code Explainer"
4. Click Install

### From Source
```bash
git clone https://github.com/your-username/vibe-code-explainer.git
cd vibe-code-explainer
npm install
npm run compile
```

## Getting Started

### 1. Configure AI Provider

Before using the extension, you need to configure an AI provider:

1. Open VS Code Settings (Ctrl+, / Cmd+,)
2. Search for "Vibe Code Explainer"
3. Set `aiProvider` to your preferred provider
4. Add your API key in `apiKey` setting

**Supported Providers:**
- OpenAI (GPT-4)
- Anthropic (Claude)
- Local LLM (Ollama, LM Studio)

### 2. Start Coding

Once configured, the extension automatically:
- Detects code changes
- Analyzes modifications
- Generates explanations
- Tracks your learning progress

## Features

### Automatic Change Detection

The extension monitors your code for changes made by:
- AI coding assistants (Cursor, Windsurf, Copilot)
- Manual edits
- Refactoring operations

### Intelligent Explanations

For each change, you get:
- **Summary**: Quick overview of what changed
- **Detailed Explanation**: In-depth analysis
- **Code Flow**: How execution changes
- **Key Concepts**: Programming concepts used
- **Recommendations**: Best practices and suggestions

### Diff Visualization

View changes side-by-side with:
- Syntax highlighting
- Line-by-line comparison
- Impact indicators

### Learning Path

Track your progress with:
- Concepts encountered
- Mastery levels (Beginner/Intermediate/Advanced)
- Milestones and achievements
- Daily streak tracking

### Session Management

Review your coding sessions:
- Changes made
- Files modified
- Complexity distribution
- Time spent
- Session summaries

## Configuration

### Basic Settings

```json
{
  "vibeCodeExplainer.autoExplain": true,
  "vibeCodeExplainer.explanationDetail": "detailed",
  "vibeCodeExplainer.showNotifications": true,
  "vibeCodeExplainer.aiProvider": "openai",
  "vibeCodeExplainer.apiKey": "your-api-key-here"
}
```

### Explanation Detail Levels

**Brief**: Concise explanations, main points only
```json
"vibeCodeExplainer.explanationDetail": "brief"
```

**Detailed**: Comprehensive explanations (default)
```json
"vibeCodeExplainer.explanationDetail": "detailed"
```

**Expert**: In-depth technical analysis
```json
"vibeCodeExplainer.explanationDetail": "expert"
```

### AI Providers

#### OpenAI
```json
{
  "vibeCodeExplainer.aiProvider": "openai",
  "vibeCodeExplainer.apiKey": "sk-..."
}
```

#### Anthropic
```json
{
  "vibeCodeExplainer.aiProvider": "anthropic",
  "vibeCodeExplainer.apiKey": "sk-ant-..."
}
```

#### Local LLM
```json
{
  "vibeCodeExplainer.aiProvider": "local"
}
```
Requires Ollama or LM Studio running locally.

## Commands

Access commands via Command Palette (Ctrl+Shift+P / Cmd+Shift+P):

### Explain This Change
`Vibe Explainer: Explain This Change`
- Explains the current code change
- Shows detailed breakdown
- Identifies affected concepts

### Show Diff Visualization
`Vibe Explainer: Show Diff Visualization`
- Opens side-by-side diff view
- Highlights changes
- Shows impact analysis

### Generate Session Summary
`Vibe Explainer: Generate Session Summary`
- Creates summary of current session
- Lists all changes
- Shows statistics
- Provides insights

### Open Learning Path
`Vibe Explainer: Open Learning Path`
- Shows concepts learned
- Displays progress
- Suggests next steps

### Open Explainer Panel
`Vibe Explainer: Open Explainer Panel`
- Opens main webview panel
- Shows rich visualizations
- Interactive Q&A interface

## Sidebar Views

### Recent Changes
Shows list of detected changes:
- File name
- Line numbers
- Change type
- Timestamp

Click on a change to view details.

### Learning Path
Displays your learning progress:
- Total concepts
- Current streak
- Milestones achieved
- Recommended topics

### Session Summary
Shows current session stats:
- Changes count
- Files modified
- Session duration
- Complexity breakdown

## Tips & Tricks

### 1. Ask Follow-up Questions
After receiving an explanation, you can ask:
- "Why was this approach chosen?"
- "What are the alternatives?"
- "How does this affect performance?"

### 2. Customize Detail Level
Switch between detail levels based on your needs:
- Use "brief" for quick reviews
- Use "detailed" for learning
- Use "expert" for deep dives

### 3. Review Session Summaries
At the end of each day, generate a session summary to:
- Reflect on what you learned
- Identify patterns
- Track progress

### 4. Track Your Streak
Maintain a daily streak by:
- Coding regularly
- Reviewing explanations
- Learning new concepts

### 5. Export Your Progress
Save your learning data for:
- Portfolio documentation
- Team sharing
- Personal records

## Troubleshooting

### No Explanations Generated

**Problem**: Changes detected but no explanations appear

**Solutions**:
1. Check API key is configured
2. Verify AI provider is accessible
3. Check internet connection (for cloud providers)
4. Check VS Code output panel for errors

### API Key Errors

**Problem**: Authentication failed

**Solutions**:
1. Verify API key is correct
2. Check API key permissions
3. Ensure account has sufficient credits

### Local LLM Not Working

**Problem**: Local provider not responding

**Solutions**:
1. Verify Ollama/LM Studio is running
2. Check the endpoint URL
3. Ensure model is downloaded
4. Check firewall settings

### Changes Not Detected

**Problem**: Code changes not being tracked

**Solutions**:
1. Check `autoExplain` setting is enabled
2. Verify file type is supported
3. Restart VS Code
4. Check extension is activated

### Performance Issues

**Problem**: Extension running slowly

**Solutions**:
1. Reduce explanation detail level
2. Disable auto-explain for large files
3. Clear extension cache
4. Check system resources

## Getting Help

- **Documentation**: Check the docs folder
- **Issues**: Report on GitHub
- **Discussions**: Join the community
- **Email**: support@example.com

## Keyboard Shortcuts

Create custom shortcuts in VS Code:
```json
{
  "key": "ctrl+shift+e",
  "command": "vibeCodeExplainer.explainChange"
}
```

## Privacy

- Code is only sent to AI provider when explanations are requested
- API keys stored securely using VS Code Secrets API
- Telemetry can be disabled
- Local LLM option for complete privacy

## Updates

The extension automatically updates through VS Code. To check for updates:
1. Open Extensions
2. Find Vibe Code Explainer
3. Click Update if available

---

**Need more help?** Check our [GitHub repository](https://github.com/your-username/vibe-code-explainer) or open an issue.
