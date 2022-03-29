import * as vscode from 'vscode'
import { debounce } from 'debounce'

// Called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  // Command are defined in package.json, this provides the implementation
  const disposable = vscode.commands.registerCommand('rdfSketch.openPreview', () => {
    RdfPreviewPanel.show(context.extensionUri);
  });

  context.subscriptions.push(disposable);
}


class RdfPreviewPanel {

  public static readonly viewType = 'rdfPreview';

  public static show(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    const editor = vscode.window.activeTextEditor?.document;

    const panel = vscode.window.createWebviewPanel(
      RdfPreviewPanel.viewType,
      'RDF preview',
      {
        preserveFocus: true,
        viewColumn: column ? column + 1 : vscode.ViewColumn.One,
      },
      {
        // Enable scripts in the webview
        enableScripts: true
      }
    );

    const updateWebview = (document: vscode.TextDocument) => {
      const content = document.getText()
      panel.webview.html = this._getHtmlForWebview(panel.webview, extensionUri, content);
    }

    const onDocumentUpdate = debounce(async (e: vscode.TextDocumentChangeEvent) => {
      if (e.document !== editor) return

      updateWebview(e.document)
    }, 1000)

    vscode.workspace.onDidChangeTextDocument(onDocumentUpdate)

    if (editor) {
      updateWebview(editor)
    }
  }

  private static _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri, content: string) {
    // Get resource paths
    const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'css', 'app.css'));
    const appUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'js', 'app.js'));
    const vendorUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'js', 'chunk-vendors.js'));

    const nonce = getNonce();

    const themeClass = vscode.window.activeColorTheme.kind === 2 ? 'dark' : 'light'

    return `<!DOCTYPE html>
      <html lang="en" class="${themeClass}">
        <head>
          <meta charset="UTF-8">

          <!--
            Use a content security policy to only allow loading images from https or from our extension directory,
            and only allow scripts that have a specific nonce.
          -->
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline';">

          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>RDF Sketch preview</title>

          <script nonce="${nonce}" src="${vendorUri}"></script>
          <link nonce="${nonce}" rel="stylesheet" href="${stylesUri}" />
        </head>
        <body>
          <textarea hidden data-content>
            ${escapeHtml(content)}
          </textarea>
          <div id="app"></div>
          <script nonce="${nonce}" src="${appUri}"></script>
        </body>
      </html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function escapeHtml(text: string): string {
  var map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
