import * as vscode from "vscode";
import {
    StartEndInfo,
    getLineIndent,
    getReflowedText,
    getStartLine,
    getEndLine,
    getSettings,
    OtherInfo
} from "./testable";

export function reflow() {

    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    let settings = getSettings(vscode.workspace.getConfiguration("igor-reflowMarkdown"));

    const selection = editor.selection;
    const position = editor.selection.active;
    let sei = GetStartEndInfo(editor);

    let len = editor.document.lineAt(sei.lineEnd).text.length;
    let range = new vscode.Range(sei.lineStart, 0, sei.lineEnd, len);
    let text = editor.document.getText(range);

    let reflowedText = getReflowedText(sei, text, settings);
    let applied = editor.edit(
        function (textEditorEdit) {
            textEditorEdit.replace(range, reflowedText);
        }
    );

    // reset selection (TODO may be contra-intuitive... maybe rather reset to single position, always?)
    editor.selection = selection;

    return applied;
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("extension.igor-reflowMarkdown", reflow);
    context.subscriptions.push(disposable);
}

export function GetStartEndInfo(editor: vscode.TextEditor): StartEndInfo {

    const midLineNum = editor.selection.active.line;
    let midLine = editor.document.lineAt(midLineNum);
    let maxLineNum = editor.document.lineCount - 1; //max line NUMBER is line COUNT minus 1
    let lineAtFunc = (line: number) => { return editor.document.lineAt(line); };

    let o = new OtherInfo();
    let s = getStartLine(lineAtFunc, midLine);
    let e = getEndLine(lineAtFunc, midLine, maxLineNum, o);
    o.indents = getLineIndent(s.firstNonWhitespaceCharacterIndex, s.text);

    return  {
        lineStart: s.lineNumber,
        lineEnd: e.lineNumber,
        otherInfo: o
    };
}
