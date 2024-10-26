
import * as vscode from 'vscode';

export async function wrapWithConsumerCommand(document: vscode.TextDocument, range: vscode.Range) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  // 选定范围内的代码
  const selectedText = document.getText(range);

  // 包裹选中代码
  const wrappedText = `Consumer(\n  builder: (context, watch, child) {\n    return ${selectedText};\n  },\n)`;

  // 编辑文档，替换选定文本为包裹后的文本
  await editor.edit(editBuilder => {
    editBuilder.replace(range, wrappedText);
  });
}
