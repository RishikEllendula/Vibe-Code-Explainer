import { Explainer } from '../core/explainer';
import { ChangeNotifier } from '../ui/notifications/changeNotifier';
import * as vscode from 'vscode';

export function explainChange(explainer: Explainer, notifier: ChangeNotifier) {
  return async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }
    vscode.window.showInformationMessage('Explaining code change...');
  };
}
