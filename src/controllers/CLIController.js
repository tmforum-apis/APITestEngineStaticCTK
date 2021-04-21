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
const controllerCmp = require('../helpers/controllerCompliance.js');
const axios = require('axios');
const _ = require('underscore');
const jsondiffpatch = require('jsondiffpatch');

function checkFolderExists(folderName){
    // Check that the folder exists and create it if it does not
    var dirPath = process.cwd() + path.sep + folderName;
    if (!fs.existsSync(dirPath)){
         fs.mkdirSync(dirPath);
         console.log('Directory created ', dirPath)
    }
}

// Output responseJson to a file - will output any Json
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
    // build result file name
    const resultsFolder = 'results' + path.sep;
    const logFilename = 'sctk-result_' + '_' + formattedDate + '.json';
    // const logFilename = 'sctk-result_' + responseJson.apiName.split('-')[0] + '_' + formattedDate + '.json';
    const resultLocation = resultsFolder + logFilename;
    checkFolderExists(resultsFolder);
    console.log('Detailed output in: ' + resultLocation);
    // create result file with name
    fs.writeFileSync(resultLocation, JSON.stringify(responseJson, null, 2));
};


exports.performGenerateFlatFileWithExtension = async function (key, version) {
    if (Validate.isEmpty(key))
        throw Error('No API Key supplied. The API Key must be in the format <catalog>+<unique_identifier>, e.g. TMF678');

    if (Validate.isEmpty(version))
        throw Error('No API Version supplied. The API Key must be in the format <major.minor.patch> or <major.minor>, e.g. 4.0.0 or 3.2');

    console.log('Generating the flat swagger file with all the extensions for [%s]-[%s]', key, version);
    console.log('API Key: [%s]', key);
    console.log('API Version: [%s]', version);

    //load the catalog
    new catalog();

    const rawStatusObj = fs.readFileSync(path.resolve(__dirname, '../utils/statusObj.json'));
    let statusObject = JSON.parse(rawStatusObj);

    statusObject.conformanceDetails.officialRelease.url = '';
    statusObject.conformanceDetails.suppliedRelease.key = key;
    statusObject.conformanceDetails.suppliedRelease.version = version;

    let outputFileName = key + '-' + version + '-WithExtensions.swagger.json';

    // try find reference to official swagger
    try {
        let tempStatusObject = await helpers.catConf.findCatalogueItem(
            statusObject.conformanceDetails.suppliedRelease.key,
            statusObject.conformanceDetails.suppliedRelease.version,
            statusObject
        );
        statusObject.conformanceDetails.officialSwagger = tempStatusObject.conformanceDetails.officialSwagger;
        console.log('Official release found');
    } catch (errorStatusObject) {
        //throw Error(errorStatusObject.statusMessage);
        if(errorStatusObject.statusMessage)
            console.log('[performGenerateFlatFileWithExtension]-> Unable to find the definition: [%s]', errorStatusObject.statusMessage);
        else
            console.log('[performGenerateFlatFileWithExtension]-> Unable to find the definition: [%s]', errorStatusObject.message);
        return;
    } 

    let cacheKey = key + version;
    let result = LocalCache.getSpefication(cacheKey);
    if (result === undefined) {
        console.log('[performGenerateFlatFileWithExtension]-> Unable to find the definition: [%s]', cacheKey);
        return;
    }
    console.log('[performGenerateFlatFileWithExtension]-> Object found in cache records with key: [%s]', cacheKey);

    //console.log(JSON.stringify(mergedOutput));
    fs.writeFile(outputFileName, JSON.stringify(result.swaggerDef), function (err) {
        if (err) return console.log(err);
    });

    console.log();
    console.log();
    console.log('Successfully generated the flat swagger file:[%s]', outputFileName);
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
            console.log('Left swagger file validation complete');
        }

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


