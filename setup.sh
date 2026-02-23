#!/bin/bash

echo "======================================"
echo "Vibe Code Explainer - Setup Script"
echo "======================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm found: $(npm --version)"
echo ""

# Install root dependencies
echo "📦 Installing extension dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install extension dependencies"
    exit 1
fi

echo "✓ Extension dependencies installed"
echo ""

# Install webview dependencies
echo "📦 Installing webview dependencies..."
cd webview-ui
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install webview dependencies"
    exit 1
fi

cd ..
echo "✓ Webview dependencies installed"
echo ""

# Compile TypeScript
echo "🔨 Compiling TypeScript..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Failed to compile TypeScript"
    exit 1
fi

echo "✓ TypeScript compiled successfully"
echo ""

# Build webview
echo "🔨 Building webview..."
npm run build:webview

if [ $? -ne 0 ]; then
    echo "❌ Failed to build webview"
    exit 1
fi

echo "✓ Webview built successfully"
echo ""

echo "======================================"
echo "✅ Setup complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Press F5 in VS Code to run the extension"
echo "2. Or run 'npm run watch' for development"
echo "3. Configure your AI provider in settings"
echo ""
echo "For more information, see README.md"
