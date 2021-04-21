'use strict';
// Import helpers index containing references to the helpers.
const helpers = require('../helpers/index');
const cmpSpec = require('../helpers/compareSpecs.js');

/**
* Perform a compliance check given a status object
* 
* @param {object} statusObject - the status object with details of the files to be validated
* @returns {object} statusObject
*/
exports.complianceCheck = async function (statusObject){
	try{
		helpers.cmpSpec.checkSwaggerVersions(
            statusObject.conformanceDetails.officialRelease.swaggerDef,
            statusObject.conformanceDetails.suppliedRelease.swaggerDef
        );

        if(helpers.cmpSpec.versionsSupportSwagger2OpenAPI(
            statusObject.conformanceDetails.officialRelease.swaggerDef,
            statusObject.conformanceDetails.suppliedRelease.swaggerDef)){
            console.log('Left file (Official release) is swagger but Right file is OpenAPI so convert Left file and then compare');
            let converted = await helpers.cmpSpec.convertSwagger2OpenAPI(statusObject.conformanceDetails.officialRelease.swaggerDef);
            console.log('Converted Left file (Official release) to OpenAPI - use swagger2openapi package locally to view differences');
            statusObject.conformanceDetails.officialRelease.swaggerDef = converted;
        }

        // run diff tests on swagger objects
        try {
            let results = await Promise.all([
                helpers.cmpSpec.compareUsingSwaggerDiff(
                    statusObject.conformanceDetails.officialRelease.swaggerDef,
                    statusObject.conformanceDetails.suppliedRelease.swaggerDef
                ),
                helpers.cmpSpec.compareUsingDiffPatch(
                    statusObject.conformanceDetails.officialRelease.swaggerDef,
                    statusObject.conformanceDetails.suppliedRelease.swaggerDef
                )
            ]);
            statusObject.results.rules = results[0];
            //console.dir(results[0], {'maxArrayLength': null});

            statusObject.results.depthDiff = results[1];
        } catch (error) {
            throw Error('Error performing difference tests');
        }
        // get compliance value
        try {
            // TODO: make function that returns the compliance value for the given results rules
            statusObject.version = statusObject.conformanceDetails.suppliedRelease.version;
            statusObject.key = statusObject.conformanceDetails.suppliedRelease.key;
            helpers.compliance.assignComplianceValue(statusObject);
        } catch (error) {
            throw Error('Error assigning compliance level');
        }
	} catch (error) {
            throw new Error(error.message);
    }

    return statusObject;
	
};
