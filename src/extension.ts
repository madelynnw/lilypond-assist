import * as vscode from "vscode";
import { runReformat } from "./format";
import { runCompile } from "./compile";

const langId = `lilypond`;

const getProvider = (
	context: vscode.ExtensionContext
): vscode.DocumentFormattingEditProvider => {
	const provider: vscode.DocumentFormattingEditProvider = {
		async provideDocumentFormattingEdits(
			document: vscode.TextDocument
		): Promise<vscode.TextEdit[]> {
			let edits: vscode.TextEdit[] = [];
			try {
				const reformattedCode = runReformat(document);
				edits = [
					vscode.TextEdit.replace(
						new vscode.Range(
							new vscode.Position(0, 0),
							new vscode.Position(document.lineCount, 0)
						),
						reformattedCode
					),
				];
			} catch (err) {
				vscode.window.showErrorMessage(`LilyPond Assist Formatter: ${err}`);
			}
			return edits;
		},
	};
	return provider;
};

export const activate = (context: vscode.ExtensionContext) => {
	vscode.languages.registerDocumentFormattingEditProvider(
		langId,
		getProvider(context)
	);
	vscode.workspace.onDidSaveTextDocument((doc: vscode.TextDocument) => {
		if (doc.languageId === langId) {
			runCompile(doc);
		}
	});
};
