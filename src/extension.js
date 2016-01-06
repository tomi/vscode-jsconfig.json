"use strict";

const vscode    = require("vscode");
const window    = vscode.window;
const workspace = vscode.workspace;

const Q    = require("q");
const fs   = require("./promise-fs");
const path = require("path");

const FILE_NAME = "jsconfig.json";
const FILE_CONTENTS =
`{
    "compilerOptions": {
        "target": "ES6",
        "module": "commonjs"
    }
}`;

const isFolder        = () => workspace.rootPath !== null;
const getJsconfigPath = () => path.join(workspace.rootPath, FILE_NAME);

const createCommand = (jsconfigPath) => [{
    title:     "Create jsconfig.json file",
    command:   "extension.createJsconfig"
}];

function fixCommand() {
    if (!isFolder()) {
        window.showErrorMessage(`Cant create ${FILE_NAME}. No folder opened.`);
        return;
    }
    
    const jsconfigPath = getJsconfigPath();
    fs.fileExists(jsconfigPath)
        .then(exists => {
            if (exists) {
                return Q(undefined);
            } else {
                return fs.writeFile(jsconfigPath, FILE_CONTENTS);
            }
        })
        .then(() => workspace.openTextDocument(jsconfigPath))
        .then((doc) => window.showTextDocument(doc))
        .fail((error) => window.showInformationMessage(`Error while creating ${FILE_NAME}: ${error}`));
}

function activate(context) {
	const disposable = vscode.commands.registerCommand(
        "extension.createJsconfig", fixCommand);
    
	context.subscriptions.push(disposable);
}

exports.activate = activate;
