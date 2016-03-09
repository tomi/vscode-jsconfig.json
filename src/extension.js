"use strict";

const vscode    = require("vscode");
const window    = vscode.window;
const workspace = vscode.workspace;
const commands  = vscode.commands;

const Q    = require("q");
const fs   = require("./promise-fs");
const path = require("path");

const FILE_NAME = "jsconfig.json";
const FILE_CONTENTS =
`{
    "compilerOptions": {
        "module": "commonjs"
    },
	"exclude": [
		"node_modules"
	]
}`;

const isFolder        = () => workspace.rootPath !== null && workspace.rootPath !== undefined;
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

    let wasCreated = false;

    const jsconfigPath = getJsconfigPath();
    fs.fileExists(jsconfigPath)
        .then(exists => {
            if (exists) {
                return Q(undefined);
            } else {
                wasCreated = true;
                return fs.writeFile(jsconfigPath, FILE_CONTENTS);
            }
        })
        .then(() => workspace.openTextDocument(jsconfigPath))
        .then((doc) => window.showTextDocument(doc))
        .then(() => {
            if (wasCreated) {
                commands.executeCommand("javascript.reloadProjects");
            }
        })
        .then(() => {
            window.showInformationMessage(`If you make changes don't forget to execute 'Reload JavaScript Project' command.`);
        })
        .fail((error) => window.showInformationMessage(`Error while creating ${FILE_NAME}: ${error}`));
}

function activate(context) {
	const disposable = vscode.commands.registerCommand(
        "extension.createJsconfig", fixCommand);

	context.subscriptions.push(disposable);
}

exports.activate = activate;
