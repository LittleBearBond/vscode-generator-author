'use strict';
import * as vscode from 'vscode';
import { addUserInfo, updateTimeInfo } from './generator'

const cacheFileUpdateTime = {}

export function activate(context: vscode.ExtensionContext) {

    vscode.workspace.onDidSaveTextDocument(({ fileName }) => {
        // 十秒以内不更新
        if (fileName in cacheFileUpdateTime && Number(new Date()) - cacheFileUpdateTime[fileName] < 10 * 1000) {
            return;
        }
        cacheFileUpdateTime[fileName] = Number(new Date());
        updateTimeInfo()
    });

    const addAuthor = vscode.commands.registerCommand('extension.addAuthorInfo', () => {
        addUserInfo()
    });

    const updateAuthorInfo = vscode.commands.registerCommand('extension.updateAuthorInfo', () => {
        updateTimeInfo()
    });

    context.subscriptions.push(addAuthor);
    context.subscriptions.push(updateAuthorInfo);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
