'use strict';
// Import helpers index containing references to the helpers.
//const cmpSpec = require('./compareSpecs.js');
const helpers = require('../helpers/index');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const catalog = require('../helpers/catalogueConf');
const LocalCache = require('../helpers/caching');
const Validate = require('../helpers/validate');
const cmpSpec = require('../helpers/compareSpecs.js');
const markDown = require('../helpers/markDownGeneration.js');
const asciiDoc = require('../helpers/asciiDocGeneration.js');
const controllerCmp = require('../helpers/controllerCompliance.js');
const axios = require('axios');

function checkFolderExists(folderName){
    // Check that the folder exists and create it if it does not
    var dirPath = process.cwd() + path.sep + folderName;
    if (!fs.existsSync(dirPath)){
         fs.mkdirSync(dirPath);
         console.log('Directory created ', dirPath)
    }
}

function getKeyFromName(name){
  // Get the Key - from a file name - usually made up of three characters followed by three numbers such as TMF678
  // The first three letters are the Catalogue which could be two characters
  let result = name; // Default name
  // Try to the the key based on the catalougues and only use the above if no match found in the catalogues
  let catalogueNames = catalog.findCatalogueNames();
  catalogueNames.forEach(function (catName){ // Ideally use the name based on the catalogue
    if(name.startsWith(catName)){
      result = name.substring(0, catName.length + 3); 
    }
  });
  return result;
}


function deleteOldestFile(folderName){
    // Delete the oldest file in the folder
    var dirPath = process.cwd() + path.sep + folderName;
    if (fs.existsSync(dirPath)){
         let files = fs.readdirSync(dirPath);
         if(files.length > 20){
           // Sort the files
           files.sort(function(a, b) {
                         return fs.statSync(dirPath + a).mtime.getTime() - 
                                fs.statSync(dirPath + b).mtime.getTime();
                     });
           // Remove the oldest three files
           fs.unlinkSync(dirPath + path.sep + files[0]);
           fs.unlinkSync(dirPath + path.sep + files[1]);
           fs.unlinkSync(dirPath + path.sep + files[2]);
          }
    }
}

// Output responseJson to a file in Json and Mark Down - will output any Json
exports.WritetoConsole = function (responseJson) {
    if(responseJson.statusMessage){
      if (responseJson.compliance === 2) console.log(chalk.green(responseJson.statusMessage));
      else if (responseJson.compliance === 1) console.log(chalk.yellow(responseJson.statusMessage));
      else console.log(chalk.red(responseJson.statusMessage));
    }

    // generate date
    let formattedDate;
    if(responseJson.Timestamp){
       formattedDate =
          responseJson.Timestamp.getDate() +
          '-' +
          (responseJson.Timestamp.getMonth() + 1) +
          '-' +
          responseJson.Timestamp.getFullYear() +
          '-' +
          Date.now();
      } else {
        const now = new Date();
        formattedDate = 
          now.getDate() +
          '-' +
          (now.getMonth() + 1) +
          '-' +
          now.getFullYear() +
          '-' +
          Date.now();
      }
    // build result file name and write result files
    const resultsFolder = 'results' + path.sep;
    const logFilename = 'sctk-result_' + '_' + formattedDate + '.json';
    // const logFilename = 'sctk-result_' + responseJson.apiName.split('-')[0] + '_' + formattedDate + '.json';
    const resultLocation = resultsFolder + logFilename;
    const resultMDLocation = resultsFolder + logFilename.replace('.json', '.md');
    const resultAsciiLocation = resultsFolder + logFilename.replace('.json', '.adoc');
    checkFolderExists(resultsFolder);
    deleteOldestFile(resultsFolder);
    console.log('Detailed output in: ' + resultLocation);
    // create result file with name
    fs.writeFileSync(resultLocation, JSON.stringify(responseJson, null, 2));
    console.log('Detailed MD output in: ' + resultMDLocation);
    fs.writeFileSync(resultMDLocation, markDown.generateMarkDown(responseJson));
    console.log('Detailed AsciiDoc output in: ' + resultAsciiLocation);
    fs.writeFileSync(resultAsciiLocation, asciiDoc.generate(responseJson));
};



/**
* Perform a compliance check between the official standard and a submitted local file
* 
* @param {string} lfs - the location of the official standard
* @param {string} rfs - the location of the local file to be checked
* @param {swagger object} lfsOfficialSwagger - the official stanard as a swagger file - optional param used in revalidation calls
* @param {boolean} noDisplay
* @returns {object} statusObject
*/
exports.performCLIComplianceCheck = async function (lfs, rfs, lfsOfficialSwagger, noDisplay) {
    console.log('Official release:[%s]', lfs);
    console.log('Supplied release: [%s]', rfs);

    //load the catalog exception rules - temporary fix
    //temporary because is a little too much to load the catalog just for the exception rules.
    new catalog();

    const rawStatusObj = fs.readFileSync(path.resolve(__dirname, '../utils/statusObj.json'));
    let statusObject = JSON.parse(rawStatusObj);

    statusObject.conformanceDetails.officialRelease.url = lfs;

    try {
        if(lfsOfficialSwagger){
            // No need to validate but need to set statusObject result attributes
            statusObject.apiName = lfsOfficialSwagger.conformanceDetails.officialRelease.title;
            statusObject.conformanceDetails.officialRelease = lfsOfficialSwagger.conformanceDetails.officialRelease;
        } else { 
            console.log('Validating Left swagger file:' + chalk.yellow('[%s]'), lfs);
            await helpers.validate.validateFileRequest(lfs, statusObject, 'lfs');
            statusObject.conformanceDetails.officialRelease.key = getKeyFromName(statusObject.conformanceDetails.officialRelease.key);
            console.log('Left swagger file validation complete');
        }

        console.log('Validating Right swagger file:' + chalk.yellow('[%s]'), rfs);
        await helpers.validate.validateFileRequest(rfs, statusObject, 'rfs');
        statusObject.conformanceDetails.suppliedRelease.key = getKeyFromName(statusObject.conformanceDetails.suppliedRelease.key);
        console.log('Right swagger file validation complete');

        statusObject = await controllerCmp.complianceCheck(statusObject);

    } catch (error) {
        statusObject.statusMessage = error.message;
        console.error(error.message);
    }
    // create compliance check response JSON

    let responseJSON = helpers.response.createResponse(statusObject);
    console.log('Compliance Check Complete');

    if(noDisplay !== 'true') this.WritetoConsole(responseJSON);
    return statusObject;
};

/**
* Perform a compliance check between the official standard taken from the Catalogue and a submitted local file
* 
* @param {string} APIKey - the API Key such as TMF666 
* @param {string} APIVersion - the official standard version
* @param {string} rfs - the location of the local file to be checked
* @param {string} version - the official standard version
* @param {boolean} noDisplay
* @returns {object} statusObject
*/
exports.performCLIComplianceCheckWithAPI = async function (APIKey, APIVersion, rfs, noDisplay) {
    console.log('Official release:[%s]', APIKey, ' version: ', APIVersion);
    console.log('Supplied release: [%s]', rfs);

    //load the catalog exception rules - temporary fix
    //temporary because is a little too much to load the catalog just for the exception rules.
    new catalog();

    const rawStatusObj = fs.readFileSync(path.resolve(__dirname, '../utils/statusObj.json'));
    let statusObject = JSON.parse(rawStatusObj);

    // try find reference to official swagger
    try {
        let tempStatusObject = await helpers.catConf.findCatalogueItem(APIKey, APIVersion, statusObject);
        statusObject.conformanceDetails.officialRelease = cmpSpec.clone(tempStatusObject.conformanceDetails.officialRelease);
        console.log('Official release found');
    } catch (errorStatusObject) {
        if(!errorStatusObject.message){
            errorStatusObject.message = 'API not found'
        }
        statusObject.statusMessage = errorStatusObject.message;
        console.error(errorStatusObject.message);
        return statusObject;
    }

    try {
        // No need to validate but need to set statusObject result attributes
        statusObject.apiName = statusObject.conformanceDetails.officialRelease.title;

        console.log('Validating Right swagger file:' + chalk.yellow('[%s]'), rfs);
        await helpers.validate.validateFileRequest(rfs, statusObject, 'rfs');
        console.log('Right swagger file validation complete');

        statusObject = await controllerCmp.complianceCheck(statusObject);

    } catch (error) {
        statusObject.statusMessage = error.message;
        console.error(error.message);
    }
    // create compliance check response JSON

    let responseJSON = helpers.response.createResponse(statusObject);
    console.log('Compliance Check Complete');

    if(noDisplay !== 'true') this.WritetoConsole(responseJSON);
    return statusObject;
};


