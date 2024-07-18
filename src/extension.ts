
import * as vscode from 'vscode';
import {activate as activate_markdownreflow} from './markdownreflow';

export function activate(context: vscode.ExtensionContext) {
    activate_markdownreflow(context);
}

export function deactivate() {}
