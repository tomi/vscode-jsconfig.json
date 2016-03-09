# README

## Create jsconfig.json - Visual Studio Code extension

Javascript compiler options can be defined in jsconfig.json.
This extension provides an easy way to create the jsconfig.json file.

## Installation

To install, press `F1` and select `Extensions: Install Extensions` and then search for and select `Create jsconfig.json`.

## Usage

### Command

![Command to create jsconfig.json](images/create-jsconfig-cmd.gif)

## Version history

### 0.2.0

* Changes to jsconfig.json template after VS Code 0.10.10 changes:
  * Removed `target` from compiler options as it's no longer supported.
  * Added `exclude` since explicit list is required from now on.
* `Reload JavaScript` command is invoked automatically after jsconfig.json is created.
* Added reminder notification about Reload JavaScript command when jsconfig.json is created.

### 0.1.1

Proper error message is shown when trying to create jsconfig file if folder is not open.

### 0.1.0

As of VS Code version 0.10.5, ES6 is the new default for JavaScript files. Therefore the code action the extension previously provided has been removed as obsolete.

### 0.0.1

Initial release

## Participate

If you have any ideas, feel free to create issues and pull requests

## Acknowledgements
This project is a grateful recipient of the [Futurice Open Source sponsorship program](http://futurice.com/blog/sponsoring-free-time-open-source-activities). ♥
