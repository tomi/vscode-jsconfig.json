"use strict";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var fs     = require('fs');
var path   = require("path");

const FILE_NAME = "jsconfig.json";

const JSCONFIG =
`{
    "compilerOptions": {
        "target": "ES6",
        "module": "commonjs"
    }
}`;

function getJsconfigPath(root) {
    return path.join(root, FILE_NAME);
}

function createFixCommand(rootPath) {
    return [{
        title: "Create jsconfig.json file",
        
        command: "extension.create.jsconfig.json",

        arguments: rootPath
    }];
}

function hasMissingJsconfigError(diagnostics) {
    for (var i = 0; i < diagnostics.length; i++) {
        var d = diagnostics[i];
        
        if (d.code === "-1" && 
            d.message.startsWith("This can only be used with ES6")) {
            return true;
        }
    }
    
    return false;
}

var fixFactory = {
    provideCodeActions: function(document, range, context, token) {
        if (context.diagnostics.length === 0 ||
            !hasMissingJsconfigError(context.diagnostics)) {
            return [];
        }
        
        let rootPath = vscode.workspace.rootPath;
        if (!rootPath) {
            return [];
        }

        let jsconfigPath = getJsconfigPath(rootPath);
        if (fs.existsSync(jsconfigPath)) {
            return [];
        }

        return createFixCommand(rootPath);
    }
};


function fixCommand(rootPath) {
    console.log("Fix activated");
    
    let jsconfigPath = getJsconfigPath(rootPath);
    if (fs.existsSync(jsconfigPath)) {
        return;
    }
    
    fs.writeFileSync(jsconfigPath, JSCONFIG);
    
    vscode.workspace.openTextDocument(jsconfigPath)
        .then(doc => vscode.window.showTextDocument(doc).then());
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "extension-test" is now active!'); 

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('extension.create.jsconfig.json', fixCommand);
    
    var fixer = vscode.languages.registerCodeActionsProvider("javascript", fixFactory);

	context.subscriptions.push(disposable);
	context.subscriptions.push(fixer);
}

exports.activate = activate;