import * as vscode from "vscode";
import { outputChan } from "./util";
import * as cp from "child_process";


export const checkLyInstallation = (lyPath: string) => {
  const res = cp.spawnSync(lyPath, [`-h`, `import ly`]);
  if (res.error || res.status !== 0) {
    outputChan.appendLine(`[STDOUT]: ${res.stdout.toString()}`);
    outputChan.appendLine(`[STDERR]: ${res.stderr.toString()}`);
    throw new Error(
      `ly not installed. Please install ly (often the package 'python3-ly').`
    );
  }
};

const handleLyCommandOutput = (res: cp.SpawnSyncReturns<Buffer>): string => {
  if (res.error) {
    outputChan.appendLine(`[STDOUT]: ${res.stdout.toString()}`);
    outputChan.appendLine(`[STDERR]: ${res.stderr.toString()}`);
    throw res.error;
  }
  if (res.status !== 0) {
    outputChan.appendLine(`[STDOUT]: ${res.stdout.toString()}`);
    outputChan.appendLine(`[STDERR]: ${res.stderr.toString()}`);
    throw new Error(`ly error. See output for "LilyPond Assist: Formatter".`);
  }
  return res.stdout.toString();
};

const runReformatWithLy = (
  lyPath: string,
  doc: vscode.TextDocument,
  timeoutMS: number
): string => {
  outputChan.appendLine(
    `[LOG]: Reformatting "${doc.fileName}" with "${lyPath}", timeout: "${timeoutMS}ms"`
  );
  const res = cp.spawnSync(lyPath, [
    '-l', 'english',
    'indent;reformat',
  ], {
    timeout: timeoutMS,
    input: doc.getText()
  });
  return handleLyCommandOutput(res);
};

export const runReformat = (doc: vscode.TextDocument): string => {
  const timeoutMS = 10000;
  const lyPath = 'ly';
  checkLyInstallation(lyPath);
  return runReformatWithLy(lyPath, doc, timeoutMS);
};
