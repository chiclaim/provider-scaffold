// src/providers/wrapWithConsumerProvider.ts

import * as vscode from 'vscode';

export class WrapWithConsumerProvider implements vscode.CodeActionProvider {
  // 定义 CodeAction 的类型
  static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.Refactor,
  ];

  // 提供 Code Actions
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const wrapWithConsumerAction = this.createWrapWithConsumerAction(document, range);
    return [wrapWithConsumerAction];
  }

  // 创建 Wrap with Consumer 的 Code Action
  private createWrapWithConsumerAction(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction {
    const action = new vscode.CodeAction('Wrap with Consumer', vscode.CodeActionKind.Refactor);
    action.command = {
      title: 'Wrap with Consumer',
      command: 'provider-scaffold.wrapWithConsumer', // 与命令注册时的 id 对应
      arguments: [document, range],
    };
    return action;
  }
}
