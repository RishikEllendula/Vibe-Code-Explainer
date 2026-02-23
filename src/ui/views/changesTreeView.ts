import * as vscode from 'vscode';
import { Change } from '../../models/Change';

export class ChangesTreeView implements vscode.TreeDataProvider<Change> {
  private changes: Change[] = [];
  private _onDidChangeTreeData = new vscode.EventEmitter<Change | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  addChanges(changes: Change[]): void {
    this.changes.push(...changes);
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: Change): vscode.TreeItem {
    return {
      label: element.fileName,
      description: `Lines ${element.startLine}-${element.endLine}`,
      tooltip: element.changeType,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
    };
  }

  getChildren(element?: Change): Change[] {
    if (!element) {
      return this.changes;
    }
    return [];
  }
}
