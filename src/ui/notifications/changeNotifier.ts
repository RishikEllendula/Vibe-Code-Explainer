import * as vscode from 'vscode';
import { Change } from '../../models/Change';
import { ChangeAnalysis } from '../../core/changeAnalyzer';

export class ChangeNotifier {
  notifyChanges(changes: Change[], analysis: ChangeAnalysis): void {
    if (changes.length === 0) {
      return;
    }

    const message = `${changes.length} code change${changes.length > 1 ? 's' : ''} detected`;
    vscode.window.showInformationMessage(message, 'Explain').then(selection => {
      if (selection === 'Explain') {
        vscode.commands.executeCommand('vibeCodeExplainer.explainChange');
      }
    });
  }
}
