// src/providers/wrapWithConsumerProvider.ts

import * as vscode from 'vscode';
import { Utils } from '../utils';

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

    console.log('Wrap with Consumer Provider token:', token, "context:", context);
    if (token.isCancellationRequested) return [];
    // if (context.triggerKind === vscode.CodeActionTriggerKind.Invoke) return [];

    // 第三方库，不展示 Wrap with Consumer 选项
    if (!vscode.workspace.getWorkspaceFolder(document.uri)) return [];

    // 光标所在位置，不是创建 Widget 的位置
    let widgetRange = Utils.calcCursorWidgetRange(document, range);
    if (!widgetRange) return [];

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
