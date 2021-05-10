const catalog = require('../helpers/catalogueConf');

// made for assinging compliance value to results rules
// TODO: could add the performing of tests in here.

/**
 * 0 - Fail
 * 1 - Warning
 * 2 - Pass
 */

function getFailRules (openapi) {
  let failRules = [];

  if(openapi){
    failRules.push('edit-object-property-restriction');
    failRules.push('add-object-property-restriction');
    failRules.push('add-required-object-property');
    failRules.push('add-required-param');
    failRules.push('add-required-header');
    failRules.push('edit-array-items-type');
    failRules.push('edit-object-property-required');
    failRules.push('edit-object-property-type');
    failRules.push('edit-operation-id');
    failRules.push('edit-param-collection-format');
    failRules.push('edit-param-in');
    failRules.push('edit-param-required');
    failRules.push('edit-param-type');
    failRules.push('delete-object-property');
    failRules.push('delete-param');
    // Openapi specific rules below
    failRules.push('add-required-param-component-openapi');
    failRules.push('add-required-header-component-openapi');
    failRules.push('edit-param-required-component-openapi');
    failRules.push('edit-param-type-openapi');
    failRules.push('edit-param-type-component-openapi');
    failRules.push('edit-response-openapi');
  } else { // Swagger 2.0 rules
    failRules.push('edit-object-property-restriction');
    failRules.push('add-object-property-restriction');
    failRules.push('add-required-object-property');
    failRules.push('add-required-param');
    failRules.push('add-required-header');
    failRules.push('edit-array-items-type');
    failRules.push('edit-base-path');
    failRules.push('edit-object-property-required');
    failRules.push('edit-object-property-type');
    failRules.push('edit-operation-id');
    failRules.push('edit-param-collection-format');
    failRules.push('edit-param-in');
    failRules.push('edit-param-required');
    failRules.push('edit-param-type');
    failRules.push('delete-object-property');
    failRules.push('delete-param');
  }

  return failRules;
}

function getWarningRules (openapi) {
  let warningRules = [];

  if(openapi){
    warningRules.push('add-optional-object-property');
    warningRules.push('add-method');
    warningRules.push('add-optional-param');
    warningRules.push('add-path');
    warningRules.push('add-response');
    // Openapi specific rules below;
    warningRules.push('add-optional-param-component-openapi');
    warningRules.push('add-component-object-openapi');
    warningRules.push('add-security-openapi');
    warningRules.push('add-schema-openapi')
    warningRules.push('delete-component-object-openapi');
    warningRules.push('delete-schema-object-openapi');
    warningRules.push('edit-callback-openapi');
    warningRules.push('edit-component-object-openapi');
    warningRules.push('edit-method-servers-openapi');
    warningRules.push('edit-param-allowEmptyValue-openapi');
    warningRules.push('edit-requestbody-openapi');
    warningRules.push('edit-servers-openapi');
    warningRules.push('edit-servers-url-openapi');
  } else { // Swagger 2.0 rules
    warningRules.push('add-definition');
    warningRules.push('add-optional-object-property');
    warningRules.push('add-method');
    warningRules.push('add-optional-param');
    warningRules.push('add-path');
    warningRules.push('add-response');
  }

  return warningRules;
}
/*
var Exception={
    'ruleId': 'add-required-header',
    'message': '/resource (get) - Required header Authorization added',
    'path': '/resource',
    'method': 'get',
    'param': 'Authorization'
};
*/
/**
 * Method will compare two rules taking into account what to look into
 * @param {*} lfs       - left side rule
 * @param {*} rfs       - right side rule
 * @param {*} cRuleId   - compare rule id
 * @param {*} cMessage  - compare message
 * @param {*} cPath     - compare path
 * @param {*} cMethod   - compare method
 * @param {*} cParam    - compare parameter
 */
/*
function compareRules(lfs, rfs, cRuleId, cMessage, cPath, cMethod, cParam){
    let result = true;

    //all the rules disabled so return false
    if (!cRuleId && !cMessage && !cPath && !cMethod && !cParam)
        return false;

    let ruleResult      = false;
    let messageResult   = false;
    let pathResult      = false;
    let methodResult    = false;
    let paramResult     = false;

    if (lfs.ruleId==rfs.ruleId) ruleResult = true;
    if (lfs.message==rfs.message) messageResult = true;
    if (lfs.path==rfs.path) pathResult = true;
    if (lfs.method==rfs.method) methodResult = true;
    if (lfs.param==rfs.param) paramResult = true;

    if (cRuleId==true && ruleResult==false)
        return false;

    if (cMessage==true && messageResult==false)
        return false;

    if (cPath && !pathResult)
        return false;
        
    if (cMethod && !methodResult) 
        return false;

    if (cParam && !paramResult)
        return false;

    
    return result;
}
*/

/**
 * Method will negate!!!!!
 * @param {*} rule
 * @param {*} value
 */
function ruleFilterN (rule, value) {
  let result = true;
  if (Object.prototype.hasOwnProperty.call(rule, 'ruleId')) if (rule.ruleId != value.ruleId) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'message')) if (rule.message != value.message) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'path')) if (rule.path != value.path) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'method')) if (rule.method != value.method) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'param')) if (rule.param != value.param) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'property')) if (rule.property != value.property) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'previousBasePath'))
    if (rule.previousBasePath != value.previousBasePath) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'currentBasePath'))
    if (rule.currentBasePath != value.currentBasePath) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'previousType'))
    if (rule.previousType != value.previousType) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'currentType'))
    if (rule.currentType != value.currentType) result = false;

  //this will return all the elements that are not matching
  if (!result) return value;
}

function ruleFilter (rule, value) {
  let result = true;
  if (Object.prototype.hasOwnProperty.call(rule, 'ruleId')) if (rule.ruleId != value.ruleId) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'message')) if (rule.message != value.message) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'path')) if (rule.path != value.path) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'method')) if (rule.method != value.method) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'param')) if (rule.param != value.param) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'property')) if (rule.property != value.property) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'previousBasePath'))
    if (rule.previousBasePath != value.previousBasePath) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'currentBasePath'))
    if (rule.currentBasePath != value.currentBasePath) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'previousType'))
    if (rule.previousType != value.previousType) result = false;

  if (Object.prototype.hasOwnProperty.call(rule, 'currentType'))
    if (rule.currentType != value.currentType) result = false;

  if (result) {
    //if we have a match, extract the exceptionMessage and add it to the rule
    if (Object.prototype.hasOwnProperty.call(rule, 'exceptionMessage'))
      value['exceptionMessage'] = rule.exceptionMessage;

    return value;
  }
}

/**
 * Method will create new exception rules for each extension. This will prevent a warning being raised for every
 * extension that is being loaded but not used by the local market.
 * @param {*} statusObject - current status object
 * @param {*} expArr - array of exceptions
 */
function extensionExceptions (statusObject, expArr) {
  //check if any extension has been loaded
  if (Object.prototype.hasOwnProperty.call(statusObject.conformanceDetails.officialRelease, 'extensionKeys')) {
    statusObject.conformanceDetails.officialRelease.extensionKeys.forEach(extension => {
      let exceptionObj = {};

      //check if the extension is around the data model definitions
      if (extension.type == 'definition') {
        exceptionObj['ruleId'] = 'delete-definition';
        exceptionObj['path'] = extension.key;
        exceptionObj['exceptionMessage'] =
          'This definition is part of the Extension:[' +
          extension.extensionKey +
          '], ' +
          extension.extensionName +
          '.';
      }

      //add the newly created exception back in the array
      expArr.push(exceptionObj);
    });
  }

  return expArr;
}

/**
 * The method will identify if the current status object is listed in the API list and return true or false
 * Assumes statusObject key is of the form catalogue + number such as TMF639 - ignores any text after the number
 */
function exceptionAppliesTo(apiList, statusObject){
  let catalog = statusObject.key.substring(0,3);
  let key = statusObject.key.substring(3,6);
  //console.log(catalog, ' ', key, ' ', statusObject.key, ' ', statusObject.version)
  // If no version then it applies to all API versions for a catalog 
  const found = apiList.some(el => el.catalog.toLowerCase() === catalog.toLowerCase() && el.key === key && 
                                  (!el.version || (el.version && (el.version === statusObject.version || el.version === statusObject.version + '.0')) ) );
  return found;
}

/**
 * The method will remove the rules from the result where a dispensation or exception has been issued
 *
 * {*} statusObject.results.rules.errors
 */
function exceptionRules (statusObject) {
  let expArr;
  if(isOpenAPI(statusObject)){
    expArr = catalog.getExceptionRulesOAS3();
    console.log('Using Open API 3 exception rules');
  } else {
    expArr = catalog.getExceptionRules();
    console.log('Using Swagger exception rules');
  }

  //load any additional exception that is coming from the extensions
  expArr = extensionExceptions(statusObject, expArr);

  //if the appropriate errors&warnings arrays are not defined, there is nothing to filter
  if (
    !Object.prototype.hasOwnProperty.call(statusObject.results, 'rules') ||
    !Object.prototype.hasOwnProperty.call(statusObject.results.rules, 'errors')
  )
    return false;

  let exceptionsErrorsArr = [];
  let exceptionsWarningsArr = [];

  expArr.forEach(exception => {
    // If the exception rule does not have an applicable to or it is only applicable to certain versions then remove the rule
    if(!Object.prototype.hasOwnProperty.call(exception, 'applicableTo') || exceptionAppliesTo(exception.applicableTo, statusObject)){
      if (Object.prototype.hasOwnProperty.call(statusObject.results.rules, 'errors')) {
        //extract the rule from errors array
        let localExp = statusObject.results.rules.errors.filter(ruleFilter.bind(null, exception));

        if (localExp.length > 0) {
          //add the rule in our exceptions array
          exceptionsErrorsArr = exceptionsErrorsArr.concat(localExp);

          //remove the rules from the error array
          statusObject.results.rules.errors = statusObject.results.rules.errors.filter(ruleFilterN.bind(null, exception));
        }
      }

      if (Object.prototype.hasOwnProperty.call(statusObject.results.rules, 'warnings')) {
        //extract the rule from warnings array
        let localExp = statusObject.results.rules.warnings.filter(ruleFilter.bind(null, exception));

        if (localExp.length > 0) {
          //add the rule in our exceptions array
          exceptionsWarningsArr = exceptionsWarningsArr.concat(localExp);

          //remove the rules from the error array
          statusObject.results.rules.warnings = statusObject.results.rules.warnings.filter(
            ruleFilterN.bind(null, exception)
          );
        }
      }
    }
  });

  //Ammend the rule exception to the message
  exceptionsErrorsArr.forEach(element => {
    if (!Object.prototype.hasOwnProperty.call(element, 'message')) element['message'] = '';

    if (Object.prototype.hasOwnProperty.call(element, 'exceptionType'))
      element.message = element.exceptionMessage + ';' + element.message;

    // element.message = '[SCTK Rule Exception - as per decision ...];' + element.message;
  });

  //Ammend the rule exception to the message
  exceptionsWarningsArr.forEach(element => {
    if (!Object.prototype.hasOwnProperty.call(element, 'message')) element['message'] = '';

    if (Object.prototype.hasOwnProperty.call(element, 'exceptionType'))
      element.message = element.exceptionMessage + ';' + element.message;

    // element.message = '[SCTK Rule Exception - as per decision ...];' + element.message;
  });

  //add all the rules "ignored" to the warning array
  if (!Object.prototype.hasOwnProperty.call(statusObject.results.rules, 'infos'))
    statusObject.results.rules['infos'] = [];

  statusObject.results.rules.infos = statusObject.results.rules.infos
    .concat(exceptionsErrorsArr)
    .concat(exceptionsWarningsArr);

  return true;
}

/**
 *
 * @param {*} rules
 */
function extractRuleIds (rules) {
  let arr = [];

  //sanity check if the object doesn't exist
  if (rules === 'undefined') return arr;

  for (var index in rules) {
    arr.push(rules[index].ruleId);
  }

  return arr;
}

/**
 *
 * @param {*} statusObject
 * returns true if the current swagger release is openapi
 */
function isOpenAPI(statusObject){
  return statusObject.conformanceDetails.officialRelease.swaggerDef && 
        statusObject.conformanceDetails.officialRelease.swaggerDef.openapi
}

/**
 *
 * 0 - Fail
 * 1 - Warning
 * 2 - Pass
 *
 * @param {JSON} statusObject
 */
exports.assignComplianceValue = function (statusObject) {
  statusObject.compliance = 2;
  statusObject.statusMessage = 'Compliance test passed. ';

  //define fail and warrning rules
  let failRules = getFailRules(isOpenAPI(statusObject));
  let warningRules = getWarningRules(isOpenAPI(statusObject));

  let rulesResult = [];

  //remove all the exceptions
  exceptionRules(statusObject);


  //let errorsArr = exceptionRules(statusObject.results.rules.errors);
  //let warningsArr = exceptionRules(statusObject.results.rules.warnings);
  //let infosArr = exceptionRules(statusObject.results.rules.infos);

  //create an new error array
  //let finalErrors = [];
  //finalErrors = finalErrors.concat(errorsArr).concat(warningsArr);

  //statusObject.results.rules.finalErrors = finalErrors;

  //create one array with all the rules that have been touched
  rulesResult = rulesResult.concat(extractRuleIds(statusObject.results.rules.errors));
  rulesResult = [...new Set(rulesResult)];

  //do an intersection between two arrays (one with the failed rules and one with the results)
  let fails = rulesResult.filter(x => failRules.includes(x));
  if (fails.length != 0) {
    let uniqueFails = [...new Set(fails)];

    //if found, then fail the compliance level
    statusObject.compliance = 0; //FAIL
    let statusMessage = 'The following are breaking compatibility:';
    for (let index in uniqueFails) {
      statusMessage += '[' + uniqueFails[index] + ']';
    }
    statusMessage += ';';
    statusObject.statusMessage = statusMessage;
  }

  rulesResult = [];
  rulesResult = rulesResult.concat(extractRuleIds(statusObject.results.rules.warnings));
  rulesResult = [...new Set(rulesResult)];

  let warnings = rulesResult.filter(x => warningRules.includes(x));
  if (warnings.length != 0) {
    let uniqueWarnings = [...new Set(warnings)];
    //if the status is PASS(2) then change to warning, cause we hit a warning rule
    //otherwise that means the status is FAIL so we keep it as that
    if (statusObject.compliance == 2) statusObject.compliance = 1; //WARNING
    let statusMessage = 'The following are worth noting, but do not strictly break compatibility:';
    for (let index in uniqueWarnings) {
      statusMessage += '[' + uniqueWarnings[index] + ']';
    }
    statusMessage += ';';
    statusObject.statusMessage += statusMessage;
  }

  return statusObject.compliance;
};
