"use strict";

const vscode    = require("vscode");
const window    = vscode.window;
const workspace = vscode.workspace;

const fs   = require("fs");
const Q    = require("q");
const path = require("path");

const ERR_CODE = "-1";
const ERR_MSG  = "This can only be used with ES6. Make sure to have a jsconfig.json-file which sets the target to ES6.";

const FILE_NAME = "jsconfig.json";
const JSCONFIG =
`{
    "compilerOptions": {
        "target": "ES6",
        "module": "commonjs"
    }
}`;

const getJsconfigPath = (rootPath)     => path.join(rootPath, FILE_NAME);
const createCommand   = (jsconfigPath) => [{
    title:     "Create jsconfig.json file",
    command:   "extension.create.jsconfig.json",
    arguments: jsconfigPath
}];

function fileExists(file) {
    let deferred = Q.defer();
    
    fs.stat(file, function (error, stat) {
        if (error) {
            if (error.code === "ENOENT") {
                deferred.resolve(false);                
            } else {
                deferred.reject(error);
            }
        } else {
            deferred.resolve(true);
        }
    });

    return deferred.promise;
}

function writeFile(filename, data) {
    let deferred = Q.defer();

    fs.writeFile(filename, data, function(error) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve();
        }
    });
    
    return deferred.promise;
}

function hasMissingJsconfigError(diagnostics) {
    for (var i = 0; i < diagnostics.length; i++) {
        var d = diagnostics[i];
        
        console.log(d.message);
        
        if (d.code === ERR_CODE && d.message === ERR_MSG) {
            return true;
        }
    }
    
    return false;
}

const fixFactory = {
    provideCodeActions: function(document, range, context, token) {
        if (context.diagnostics.length === 0 ||
            !hasMissingJsconfigError(context.diagnostics)) {
            return [];
        }
        
        let rootPath = workspace.rootPath;
        if (!rootPath) {
            return [];
        }

        let jsconfigPath = getJsconfigPath(rootPath);
        return fileExists(jsconfigPath).then((exists) => {
            if (exists) return [];
            else return createCommand(jsconfigPath);
        });
    }
};

function fixCommand(jsconfigPath) {
    writeFile(jsconfigPath, JSCONFIG)
        .then(() => workspace.openTextDocument(jsconfigPath))
        .then((doc) => window.showTextDocument(doc))
        .fail((error) => window.showInformationMessage(`Error while creating ${FILE_NAME}: ${error}`));
}

function activate(context) {
	const disposable = vscode.commands.registerCommand(
        "extension.create.jsconfig.json", fixCommand);
    
    const fixer = vscode.languages.registerCodeActionsProvider(
        "javascript", fixFactory);

	context.subscriptions.push(disposable);
	context.subscriptions.push(fixer);
}

exports.activate = activate;
