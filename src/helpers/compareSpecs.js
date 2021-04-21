const path = require('path');
const chalk = require('chalk');
const SwaggerParser = require('swagger-parser');
var SwaggerDiff = require('../custom/swagger-diff');
var jsondiffpatch = require('jsondiffpatch');
// const util = require('util');
var fs = require('fs');
const converter = require('swagger2openapi');

const validateOptions = {
  parse: {
    json: true, // Disable the JSON parser
    yaml: {
      allowEmpty: false // Don't allow empty YAML files
    },
    text: {
      canParse: ['.txt', '.html'], // Parse .txt and .html files as plain text (strings)
      encoding: 'utf16' // Use UTF-16 encoding
    }
  },
  resolve: {
    external: true
  },
  dereference: {
    circular: true // Don't allow circular $refs
  },
  validate: {
    spec: true, // Don't validate against the Swagger spec
    schema: true
  }
};

/**
 * Perform a validation of the swagger file but using future&promise (async)
 *
 * @param {type} swaggerFile    - input file location
 * @return
 */
function validateSwaggerAsync (swaggerFile) {
  var file = path.resolve(process.cwd(), swaggerFile);
  // var rootFolder = path.dirname(file);

  var promise = new Promise(function (resolve, reject) {
    SwaggerParser.validate(file, validateOptions)
        .then(function (api) {
          resolve(api);
        })
        .catch(function (err) {
          //        console.error(err);
          // console.log(chalk.red('------------->: [!!!NOT VALID!!! - Please resolve the above errors ]'));
          reject(Error(err));
        });
  });

  return promise;
}

/**
 * Perform a validation of swagger object
 *
 * @param {type} obj
 * @return {undefined}
 */
async function validateSwaggerObj (obj) {
  try {
    await SwaggerParser.validate(obj, validateOptions);
  } catch (error) {
    // cleaning the error message
    throw Error(`API is invalid. ${error.message}`);
  }
  // return SwaggerParser.validate(obj, validateOptions)
  //   .then(function (api) {
  //   // console.log('API name: %s, Version: %s: [%s]', api.info.title, api.info.version, chalk.green('VALID'));
  //     return api;
  //   })
  //   .catch(function (err) {
  //     console.log(`\nError validating swagger object:\n`);
  //     console.error(err);
  //     // console.log(chalk.red('------------->: [!!!NOT VALID!!! - Please resolve the above errors ]'));
  //     throw err;
  //   });
}

/**
 * Perform a validation of swagger file
 *
 * @param {type} swaggerFile
 * @return {undefined}
 */
function validateSwaggerSync (swaggerFile) {
  var file = path.resolve(process.cwd(), swaggerFile);

  console.log('Validating the swagger file: '+file);

  SwaggerParser.validate(file, validateOptions)
      .then(function (api) {
        console.log('API name: %s, Version: %s: [%s]', api.info.title, api.info.version, chalk.green('VALID'));
      })
      .catch(function (err) {
        // console.error(err);
        // console.log(chalk.red('------------->: [!!!NOT VALID!!! - Please resolve the above errors ]'));
        return err;
      });
}

function getSwaggerVersion (swagDef) {
  if (swagDef && swagDef.swagger) {
    return swagDef.swagger;
  } else if (swagDef && swagDef.openapi) {
    return swagDef.openapi;
  } else {
    console.log('Swagger Type not found!');
  }
  return undefined;
}

function getSwaggerFileType (swagDef) {
  if (swagDef && swagDef.swagger) {
    return 'swagger';
  } else if (swagDef && swagDef.openapi) {
    return 'openapi';
  } else {
    console.log('Swagger Type not found!');
  }
  return undefined;
}

/**
 * The method will compare the 2 swagger definition versions to ensure that they are both the same, e.g. both OpenAPI v3
 * However, it does allow the lfs side to be swagger 2.X and the rfs to be 3.X 
 * @param {*} lfs
 * @param {*} rfs
 */
function checkSwaggerVersions (lfs, rfs) {
  let lfsType = getSwaggerFileType(lfs);
  let rfsType = getSwaggerFileType(rfs);
  if (!lfsType || !rfsType || (lfsType != rfsType && lfsType !== 'swagger' && rfsType !== 'openapi' )) {
    throw new Error('Swagger types do not match with lfs set to ' + lfsType + ' and rfs set to ' + rfsType);
  }
  let lfsTypeVer = getSwaggerVersion(lfs);
  let rfsTypeVer = getSwaggerVersion(rfs);
  if (!lfsTypeVer || !rfsTypeVer || (lfsTypeVer != rfsTypeVer && !lfsTypeVer.startsWith('2') && !rfsTypeVer.startsWith('3') )) {
    throw new Error('Swagger versions do not match with lfs set to ' + lfsTypeVer + ' and rfs set to ' + rfsTypeVer);
  }
}



/**
 * The method will compare the 2 swagger definition versions to  allow the lfs side to be swagger 2.X and the rfs to be 3.X 
 * @param {*} lfs
 * @param {*} rfs
 * @result {boolean} 
 */
function versionsSupportSwagger2OpenAPI (lfs, rfs) {
  let lfsType = getSwaggerFileType(lfs);
  let rfsType = getSwaggerFileType(rfs);
  let lfsTypeVer = getSwaggerVersion(lfs);
  let rfsTypeVer = getSwaggerVersion(rfs);
  return  ( lfsType === 'swagger' && lfsTypeVer.startsWith('2') && rfsType === 'openapi' && rfsTypeVer.startsWith('3'));
}



/**
 * The method will convert  lfs side to openApi  3.0
 * @param {*} swagger
 * @result {object} 
 */
async function convertSwagger2OpenAPI (swagger) {
  try {
    return await converter.convertObj(swagger, {direct: true});
  }
  catch (error){
    throw error;
  }
}


/**
 * Method will compare 2 swagger definitions using the jsonDiffPatch mechanism
 * @param {*} lfs
 * @param {*} rgs
 * @param {boolean} fileBased
 */
function compareUsingDiffPatch (lfs, rgs, fileBased) {
  var options = {
    objectHash: function (obj, index) {
      // try to find an id property, otherwise just use the index in the array
      return obj.name || obj.id || obj._id || '$$index:' + index;
    },
    arrays: {
      // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
      detectMove: true,
      // default false, the value of items moved is not included in deltas
      includeValueOnMove: false
    },
    textDiff: {
      // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
      minLength: 60
    },
    htmlDiff: {},
    // TODO: argument context was never used
    propertyFilter: function (name) {
      // this optional function can be specified to ignore object properties (eg. volatile data)
      // name: property name, present in either context.left or context.right objects
      // context: the diff context (has context.left and context.right objects)
      return name.slice(0, 1) !== '$';
    },
    cloneDiffValues: false // default false. if true, values in the obtained delta will be cloned
    // (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects. this becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
    // instead of true, a function can be specified here to provide a custom clone(value)
  };

  var jsondiffpatchInstance = jsondiffpatch.create(options);

  let swaggerOrig;
  let swaggerModif;
  if (fileBased) {
    var rawdata = fs.readFileSync(lfs, 'utf8');
    swaggerOrig = JSON.parse(rawdata);
    rawdata = fs.readFileSync(rgs, 'utf8');
    swaggerModif = JSON.parse(rawdata);
  } else {
    swaggerOrig = lfs;
    swaggerModif = rgs;
  }

  //TODO: reject never handled
  var promise = new Promise(function (resolve) {
    var delta = jsondiffpatchInstance.diff(swaggerOrig, swaggerModif);
    // console.log(util.inspect(delta, false, null, true));
    if (delta === undefined) {
      console.log('There is no difference between the two files');
      delta = {};
      delta['info'] = {};
      delta.info['description'] = 'There is no difference between the two files';
    }
    resolve(delta);
  });
  return promise;
}

/**
 * The method will compare the 2 swagger definitions using the Swagger-Diff mechanism
 * @param {*} lfs
 * @param {*} rgs
 */
function compareUsingSwaggerDiff (lfs, rgs) {
  return SwaggerDiff(lfs, rgs);
}

module.exports = {
  validate: function (swaggerFile) {
    return validateSwaggerSync(swaggerFile);
  },
  validateObj: function (obj) {
    return validateSwaggerObj(obj);
  },
  validateAsync: function (swaggerFile) {
    return validateSwaggerAsync(swaggerFile);
  },
  checkSwaggerVersions: function (lfs, rgs) {
    return checkSwaggerVersions(lfs, rgs);
  },
  versionsSupportSwagger2OpenAPI: function (lfs, rgs) {
    return  versionsSupportSwagger2OpenAPI(lfs, rgs);
  },
  convertSwagger2OpenAPI: function (swagger) {
    return convertSwagger2OpenAPI(swagger);
  },
  compareUsingSwaggerDiff: function (lfs, rgs) {
    return compareUsingSwaggerDiff(lfs, rgs);
  },
  compareUsingDiffPatch: function (lfs, rgs, fileBased) {
    return compareUsingDiffPatch(lfs, rgs, fileBased);
  },
  clone: function (obj) {
    return jsondiffpatch.clone(obj);
  },
  getSwaggerVersion: function (swagDef) {
    return getSwaggerVersion(swagDef);
  }
};
