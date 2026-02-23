import * as vscode from 'vscode';
import { SessionService } from '../../services/sessionService';

export class SessionSummaryView implements vscode.TreeDataProvider<any> {
  private _onDidChangeTreeData = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private sessionService: SessionService
  ) {}

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: any): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.TreeItem[] {
    const session = this.sessionService.getCurrentSession();
    if (!session) {
      return [{
        label: 'No active session',
        collapsibleState: vscode.TreeItemCollapsibleState.None,
      }];
    }

    return [{
      label: `Changes: ${session.totalChanges}`,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
    }];
  }
}
