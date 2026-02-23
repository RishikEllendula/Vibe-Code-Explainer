import * as vscode from 'vscode';

export class ExplainerPanel {
  public static currentPanel: ExplainerPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.html = this.getHtmlContent(this.panel.webview, extensionUri);
  }

  public static render(extensionUri: vscode.Uri) {
    if (ExplainerPanel.currentPanel) {
      ExplainerPanel.currentPanel.panel.reveal(vscode.ViewColumn.Two);
    } else {
      const panel = vscode.window.createWebviewPanel(
        'vibeExplainer',
        'Vibe Explainer',
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      ExplainerPanel.currentPanel = new ExplainerPanel(panel, extensionUri);
    }
  }

  private getHtmlContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const webviewUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, 'webview-ui', 'dist')
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, 'webview-ui', 'dist', 'assets', 'index.js')
    );

    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, 'webview-ui', 'dist', 'assets', 'index.css')
    );

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline';">
      <link rel="stylesheet" href="${styleUri}">
      <title>Vibe Code Explainer</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  public dispose() {
    ExplainerPanel.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
