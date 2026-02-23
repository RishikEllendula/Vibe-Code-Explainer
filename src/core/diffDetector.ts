import * as vscode from 'vscode';
import * as diff from 'diff';
import { Change } from '../models/Change';
import { Logger } from '../utils/logger';

export class DiffDetector {
  private previousDocumentStates: Map<string, string> = new Map();

  async detectChanges(event: vscode.TextDocumentChangeEvent): Promise<Change[]> {
    const document = event.document;
    const uri = document.uri.toString();
    const currentContent = document.getText();

    // Get previous state
    const previousContent = this.previousDocumentStates.get(uri) || '';

    // Update stored state
    this.previousDocumentStates.set(uri, currentContent);

    if (!previousContent) {
      Logger.debug('No previous content to compare');
      return [];
    }

    // Calculate diff
    const changes = this.calculateDiff(previousContent, currentContent, document);

    return changes;
  }

  private calculateDiff(
    oldContent: string,
    newContent: string,
    document: vscode.TextDocument
  ): Change[] {
    const changes: Change[] = [];
    const patches = diff.structuredPatch(
      'old',
      'new',
      oldContent,
      newContent,
      '',
      ''
    );

    patches.hunks.forEach((hunk: diff.Hunk, index: number) => {
      const startLine = hunk.oldStart;
      const endLine = hunk.oldStart + hunk.oldLines;

      const removedLines: string[] = [];
      const addedLines: string[] = [];

      hunk.lines.forEach((line: string) => {
        if (line.startsWith('-')) {
          removedLines.push(line.substring(1));
        } else if (line.startsWith('+')) {
          addedLines.push(line.substring(1));
        }
      });

      const change: Change = {
        id: `${document.uri.toString()}-${Date.now()}-${index}`,
        filePath: document.uri.fsPath,
        fileName: this.getFileName(document.uri.fsPath),
        startLine,
        endLine,
        oldContent: removedLines.join('\n'),
        newContent: addedLines.join('\n'),
        changeType: this.detectChangeType(removedLines, addedLines),
        timestamp: new Date(),
        language: document.languageId,
      };

      changes.push(change);
    });

    return changes;
  }

  private detectChangeType(
    removed: string[],
    added: string[]
  ): 'addition' | 'deletion' | 'modification' {
    if (removed.length === 0 && added.length > 0) {
      return 'addition';
    }
    if (removed.length > 0 && added.length === 0) {
      return 'deletion';
    }
    return 'modification';
  }

  private getFileName(filePath: string): string {
    return filePath.split(/[\\/]/).pop() || filePath;
  }

  getDiffForFile(filePath: string, oldContent: string, newContent: string): string {
    const patch = diff.createPatch('file', oldContent, newContent, '', '');
    return patch;
  }

  clearHistory(): void {
    this.previousDocumentStates.clear();
  }
}
