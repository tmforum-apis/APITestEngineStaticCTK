// Import helpers index containing references to the helpers.
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers/index');
const chalk = require('chalk');
const controllerCmp = require('../helpers/controllerCompliance.js');
const markDown = require('../helpers/markDownGeneration.js');
const asciiDoc = require('../helpers/asciiDocGeneration.js');
const elasticSearch = require('../helpers/elasticSearch.js');
const config = require(path.join(__dirname, '../../configuration', 'config.json'));

// POST file for compliance check
exports.checkFileCompliance = async function (req, res) {
  // create new status object
  //console.log('req=', req);
  let rawData = fs.readFileSync(path.resolve(__dirname, '../utils/statusObj.json'));
  let statusObject = JSON.parse(rawData);

  try {
    if (
      Object.prototype.hasOwnProperty.call(req, 'file') &&
      Object.prototype.hasOwnProperty.call(req.file, 'originalname')
    ) {
      console.log('Validating swagger file:' + chalk.yellow('[%s]'), req.file.originalname);
    }
    await helpers.validate.validateRequest(req, statusObject);
    console.log('Input swagger file is Valid');

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
      throw Error(errorStatusObject.statusMessage);
    } 
    
    statusObject = await controllerCmp.complianceCheck(statusObject);
    
  } catch (error) {
    statusObject.statusMessage = error.message;
    console.error(error);
    if (helpers.validate.isEmpty(statusObject.apiName) && Object.prototype.hasOwnProperty.call(req, 'file')) {
      statusObject.apiName = req.file.filename;
    }
  }

  let responseJSON;
  try {
    // create compliance check response JSON and generate markdown
    responseJSON = helpers.response.createResponse(statusObject);
    let uniqueAPIKey = `${responseJSON.market}-${responseJSON.key}-${responseJSON.version}`;
    responseJSON.uniqueAPIKey = uniqueAPIKey;
    if (Object.prototype.hasOwnProperty.call(req, 'body') &&
        Object.prototype.hasOwnProperty.call(req.body, 'generateMarkDown') &&
        req.body.generateMarkDown.toLowerCase() === 'true' ) {
        console.log('Returning mark down');
        responseJSON.markdownResults = markDown.generateMarkDown(responseJSON);
    }  
  } catch (error) {
    statusObject.statusMessage = error.message + ' when generating markdown';
    console.error(error.message);
    if (helpers.validate.isEmpty(statusObject.apiName) && Object.prototype.hasOwnProperty.call(req, 'file')) {
      statusObject.apiName = req.file.filename;
    }
  }

  try {
    // generate ascii doc
    if (Object.prototype.hasOwnProperty.call(req, 'body') &&
        Object.prototype.hasOwnProperty.call(req.body, 'generateAsciiDoc') &&
        req.body.generateAsciiDoc.toLowerCase() === 'true' ) {
        console.log('Returning Ascii Doc');
        responseJSON.asciiDocResults = asciiDoc.generate(responseJSON);
    }  
  } catch (error) {
    statusObject.statusMessage = error.message + ' when generating asciiDoc';
    console.error(error.message);
    if (helpers.validate.isEmpty(statusObject.apiName) && Object.prototype.hasOwnProperty.call(req, 'file')) {
      statusObject.apiName = req.file.filename;
    }
  }

  try {
    // Send to Elastic Search
    if (Object.prototype.hasOwnProperty.call(req, 'body') &&
        Object.prototype.hasOwnProperty.call(req.body, 'sendToElasticSearch') &&
        req.body.sendToElasticSearch.toLowerCase() === 'true' ) {
        console.log('Sending to Elastic Search');
        await elasticSearch.publishElasticSearchSingleResult(responseJSON, config.elasticDocUrlProd, 'checkFileAPI');
    }
  } catch (error) {
    statusObject.statusMessage = error.message + ' when writing to Elastic Search';
    console.error(error.message);
    if (helpers.validate.isEmpty(statusObject.apiName) && Object.prototype.hasOwnProperty.call(req, 'file')) {
      statusObject.apiName = req.file.filename;
    }
  }

  //console.log(responseJSON)
  res.send(responseJSON);
};
