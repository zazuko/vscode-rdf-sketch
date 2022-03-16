// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { debounce } from 'debounce'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "rdf-sketch" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('rdfSketch.openPreview', () => {
    RdfPreviewPanel.show(context.extensionUri);

    // Display a message box to the user
    // ode.window.showInformationMessage('Preview RDF');
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

    const update = debounce(async (e: vscode.TextDocumentChangeEvent) => {
      if (e.document !== editor) return

      const content = e.document.getText()
      panel.webview.html = this._getHtmlForWebview(panel.webview, extensionUri, content);
    }, 1000)

    vscode.workspace.onDidChangeTextDocument(update)

    const content = editor?.getText() ?? ''
    panel.webview.html = this._getHtmlForWebview(panel.webview, extensionUri, content)
  }

  private static _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri, content: string) {
    // Get resource paths
    // const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'styles.css'));
    // const graphLayoutUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'graph-layout.js'));

    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'index.css'));
    const graphStyleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'graph-view.css'));
    const graphLayoutUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'graph-view.umd.js'));
    const indexUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'index.js'));

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">

          <!--
            Use a content security policy to only allow loading images from https or from our extension directory,
            and only allow scripts that have a specific nonce.
          -->
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline';">

          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>RDF Sketch preview</title>

          <script nonce="${nonce}" src="${graphLayoutUri}"></script>
          <link nonce="${nonce}" rel="stylesheet" href="${styleUri}" />
          <link nonce="${nonce}" rel="stylesheet" href="${graphStyleUri}" />
        </head>
        <body style="width: 100%; height: 100%;">
          <div id="graph-view"></div>

          <script nonce="${nonce}">
            const graphView = window['graph-view'];
            graphView.renderText('#graph-view', { content: \`${content}\` });
          </script>
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
