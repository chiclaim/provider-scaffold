
import * as vscode from 'vscode';
import { Utils } from '../utils';

export async function wrapWithConsumerCommand(document: vscode.TextDocument, range: vscode.Range) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    let shortRange = Utils.calcCursorWidgetRange(document, range);
    if (!shortRange) {
        return;
    }
    let fullRange = Utils.calcWidgetFullRange(document, shortRange);
    if (!fullRange) {
        const errorMsg = "选定范围内不包含有效的 Widget 代码";
        console.error(errorMsg);
        vscode.window.showErrorMessage(errorMsg);
        return;
    }
    let selectedText = document.getText(fullRange);
    if (selectedText) {
        console.log("full widget range:\n", selectedText);
    } else {
        // 选定范围内的代码
        selectedText = document.getText(range);
    }

    // 包裹选中代码
    const wrappedTextTemplate = `Consumer(\n  builder: (_, model, __) {\n    return ${selectedText};\n  },\n)`;

    // 编辑文档，替换选定文本为包裹后的文本
    await editor.edit(editBuilder => {
        editBuilder.replace(fullRange!, wrappedTextTemplate);
    });

    // 使用 formatDocument 格式化整个文件
    await vscode.commands.executeCommand('editor.action.formatDocument');
}
