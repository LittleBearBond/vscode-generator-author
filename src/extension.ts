'use strict';
import * as vscode from 'vscode';
import { addUserInfo, updateInfo } from './generator'

export function activate(context: vscode.ExtensionContext) {

    vscode.workspace.onDidSaveTextDocument(event => {
        updateInfo()
    });

    let addAuthor = vscode.commands.registerCommand('extension.addAuthorInfo', () => {
        addUserInfo()
        // const ext = vscode.extensions.getExtension('edwardhjp.vscode-author-generator')
    });
    context.subscriptions.push(addAuthor);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
