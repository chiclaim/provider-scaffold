// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { createPageAndModel } from './command/new-page-handler';
import { WrapWithConsumerProvider } from './provider/wrap-with-consumer-provider';
import { wrapWithConsumerCommand } from './command/wrap-with-consumer-command';


console.log('Congratulations, your extension "provider-scaffold" is now active!');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "provider-scaffold" is now active!');

	const disposable = vscode.commands.registerCommand('provider-scaffold.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from provider_scaffold!');
	});
	context.subscriptions.push(disposable);

	const newProvider = vscode.commands.registerCommand("provider-scaffold.NewProvider", createPageAndModel);
	context.subscriptions.push(newProvider);

	// 注册 Wrap with Consumer 的命令
	const wrapWithConsumer = vscode.commands.registerCommand('provider-scaffold.wrapWithConsumer', wrapWithConsumerCommand);
	context.subscriptions.push(wrapWithConsumer);

	// 注册 CodeAction 提供者
	const provider = vscode.languages.registerCodeActionsProvider(
		{ scheme: 'file', language: 'dart' },
		new WrapWithConsumerProvider(),
		{ providedCodeActionKinds: WrapWithConsumerProvider.providedCodeActionKinds }
	);
	context.subscriptions.push(provider);
}

// This method is called when your extension is deactivated
export function deactivate() { }
