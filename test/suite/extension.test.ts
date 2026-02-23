import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('your-publisher-name.vibe-code-explainer'));
  });

  test('Should register all commands', async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes('vibeCodeExplainer.explainChange'));
    assert.ok(commands.includes('vibeCodeExplainer.showDiff'));
  });
});
