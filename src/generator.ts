import * as vscode from 'vscode';
import * as path from 'path'
import * as fs from 'fs'
import * as moment from 'moment'
import { defaultTpl } from './config'

interface IObject {
    author: string
    email: string,
    autoUpdateFileType: Array<string>,
    date: string
}
const modifyDate = `@modify date `

function getDate() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

export function getConfig() {
    let userConfig = vscode.workspace.getConfiguration('generator.author');
    const config: IObject = {
        author: userConfig.get('author', 'author'),
        email: userConfig.get('email', 'email@email'),
        autoUpdateFileType: userConfig.get('autoUpdateFileType', ["js", "jsx", "css", "ts", "tsx"]),
        date: getDate()
    }
    return config;
}

export function getFileType(fileName) {
    let fileInfo = fileName.split('.')
    return fileInfo && fileInfo.length > 1 ? fileInfo.pop() : 'default'
}

function getTplPath(type) {
    type = type.toLowerCase()
    let extDir = (vscode.extensions.getExtension('littlebearbond.vscode-generator-author'))
    if (!extDir || !extDir.extensionPath) {
        return null
    }
    let extPath = path.join(extDir.extensionPath, 'templates', `${type}.tpl`)
    if (fs.existsSync(extPath)) {
        return extPath
    }
    const defaultPath = path.join(extDir.extensionPath, 'templates', 'default.tpl')
    if (fs.existsSync(defaultPath)) {
        return defaultPath
    }
    return null
}

const getTplText = (document) => {
    let text = ''
    const { author, email, date } = getConfig()
    let type = getFileType(document.fileName)
    let tplPath = getTplPath(type)
    try {
        text = tplPath ? fs.readFileSync(tplPath, 'utf-8') : defaultTpl
        text = text.replace(/\[author\]/, author)
            .replace(/\[email\]/, email)
            .replace(/\[date\]/g, date)
    } catch (error) {
        vscode.window.showErrorMessage(error.message)
    }
    return text
}

export function addUserInfo() {
    let editor = vscode.window.activeTextEditor
    // const doc = editor.document;
    // const text = doc.getText();
    editor.edit(builder => {
        try {
            builder.insert(new vscode.Position(0, 0), getTplText(editor.document))
        } catch (error) {
            vscode.window.showErrorMessage(error.message)
        }
    });
}

export function updateTimeInfo() {
    const editor = vscode.window.activeTextEditor
    const rangeText = editor.document.getText(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(21, 0)));
    const { line } = editor.document.positionAt(rangeText.indexOf(modifyDate))
    if (!line) {
        console.log(`modify date not found`);
        return;
    }
    const { text: lineText, range } = editor.document.lineAt(line)
    const lineTextArr = lineText.split(modifyDate)
    let replaceText = lineTextArr.shift() + modifyDate + getDate()
    editor.edit((builder) => {
        try {
            builder.replace(range, replaceText)
            editor.document.save();
        } catch (error) {
            vscode.window.showErrorMessage(error.message)
        }
    })
}
