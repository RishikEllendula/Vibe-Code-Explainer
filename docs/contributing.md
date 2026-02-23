# Contributing to Vibe Code Explainer

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/vibe-code-explainer.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites
- Node.js 18 or later
- VS Code 1.85 or later
- Git

### Installation
```bash
npm install
cd webview-ui && npm install
```

### Running the Extension
1. Open the project in VS Code
2. Press F5 to launch the Extension Development Host
3. Test your changes in the new VS Code window

### Building
```bash
npm run compile          # Compile TypeScript
npm run watch           # Watch mode
npm run build:webview   # Build React UI
```

## Code Style

### TypeScript
- Use TypeScript strict mode
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Export interfaces and types

### React
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for props
- Follow React best practices

### Formatting
- Run `npm run lint` before committing
- Use Prettier for code formatting
- 2 spaces for indentation
- Single quotes for strings

## Commit Messages

Follow conventional commits:
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## Pull Request Process

1. Update documentation for any new features
2. Add tests for new functionality
3. Ensure all tests pass: `npm test`
4. Update CHANGELOG.md
5. Create a pull request with:
   - Clear description of changes
   - Related issue number (if applicable)
   - Screenshots (for UI changes)

## Testing

### Running Tests
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
```

### Writing Tests
- Add tests for new features
- Maintain test coverage
- Use descriptive test names
- Test edge cases

## Adding New Features

### AI Provider
1. Create new client in `src/ai/`
2. Implement the LLMClient interface
3. Add configuration options
4. Update documentation

### Integration
1. Create adapter in `src/integrations/`
2. Implement BaseAdapter interface
3. Add detection logic
4. Test with target tool

### UI Component
1. Create component in `webview-ui/src/components/`
2. Add TypeScript types
3. Style appropriately
4. Test in webview

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

### Review Criteria
- Code quality and style
- Test coverage
- Documentation
- Performance impact
- Security considerations

## Reporting Bugs

### Before Submitting
- Check existing issues
- Test with latest version
- Gather error logs and screenshots

### Bug Report Template
```
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. Windows 11]
- VS Code version:
- Extension version:
```

## Feature Requests

We welcome feature requests! Please:
- Search existing issues first
- Explain the use case clearly
- Describe the desired behavior
- Consider implementation complexity

## Questions?

- Open a discussion on GitHub
- Check documentation first
- Be respectful and patient

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

### Our Pledge
We are committed to making participation in our project a harassment-free experience for everyone.

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

Thank you for contributing to Vibe Code Explainer!
