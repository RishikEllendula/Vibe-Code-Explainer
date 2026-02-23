export class DiffViewer {
  static renderDiff(oldCode: string, newCode: string): string {
    return `<div class="diff-viewer">
      <div class="old-code"><pre>${oldCode}</pre></div>
      <div class="new-code"><pre>${newCode}</pre></div>
    </div>`;
  }
}
