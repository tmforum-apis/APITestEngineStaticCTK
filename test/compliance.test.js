const fs = require('fs');
const path = require('path');
const utils = require('jsondiffpatch');
var compliance = require('../src/helpers/compliance.js');
var CatalogueConf = require('../src/helpers/catalogueConf.js');

/**
 * Method will generate a fail rule
 * @param {} type
 * 0 - Fail
 * 1 - Warning
 */
function generateRule (ruleId) {
  let ruleEntry = {
    ruleId: '',
    message: 'A message',
    previousHost: 'A previous value',
    currentHost: 'A current value'
  };
  let entry = utils.clone(ruleEntry);

  entry.ruleId = ruleId; //'add-required-object-property';

  return entry;
}

describe('Rules array setup', () => {
  test('Fail rules test', () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    statusObject.results.rules = [];
    statusObject.results.rules['errors'] = [];
    //statusObject.results.rules['warnings']=[];
    //statusObject.results.rules['infos']=[];
    //statusObject.results.rules['unmatchDiffs']=[];

    statusObject.results.rules.errors.push(generateRule('add-required-object-property'));

    let complianceResult = compliance.assignComplianceValue(statusObject);
    expect(complianceResult).toBe(0);
    expect(statusObject.statusMessage).toMatch(
      'The following are breaking compatibility:[add-required-object-property];'
    );
    console.log(statusObject);
  });

  test('Warning rules test', () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    statusObject.results.rules = [];
    //statusObject.results.rules['errors']= [];
    statusObject.results.rules['warnings'] = [];
    //statusObject.results.rules['infos']=[];
    //statusObject.results.rules['unmatchDiffs']=[];

    statusObject.results.rules.warnings.push(generateRule('add-definition'));

    let complianceResult = compliance.assignComplianceValue(statusObject);
    expect(complianceResult).toBe(1);
    expect(statusObject.statusMessage).toContain(
      'Compliance test passed. The following are worth noting, but do not strictly break compatibility:[add-definition];'
    );
  });

  test('Fails and Warnings rules test', () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    statusObject.results.rules = [];
    statusObject.results.rules['errors'] = [];
    statusObject.results.rules['warnings'] = [];
    //statusObject.results.rules['infos']=[];
    //statusObject.results.rules['unmatchDiffs']=[];

    statusObject.results.rules.errors.push(generateRule('add-required-object-property'));
    statusObject.results.rules.warnings.push(generateRule('add-definition'));

    let complianceResult = compliance.assignComplianceValue(statusObject);
    expect(complianceResult).toBe(0);
    expect(statusObject.statusMessage).toMatch(
      'The following are breaking compatibility:[add-required-object-property];The following are worth noting, but do not strictly break compatibility:[add-definition];'
    );
  });

  test('Ignore rule Authorization header but fail', () => {
    //load the exception rules
    new CatalogueConf();

    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    //create the rules arrays
    statusObject.results.rules = [];
    statusObject.results.rules['errors'] = [];
    statusObject.results.rules['warnings'] = [];
    statusObject.results.rules['infos'] = [];
    statusObject.results.rules['unmatchDiffs'] = [];

    //create the authorization rule header
    let authHeaderRule = generateRule('add-required-header');
    authHeaderRule.param = 'Authorization';

    //create the edit base path rule
    let editBasePathRule = generateRule('edit-base-path');

    statusObject.results.rules.errors.push(authHeaderRule);
    statusObject.results.rules.errors.push(authHeaderRule);
    statusObject.results.rules.errors.push(editBasePathRule);
    statusObject.results.rules.warnings.push(generateRule('add-optional-header'));
    statusObject.results.rules.warnings.push(generateRule('delete-definition'));

    let complianceResult = compliance.assignComplianceValue(statusObject);
    expect(complianceResult).toBe(0);
    expect(statusObject.statusMessage).toMatch(
      'The following are breaking compatibility:[edit-base-path];'
    );
  });

  test('Ignore rule Authorization header (only rule) pass)', () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    //create the rules arrays
    statusObject.results.rules = [];
    statusObject.results.rules['errors'] = [];
    statusObject.results.rules['warnings'] = [];
    statusObject.results.rules['infos'] = [];
    statusObject.results.rules['unmatchDiffs'] = [];

    //create the authorization rule header
    let authHeaderRule = generateRule('add-required-header');
    authHeaderRule.param = 'Authorization';

    statusObject.results.rules.errors.push(authHeaderRule);
    statusObject.results.rules.errors.push(authHeaderRule);
    statusObject.results.rules.warnings.push(generateRule('delete-definition'));

    let complianceResult = compliance.assignComplianceValue(statusObject);
    expect(complianceResult).toBe(2);
    expect(statusObject.statusMessage).toMatch('Compliance test passed. ');
  });

  test('Fails and Warnings rules test OAS3', () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);
    // Set type to be openapi
    statusObject.conformanceDetails.officialRelease.swaggerDef.openapi = 1;

    statusObject.results.rules = [];
    statusObject.results.rules['errors'] = [];
    statusObject.results.rules['warnings'] = [];
    statusObject.results.rules['infos']=[];
    //statusObject.results.rules['unmatchDiffs']=[];

    statusObject.results.rules.errors.push(generateRule('add-required-object-property'));
    statusObject.results.rules.warnings.push(generateRule('add-schema-openapi'));

    let complianceResult = compliance.assignComplianceValue(statusObject);
    expect(complianceResult).toBe(0);
    expect(statusObject.statusMessage).toMatch(
      'The following are breaking compatibility:[add-required-object-property];The following are worth noting, but do not strictly break compatibility:[add-schema-openapi];'
    );
  });

  test('Ignore rule Authorization header and Content-Type  pass OAS3', () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);
    // Set type to be openapi
    statusObject.conformanceDetails.officialRelease.swaggerDef.openapi = 1;

    //create the rules arrays
    statusObject.results.rules = [];
    statusObject.results.rules['errors'] = [];
    statusObject.results.rules['warnings'] = [];
    statusObject.results.rules['infos'] = [];
    statusObject.results.rules['unmatchDiffs'] = [];

    //create the authorization rule header
    let authHeaderRule = generateRule('add-required-header-component-openapi');
    authHeaderRule.param = 'Authorization';
    let contentHeaderRule = generateRule('add-required-header-component-openapi');
    contentHeaderRule.param = 'Content-Type';

    statusObject.results.rules.errors.push(authHeaderRule);
    statusObject.results.rules.errors.push(contentHeaderRule);
    statusObject.results.rules.warnings.push(generateRule('delete-definition'));

    let complianceResult = compliance.assignComplianceValue(statusObject);
    expect(complianceResult).toBe(2);
    expect(statusObject.statusMessage).toMatch('Compliance test passed. ');
  });

  test('Ignore rule edit-response-openapi OAS3', () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);
    // Set type to be openapi
    statusObject.conformanceDetails.officialRelease.swaggerDef.openapi = 1;

    //create the rules arrays
    statusObject.results.rules = [];
    statusObject.results.rules['errors'] = [];
    statusObject.results.rules['warnings'] = [];
    statusObject.results.rules['infos'] = [];
    statusObject.results.rules['unmatchDiffs'] = [];

    //create the authorization rule header
    let rule = generateRule('edit-response-openapi');
    rule.path = "/hub";
    rule.method = "post";
    rule.previousResponse = "#/definitions/Hub";
    rule.currentResponse = "#/definitions/EventSubscription";
    rule.exceptionMessage = "[SCTK Rule Exception - #008]";

    statusObject.results.rules.errors.push(rule);
    statusObject.results.rules.warnings.push(generateRule('delete-definition'));

    let complianceResult = compliance.assignComplianceValue(statusObject);
    expect(complianceResult).toBe(2);
    expect(statusObject.statusMessage).toMatch('Compliance test passed.');
  });

});
