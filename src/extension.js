"use strict";

const vscode    = require("vscode");
const window    = vscode.window;
const workspace = vscode.workspace;

const Q    = require("q");
const fs   = require("./promise-fs");
const path = require("path");

const ERR_CODE = "-1";
const ERR_MSG  = "This can only be used with ES6. Make sure to have a jsconfig.json-file which sets the target to ES6.";

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

function hasMissingJsconfigError(diagnostics) {
    for (var i = 0; i < diagnostics.length; i++) {
        var d = diagnostics[i];
        
        if (d.code === ERR_CODE && d.message === ERR_MSG) {
            return true;
        }
    }
    
    return false;
}

const fixFactory = {
    provideCodeActions: function(document, range, context, token) {
        if (context.diagnostics.length === 0 ||
            !hasMissingJsconfigError(context.diagnostics) ||
            !isFolder) {
            return [];
        }

        let jsconfigPath = getJsconfigPath();
        return fs.fileExists(jsconfigPath).then((exists) => {
            if (exists) return [];
            else return createCommand(jsconfigPath);
        });
    }
};

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
    
    const fixer = vscode.languages.registerCodeActionsProvider(
        "javascript", fixFactory);

	context.subscriptions.push(disposable);
	context.subscriptions.push(fixer);
}

exports.activate = activate;
