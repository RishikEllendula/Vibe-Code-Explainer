import * as vscode from 'vscode';
import { LearningService } from '../../services/learningService';

export class LearningPathView implements vscode.TreeDataProvider<any> {
  private _onDidChangeTreeData = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private learningService: LearningService
  ) {}

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: any): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.TreeItem[] {
    const progress = this.learningService.getProgress();
    if (!progress) {
      return [];
    }

    return [{
      label: `Concepts: ${progress.concepts.size}`,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
    }];
  }
}
