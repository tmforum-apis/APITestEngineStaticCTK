'use strict';
// Elastic Search access methods
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const axios = require('axios');




 /**
   * Method will strip the BOM character
   * @param {*} content
   */
exports.stripBOM = function(content) {
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }
    return content;
  }


exports.writeLocalFile = function(filename, contents){
	// Write a file
	fs.writeFileSync(filename, contents);
	//console.log(filename + ' generated at: ' + process.cwd() + '/' + filename);
}




exports.checkFolderExists = function(folderName){
    // Check that the folder exists and create it if it does not
    var dirPath = process.cwd() + path.sep + folderName;
    if (!fs.existsSync(dirPath)){
         fs.mkdirSync(dirPath);
         console.log('Directory created ', dirPath)
    }
}


exports.deleteOldestFile= function(folderName){
    // Delete the oldest file in the folder
    var dirPath = process.cwd() + path.sep + folderName;
    if (fs.existsSync(dirPath)){
         let files = fs.readdirSync(dirPath);
         if(files.length > 19){
           // Sort the files
           files.sort(function(a, b) {
                         return fs.statSync(dirPath + a).mtime.getTime() - 
                                fs.statSync(dirPath + b).mtime.getTime();
                     });
           // Remove the oldest
           fs.unlinkSync(dirPath + path.sep + files[0])
          }
    }
}

// Output file in results dir
exports.writetoFileResDir = function(jsObj, name, ext) {
    // generate date
    const now = new Date();
    const formattedDate = 
      now.getDate() +
      '-' +
      (now.getMonth() + 1) +
      '-' +
      now.getFullYear() +
      '-' +
      Date.now();
    // build result file name
    const resultsFolder = 'results/';
    const logFilename = 'sctk-summary_' + name + '_' + formattedDate + '.' + ext;
    const resultLocation = resultsFolder + logFilename;
    this.checkFolderExists(resultsFolder);
    this.deleteOldestFile(resultsFolder);
    console.log('Detailed output in: ' + resultLocation);
    fs.writeFileSync(resultLocation, jsObj);
}



