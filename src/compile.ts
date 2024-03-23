import * as cp from "child_process";
import * as vscode from "vscode";
import * as path from "path";

export const outputChan: vscode.OutputChannel = vscode.window.createOutputChannel(
  `Lilypond Assist: Compile`
);

export const runCompile = async (
  textDocument: vscode.TextDocument,
) => {
  try {
    const binPath = 'lilypond';
    const filePath = textDocument.uri.fsPath;
    const args = [filePath];
    outputChan.appendLine(`Compiling: ${filePath}`);
    const process = cp.spawn(binPath, args, { cwd: path.dirname(filePath) });

    process.stdout.on("data", (data) => {
      outputChan.appendLine(`${data.toString()}`);
    });

    process.stderr.on("data", (data) => {
      outputChan.appendLine(`${data.toString()}`);
    });

    process.on("close", (code) => {
      if (code === 0) {
        outputChan.appendLine(`Compilation successful`);
      } else if (code === null) {
        outputChan.appendLine(`Compilation killed`);
      } else {
        outputChan.appendLine(`Compilation failed`);
      }
    });
  } catch (err) {
    outputChan.appendLine(`Compilation failed: ${err}`);
  }
};
