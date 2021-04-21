const path = require('path');
const config = require(path.join(__dirname, '../../configuration', 'config.json'));
let uuid = require('uuid/v1');

exports.clean = function (obj) {
  for (var propName in obj) {
    if (typeof obj[propName] === 'object') {
      this.clean(obj[propName]);
    }
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName];
    } // this added to remove also the empty objects - we should check if we want or not
    // else if (Object.entries(obj[propName]).length === 0 && obj.constructor === Object) {
    //   delete obj[propName];
    // }
  }
};

// /**
//  * Function will create the response but will strip out the the depthDiff due to a bug
//  * in Grafana dashboard
//  * @param {JSON} statusObject
//  */
// exports.grafanaResponse = function (statusObject) {
//     let response = this.createResponse(statusObject);

//     //remove the depthDiff part
//     //if (Object.prototype.hasOwnProperty.call(response.results, 'depthDiff'))
//     //    delete response.results.depthDiff;

//     return response;
// };

/**
 * Function adds timestamp and executionID to the response for elasticsearch.
 *
 * The function also removes any empty values in statusObject
 * @param {JSON} statusObject
 */
exports.createResponse = function (statusObject) {
  // Defining dynamic variables of TimeStamp, ExecutionID, APIName & CountryCode
  const timeStamp = new Date(); // Assigning the TimeStamp
  const executionID = uuid(); // Generate UUID and assign to ExecutionID

  //get the release version from the configuration file
  if (Object.prototype.hasOwnProperty.call(config, 'release')) statusObject.release = config.release;
  else statusObject.release = '0.0.1';

  var responseJson = statusObject;
  responseJson.Timestamp = timeStamp;
  responseJson.executionID = executionID;

  //remove the swagger objects from the response if they are defined
  if (Object.prototype.hasOwnProperty.call(responseJson.conformanceDetails.officialRelease, 'swaggerDef'))
    delete responseJson.conformanceDetails.officialRelease.swaggerDef;

  if (Object.prototype.hasOwnProperty.call(responseJson.conformanceDetails.suppliedRelease, 'swaggerDef'))
    delete responseJson.conformanceDetails.suppliedRelease.swaggerDef;

  // clean the payload of empty fields
  this.clean(responseJson);

  return responseJson;
};
