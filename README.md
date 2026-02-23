# Vibe Code Explainer

An intelligent VS Code extension that helps developers understand AI-generated code changes through real-time explanations and visual diff views.

---

## ✨ Features

- **Real-time Change Detection** — Automatically detects code changes made by AI tools (Cursor, Copilot, Windsurf, etc.)
- **AI-Powered Explanations** — Understand *what* changed and *why* in plain English
- **Visual Diff Viewer** — Side-by-side comparison of old vs new code with animations
- **Learning Path** — Tracks programming concepts you encounter and your mastery progress
- **Session Summary** — Review all changes made in a single coding session
- **Multiple AI Providers** — Supports OpenAI (GPT-4), Anthropic (Claude), and local LLMs

---

## 🚀 Getting Started (Run Locally After Cloning)

### Prerequisites

Make sure you have the following installed before you begin:

| Tool | Version | Download |
|------|---------|----------|
| [Node.js](https://nodejs.org/) | v18 or higher | nodejs.org |
| [npm](https://www.npmjs.com/) | v9 or higher | comes with Node.js |
| [VS Code](https://code.visualstudio.com/) | v1.85 or higher | code.visualstudio.com |
| [Git](https://git-scm.com/) | any | git-scm.com |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/vibe-code-explainer.git
cd vibe-code-explainer
```

---

### Step 2 — Install Dependencies

Install dependencies for both the extension and the webview UI:

```bash
# Install extension dependencies
npm install

# Install webview UI dependencies
cd webview-ui
npm install
cd ..
```

---

### Step 3 — Build the Project

Compile the TypeScript extension code and build the React webview:

```bash
# Compile the extension (TypeScript → JavaScript)
npm run compile

# Build the React webview UI
npm run build:webview
```

---

### Step 4 — Run the Extension in VS Code

1. Open the project folder in VS Code:
   ```bash
   code .
   ```

2. Press **`F5`** (or go to **Run → Start Debugging**)

3. A new **Extension Development Host** window will open — this is VS Code running your extension

4. In that new window, open any code file and start editing — the extension will activate automatically

---

### Step 5 — Configure Your API Key

To get AI-powered explanations, you need an API key:

1. In the Extension Development Host window, open **Settings** (`Ctrl + ,`)
2. Search for `Vibe Code Explainer`
3. Set the following:

| Setting | Value |
|---|---|
| `vibeCodeExplainer.aiProvider` | `openai` or `anthropic` |
| `vibeCodeExplainer.apiKey` | Your OpenAI or Anthropic API key |
| `vibeCodeExplainer.autoExplain` | `true` (to explain changes automatically) |
| `vibeCodeExplainer.explanationDetail` | `brief` / `detailed` / `expert` |

> 💡 **Don't have an API key?** The extension still works — it shows a fallback explanation. Get an OpenAI key at [platform.openai.com](https://platform.openai.com) or an Anthropic key at [console.anthropic.com](https://console.anthropic.com).

---

### Step 6 — Use the Extension

Once running, you can use the Command Palette (`Ctrl + Shift + P`) and search for:

| Command | What it does |
|---|---|
| `Vibe Explainer: Explain This Change` | Explains the current code change |
| `Vibe Explainer: Show Diff Visualization` | Opens the side-by-side diff panel |
| `Vibe Explainer: Generate Session Summary` | Creates a summary of all changes this session |
| `Vibe Explainer: Open Learning Path` | Shows your concept mastery progress |

The **Vibe Explainer** icon also appears in the VS Code Activity Bar (left sidebar) with three panels: Recent Changes, Learning Path, and Session Summary.

---

## 🔁 Development Workflow

```bash
# Compile TypeScript in watch mode (auto-recompiles on save)
npm run watch

# Rebuild the webview after UI changes
npm run build:webview

# Run tests
npm test
```

---

## 📦 Packaging the Extension

To create a `.vsix` file that can be installed in any VS Code:

```bash
npm install -g @vscode/vsce
vsce package
```

This creates `vibe-code-explainer-x.x.x.vsix`. Install it via:
**Extensions panel → `...` menu → Install from VSIX**

---

## 🏗️ Project Structure

```
vibe-code-explainer/
├── src/                  # Extension source (TypeScript)
│   ├── extension.ts      # Entry point
│   ├── core/             # Diff detection & change analysis
│   ├── ai/               # OpenAI, Anthropic, Local LLM clients
│   ├── services/         # Storage, session, learning services
│   └── ui/               # Tree views & webview panel
├── webview-ui/           # React app (shown inside VS Code panel)
│   └── src/components/   # DiffViewer, ExplanationCard
├── test/                 # Mocha test suites
├── out/                  # Compiled JS output (auto-generated)
└── package.json          # Extension manifest & scripts
```

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a pull request.

## 🐛 Issues

Found a bug? Please open an issue on the [GitHub Issues](../../issues) page.
