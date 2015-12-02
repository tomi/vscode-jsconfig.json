"use strict";

const fs = require("fs");
const Q  = require("q");

const NOT_FOUND = "ENOENT";

function fileExists(file) {
    let deferred = Q.defer();
    
    fs.stat(file, function (error, stat) {
        if (error) {
            if (error.code === NOT_FOUND) {
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

exports.fileExists = fileExists;
exports.writeFile  = writeFile;
