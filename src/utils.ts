
import * as vscode from 'vscode';
export class Utils {

    /**
     * 光标在 Widget 构造方法调用位置
     * @param document
     * @param range 
     * @returns vscode.Range 范围如 `Center(`
     */
    static calcCursorWidgetRange(document: vscode.TextDocument, range: vscode.Range): vscode.Range | undefined {
        // 目标：光标所在的位置是 Flutter Widget 构造方法调用的位置
        // 方法：通过 AST语法树分析（太重了，光标移动到其他地方也需要检测）
        // 通过简单的字符串判断即可

        // 判断光标所在的单词首字母是否大写
        // 光标往右插找，单词的右侧是否挨着`(`

        let startPosition: vscode.Position | undefined = undefined;
        let endPosition: vscode.Position | undefined = undefined;


        let tmpPosition = range.start;
        // 如果光标相邻的字符都不是字母，则返回 false
        if (!/^[a-zA-Z]$/.test(document.getText(new vscode.Range(tmpPosition.translate(0, -1), tmpPosition))) &&
            !/^[a-zA-Z]$/.test(document.getText(new vscode.Range(tmpPosition, tmpPosition.translate(0, 1))))) {
            console.log('光标相邻的字符都不是字母');
            return;
        }

        // 首字母是否大写
        let isCapitalized = false;

        while (tmpPosition.character > 0) {
            tmpPosition = tmpPosition.translate(0, -1);
            const char = document.getText(new vscode.Range(tmpPosition, tmpPosition.translate(0, 1)));
            console.log("字符:", char, "left character ", tmpPosition.character, "line ", tmpPosition.line);
            // 遇到空格，表示找到单词的起点
            if (/\s/.test(char)) {
                tmpPosition = tmpPosition.translate(0, 1);
                const leftLetter = document.getText(new vscode.Range(tmpPosition, tmpPosition.translate(0, 1)));
                isCapitalized = /^[A-Z]$/.test(leftLetter); // 检查是否大写
                if (isCapitalized) {
                    startPosition = tmpPosition;
                }
                break;
            }
        }
        // 如果光标所在处首字母不是大写，就不用找右侧的位置了
        if (!startPosition) {
            return;
        }

        tmpPosition = range.start;
        while (tmpPosition.character > 0) {
            const c = document.getText(new vscode.Range(tmpPosition, tmpPosition.translate(0, 1)))
            tmpPosition = tmpPosition.translate(0, 1);
            console.log("字符:", c, "right character ", tmpPosition.character, "line ", tmpPosition.line, " line end character ", document.lineAt(tmpPosition.line).range.end.character);
            if ('(' === c) {
                endPosition = tmpPosition;
                break;
            }
            // 行尾
            if (document.lineAt(tmpPosition.line).range.end.character == tmpPosition.character) {
                break
            }
        }

        if (endPosition) {
            console.log("最终的位置范围：", startPosition, endPosition, "\n", document.getText(new vscode.Range(startPosition!, endPosition!)));
            return new vscode.Range(startPosition!, endPosition!);
        }
    }

    static isLineEnd(document: vscode.TextDocument, position: vscode.Position): boolean {
        return document.lineAt(position.line).range.end.character == position.character;
    }


    static calcWidgetFullRange(document: vscode.TextDocument, widgetShortRange: vscode.Range): vscode.Range | undefined {

        let openParenthesesCount = 0;
        let currentPosition = widgetShortRange.start;

        while (currentPosition.line < document.lineCount) {
            const lineText = document.lineAt(currentPosition.line).text;
            const char = lineText[currentPosition.character];
            console.log("字符:", char, "line ", currentPosition.line, " character ", currentPosition.character);

            // 如果找到了左括号，增加计数
            if (char === '(') {
                openParenthesesCount++;
            }
            // 如果找到了右括号，减少计数
            else if (char === ')') {
                openParenthesesCount--;
                if (openParenthesesCount === 0) {
                    let endPosition = new vscode.Position(currentPosition.line, currentPosition.character + 1)
                    return new vscode.Range(widgetShortRange.start, endPosition);
                }
            }

            if (Utils.isLineEnd(document, currentPosition)) {
                // 如果当前行已结束，移动到下一行的开始
                currentPosition = currentPosition.translate(1, -currentPosition.character); // TODO
            } else {
                currentPosition = currentPosition.translate(0, 1);  // 移动到下一字符
            }

            // 移动到下一字符
            // if (currentPosition.character < lineText.length - 1) {
            //     currentPosition = currentPosition.translate(0, 1);  // 向右移动
            // } else {
            //     // 如果当前行已结束，移动到下一行的开始
            //     currentPosition = currentPosition.translate(1, -currentPosition.character);
            // }
        }
        return undefined;  // 如果没有找到匹配的右括号

    }






}