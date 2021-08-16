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
const utilities = require('../utils/utilities.js');


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



// Output responseJson to a file in Json and Mark Down and asciiDoc - will output any Json
exports.outputFiles = function (responseJson, output) {
  if(output){
    switch(output.toUpperCase()){
      case 'ALL': 
        utilities.writetoFileResDir(JSON.stringify(responseJson, null, 2), 'json', 'json');
        utilities.writetoFileResDir(markDown.generateMarkDown(responseJson), 'md', 'md');
        utilities.writetoFileResDir(asciiDoc.generate(responseJson), 'adoc', 'adoc');
        break;
      case 'JSON': 
        utilities.writetoFileResDir(JSON.stringify(responseJson, null, 2), 'json', 'json');
        break;
      case 'MD': 
        utilities.writetoFileResDir(markDown.generateMarkDown(responseJson), 'md', 'md');
        break;
      case 'ASCIIDOC': 
        utilities.writetoFileResDir(asciiDoc.generate(responseJson), 'adoc', 'adoc');
        break;
      default: /* no file generated */
        break;
    }
  }
}


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
* @param {string} output - the type of file to supported
* @returns {object} statusObject
*/
exports.performCLIComplianceCheck = async function (lfs, rfs, lfsOfficialSwagger, output) {
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

    let responseJson = helpers.response.createResponse(statusObject);
    console.log('Compliance Check Complete');
    if(responseJson.statusMessage){
      if (responseJson.compliance === 2) console.log(chalk.green(responseJson.statusMessage));
      else if (responseJson.compliance === 1) console.log(chalk.yellow(responseJson.statusMessage));
      else console.log(chalk.red(responseJson.statusMessage));
    }

    this.outputFiles(responseJson, output);
    return statusObject;
};

/**
* Perform a compliance check between the official standard taken from the Catalogue and a submitted local file
* 
* @param {string} APIKey - the API Key such as TMF666 
* @param {string} APIVersion - the official standard version
* @param {string} rfs - the location of the local file to be checked
* @param {string} version - the official standard version
* @param {string} output - the type of file to supported
* @returns {object} statusObject
*/
exports.performCLIComplianceCheckWithAPI = async function (APIKey, APIVersion, rfs, ignore, output) {
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
        statusObject.conformanceDetails.officialRelease = await cmpSpec.clone(tempStatusObject.conformanceDetails.officialRelease);
        console.log('Official release found');
    } catch (errorStatusObject) {
        if(!errorStatusObject.message){
            errorStatusObject.message = 'Official release API not found'
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

    let responseJson = helpers.response.createResponse(statusObject);
    console.log('Compliance Check Complete');
    if(responseJson.statusMessage){
      if (responseJson.compliance === 2) console.log(chalk.green(responseJson.statusMessage));
      else if (responseJson.compliance === 1) console.log(chalk.yellow(responseJson.statusMessage));
      else console.log(chalk.red(responseJson.statusMessage));
    }

    this.outputFiles(responseJson, output);
    return statusObject;
};


