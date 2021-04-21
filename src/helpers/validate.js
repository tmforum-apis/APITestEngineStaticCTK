const fs = require('fs');
const path = require('path');
const cmpSpec = require('./compareSpecs.js');
const loadSpec = require('./loadSpecs');


class Validate {
  /**
   * Method val
   * @param {JSON} swaggerDef
   */
  static async validateSwaggerDef (swaggerDef) {
    // validate the swagger file
    try {
      await cmpSpec.validateObj(swaggerDef);
    } catch (error) {
      let errorMessage = `[validateCheckFileInput]->Supplied file is invalid: [${error.message}]`;
      throw Error(errorMessage);
    }
  }

  /**
   * Method to validate input of a request
   * @param {*} req
   * @param {*} statusObject
   */
  static async validateRequest (req, statusObject) {
    if (!Object.prototype.hasOwnProperty.call(req, 'file')) {
      throw Error('Invalid request: No file');
    }

    if (!Object.prototype.hasOwnProperty.call(req, 'body')) {
      throw Error('Invalid request: Missing body');
    }

    if (!Object.prototype.hasOwnProperty.call(req.body, 'key')) {
      throw Error('Invalid request: Missing key');
    }

    // To be removed...
    if (!Object.prototype.hasOwnProperty.call(req.body, 'market')) {
      throw Error('Invalid request: Missing market');
    }

    // add request input to statusObject
    statusObject.conformanceDetails.suppliedRelease.key = req.body.key;
    statusObject.conformanceDetails.suppliedRelease.market = req.body.market;
    statusObject.conformanceDetails.suppliedRelease.url = req.body.url;
    statusObject.market = req.body.market;

    try {
      //load the specification in either formats JSON or YAML and turn it into a JSON object
      statusObject.conformanceDetails.suppliedRelease.swaggerDef = loadSpec.loadJsonOrYaml(
        req.file.buffer.toString('utf8')
      );
    } catch (error) {
      throw Error('Invalid swagger file');
    }

    // pull url, title, description and version from the swagger file

    // version
    if (!statusObject.conformanceDetails.suppliedRelease.swaggerDef.info.version) {
      throw Error('Unable to find version within the swagger file');
    }

    // assign status object api version
    statusObject.conformanceDetails.suppliedRelease.version =
      statusObject.conformanceDetails.suppliedRelease.swaggerDef.info.version;

    // title
    if (!statusObject.conformanceDetails.suppliedRelease.swaggerDef.info.title) {
      throw Error('Unable to find title within the swagger file');
    }
    statusObject.conformanceDetails.suppliedRelease.title =
      statusObject.conformanceDetails.suppliedRelease.swaggerDef.info.title;

    // description
    if (!statusObject.conformanceDetails.suppliedRelease.swaggerDef.info.description) {
      statusObject.conformanceDetails.suppliedRelease.description = 'No description content was supplied';
      console.log('No description content was supplied');
    }

    statusObject.conformanceDetails.suppliedRelease.description =
      statusObject.conformanceDetails.suppliedRelease.swaggerDef.info.description;

    // Build status object
    statusObject.key = statusObject.conformanceDetails.suppliedRelease.key;
    statusObject.apiName = statusObject.conformanceDetails.suppliedRelease.title;
    statusObject.version = statusObject.conformanceDetails.suppliedRelease.version;

    // validate swagger file
    let swaggerDefClone = cmpSpec.clone(statusObject.conformanceDetails.suppliedRelease.swaggerDef);
    await this.validateSwaggerDef(swaggerDefClone);
    return statusObject;
  }

  /**
   * Method to validate a file path and populate accordingly the statusObject
   * @param {*} file
   * @param {*} statusObject
   * @param {*} type=lfs or rhs
   */
  static async validateFileRequest (file, statusObject, type) {
    //release object
    let release = this.createRelease('', '', '', '', '', {});

    // get file
    try {
      const rawLfs = fs.readFileSync(path.resolve(file));
      release.swaggerDef = loadSpec.loadJsonOrYaml(rawLfs);
      //console.log(`Successfully read file: ${file}`);
    } catch (error) {
      throw Error(`Invalid swagger file: ${file}`);
    }

    // validate swagger file
    let swaggerDefClone = cmpSpec.clone(release.swaggerDef);
    await this.validateSwaggerDef(swaggerDefClone);

    // add to release
    release.url = path.resolve(file);
    release.key = path.basename(file);
    release.market = 'CLIMode';
    statusObject.market = 'CLIMode';

    // version
    if (!release.swaggerDef.info.version) {
      throw Error('Unable to find version within the swagger file');
    }
    release.version = release.swaggerDef.info.version;

    // title
    if (!release.swaggerDef.info.title) {
      throw Error('Unable to find title within the swagger file');
    }
    release.title = release.swaggerDef.info.title;

    // description
    if (!release.swaggerDef.info.description) {
      release.description = 'No description content was supplied';
    }
    release.description = release.swaggerDef.info.description;

    // Build API Name
    statusObject.apiName = path.basename(file);

    if (type == 'lfs') statusObject.conformanceDetails.officialRelease = cmpSpec.clone(release);
    else statusObject.conformanceDetails.suppliedRelease = cmpSpec.clone(release);

    return statusObject;
  }

  static createRelease (iUrl, iKey, iTitle, iDescription, iVersion, iSwaggerDef) {
    let obj = {
      url: iUrl,
      key: iKey,
      title: iTitle,
      description: iDescription,
      version: iVersion,
      swaggerDef: iSwaggerDef
    };

    return obj;
  }

  static isEmpty (val) {
    return !!(val === undefined || val == null || val.length <= 0);
  }
    
}

module.exports = Validate;
