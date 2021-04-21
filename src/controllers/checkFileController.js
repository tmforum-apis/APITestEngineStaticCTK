// Import helpers index containing references to the helpers.
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers/index');
const chalk = require('chalk');
const controllerCmp = require('../helpers/controllerCompliance.js');

// POST file for compliance check
exports.checkFileCompliance = async function (req, res) {
  // create new status object
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

  // create compliance check response JSON
  let responseJSON = helpers.response.createResponse(statusObject);
  let uniqueAPIKey = `${responseJSON.market}-${responseJSON.key}-${responseJSON.version}`;
  responseJSON.uniqueAPIKey = uniqueAPIKey;
  // console.log(responseJSON)
  res.send(responseJSON);
};
