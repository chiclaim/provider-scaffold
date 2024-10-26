"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
console.log('Congratulations, your extension "provider-scaffold" is now active!');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "provider-scaffold" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('provider-scaffold.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from provider_scaffold!');
    });
    const newProvider = vscode.commands.registerCommand("provider-scaffold.NewProvider", async (uri) => {
        // 提示用户输入文件前缀，支持下划线和驼峰命名
        const prefix = await vscode.window.showInputBox({
            prompt: 'Enter the prefix for the Dart files in snake_case or CamelCase (e.g., "home_page" or "HomePage")',
        });
        if (!prefix) {
            vscode.window.showWarningMessage('Prefix is required to create Dart files.');
            return;
        }
        // 判断输入格式并生成文件名和类名
        const isCamelCase = /^[A-Z][a-zA-Z0-9]*$/.test(prefix);
        const snakeCasePrefix = isCamelCase
            ? prefix.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
            : prefix.toLowerCase();
        const pascalCasePrefix = isCamelCase
            ? prefix
            : snakeCasePrefix
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join('');
        // 获取文件夹路径
        const folderPath = uri.fsPath;
        const currentDirIsPage = path.basename(folderPath) === 'page';
        // 确定 Page 文件的存放目录
        const pageDirPath = currentDirIsPage
            ? folderPath // 如果当前文件夹名为 'page'，则使用当前文件夹
            : path.join(folderPath, 'page'); // 否则在当前文件夹下创建或使用 'page' 文件夹
        // 如果 page 目录不存在，则创建
        if (!fs.existsSync(pageDirPath)) {
            fs.mkdirSync(pageDirPath);
        }
        // 定义 Page 文件和 Model 文件路径
        const pageFilePath = path.join(pageDirPath, `${snakeCasePrefix}.dart`);
        // 如果当前目录是 page, 则 model 文件路径为上级目录的 model 文件夹
        const modelDirPath = currentDirIsPage ? path.join(path.dirname(folderPath), 'model') : path.join(folderPath, 'model');
        const modelFileName = `${snakeCasePrefix.replace('_page', '')}_model.dart`;
        const modelFilePath = path.join(modelDirPath, modelFileName);
        // 定义类名
        const pageClassName = `${pascalCasePrefix}Page`;
        const modelClassName = `${pascalCasePrefix.replace('Page', '')}Model`;
        // 检查 Page 文件是否已存在
        if (fs.existsSync(pageFilePath)) {
            vscode.window.showWarningMessage(`File ${snakeCasePrefix}.dart already exists in the page directory.`);
            return;
        }
        // 创建 model 目录（如果不存在）
        if (!fs.existsSync(modelDirPath)) {
            fs.mkdirSync(modelDirPath);
        }
        // 检查 Model 文件是否已存在
        if (fs.existsSync(modelFilePath)) {
            vscode.window.showWarningMessage(`File ${snakeCasePrefix.replace('_page', '')}_model.dart already exists in the model directory.`);
            return;
        }
        // Page 模板内容
        const pageContent = `
import 'package:flutter/material.dart';
import '../model/${modelFileName}';
import 'package:provider/provider.dart';

class ${pageClassName} extends StatelessWidget {
  const ${pageClassName}({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => ${modelClassName}(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('${pageClassName}'),
        ),
        body: Consumer<${modelClassName}>(builder: (context, model, child) {
          return const Center(
            child: Text('This is the ${pageClassName}'),
          );
        }),
      ),
    );
  }
}`;
        // Model 模板内容
        const modelContent = `

import 'package:flutter/widgets.dart';

class ${modelClassName} with ChangeNotifier {
	${modelClassName}() {
	init();
	}

	init() async {
	// 这里可以写一些初始化逻辑
	}
}`;
        // 写入文件
        fs.writeFileSync(pageFilePath, pageContent);
        fs.writeFileSync(modelFilePath, modelContent);
        // 打开 Page 文件
        const document = await vscode.workspace.openTextDocument(pageFilePath);
        vscode.window.showTextDocument(document);
        vscode.window.showInformationMessage(`${snakeCasePrefix}.dart and ${snakeCasePrefix.replace('_page', '')}_model.dart created successfully.`);
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(newProvider);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map