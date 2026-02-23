import { DiffDetector } from '../core/diffDetector';
import * as vscode from 'vscode';

export function showDiff(detector: DiffDetector) {
  return async () => {
    vscode.window.showInformationMessage('Showing diff visualization...');
  };
}
