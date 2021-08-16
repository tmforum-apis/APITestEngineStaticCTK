'use strict';

const path = require('path');
const config = require(path.join(__dirname, '../../configuration', 'config.json'));
const LocalCache = require('../helpers/caching');
const axios = require('axios');
const validate = require('../helpers/validate');
const fs = require('fs');
const Ajv = require('ajv');
const cmpSpec = require('./compareSpecs.js');
var tunnel = require('tunnel');
const loadSpec = require('./loadSpecs');
var jsonMerger = require('../custom/json-merger');
const util = require('util');

let staticCatalogue = [];
let exceptionRules = [];
let exceptionRulesOAS3 = [];
let initialised = false;
let proxyAgent = {};

class CatalogueConf {
  constructor () {
    if (!initialised) {
      //no matter how many times child classes will construct catalogue items, we should always have a single init
      if (this.initialise()) {
        initialised = true;
      } else {
        staticCatalogue = [];
        exceptionRules = [];
        exceptionRulesOAS3 = [];
      }
    }
  }

  /**
   * Method will return if the catalog is initialised or not
   */
  isInitialised () {
    return initialised;
  }

  /**
   * Method will re-initialise the definition catalogue
   */
  reInitialise () {
    staticCatalogue = [];
    exceptionRules = [];
    exceptionRulesOAS3 = [];
    LocalCache.flushCache();
    initialised = false;

    return this.initialise();
  }

  initialise () {
    let files;
    let catalogSchema;

    //check if the proxy is enabled
    if (
      typeof config.proxy !== 'undefined' &&
      config.proxy &&
      typeof config.proxy.enable !== 'undefined' &&
      config.proxy.enable == true
    ) {
      proxyAgent = tunnel.httpsOverHttp({
        proxy: {
          host: config.proxy.host,
          port: config.proxy.port
        }
      });
    }

    // extract from the configuration file the path to the catalogue definitions
    console.log('Current catalogue folders set to: %s', config.catalogueFolder);

    // Tells fs to read an utf-8 file.
    var fileReadOptions = {
      encoding: 'utf-8'
    };

    try {
      let dataObject = fs.readFileSync(path.resolve(config.catalogueSchema), fileReadOptions);
      catalogSchema = JSON.parse(dataObject);
    } catch (err) {
      console.log('[CatalogueConf]-> Invalid catalogue schema file: [%s]', err);
      return;
    }

    // read all the files from the directory
    try {
      files = fs.readdirSync(path.resolve(config.catalogueFolder));
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('[CatalogueConf]-> Invalid catalog folder');
        return;
      }
    }

    // define the pattern for the catalogue files (catalogue_tmf.json)
    var jsonFilePattern = /catalogue_.*.json/g; // catalogue\_.*.json

    for (let i = 0; i < files.length; ++i) {
      let fileName = files[i];
      // Check if the file is a match
      if (fileName.match(jsonFilePattern)) {
        // normalize the path (support unix and windows)
        let filePath = path.resolve(config.catalogueFolder) + '/' + fileName;

        // read the file
        try {
          let data = fs.readFileSync(filePath, fileReadOptions);
          if (data.length > 0) {
            // parse the file and save it in our array
              var dataObject = JSON.parse(data);

              //validate the catalogue json is compliant with the schema
              var ajv = new Ajv();
              var validate = ajv.compile(catalogSchema);
              var valid = validate(dataObject);
              if (!valid) {
                let error = 'Invalid catalogue definition, skipping; error:[' + JSON.stringify(validate.errors) + ']';
                throw error;
              }

              // start looping through all the items and load the local files
              dataObject = this.loadLocalFiles(dataObject);

              staticCatalogue.push(dataObject);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (staticCatalogue.length != 0) initialised = true;

    //load the exception rules
    if (!this.loadExceptionRule()) initialised = false;
    if (!this.loadExceptionRuleOAS3()) initialised = false;

    return initialised;
  }

  loadExceptionRule () {
    let expRulesFile = config.exceptionRules;

    // Tells fs to read an utf-8 file.
    var fileReadOptions = {
      encoding: 'utf-8'
    };

    try {
      let dataObject = fs.readFileSync(path.resolve(expRulesFile), fileReadOptions);
      let expRule = JSON.parse(dataObject);
      //copy the rules from the file into static
      exceptionRules = exceptionRules.concat(expRule);
    } catch (err) {
      console.log('[loadExceptionRule]-> Invalid exception schema file: [%s]', err);
      return false;
    }

    return true;
  }  

  loadExceptionRuleOAS3 () {
    let expRulesFile = config.exceptionRulesOAS3;

    // Tells fs to read an utf-8 file.
    var fileReadOptions = {
      encoding: 'utf-8'
    };

    try {
      let dataObject = fs.readFileSync(path.resolve(expRulesFile), fileReadOptions);
      let expRule = JSON.parse(dataObject);
      //copy the rules from the file into static
      exceptionRulesOAS3 = exceptionRulesOAS3.concat(expRule);
    } catch (err) {
      console.log('[loadExceptionRuleOAS3]-> Invalid exception schema file: [%s]', err);
      return false;
    }

    return true;
  }

  loadLocalFiles (catalogue) {
    console.log('Parsing catalogue, name:[%s]', catalogue.name);

    // loop through the items
    for (let i = 0; i < catalogue.items.length; ++i) {
      let item = catalogue.items[i];

      // loop through each version
      for (let j = 0; j < item.versions.length; ++j) {
        let version = item.versions[j];

        // check if file is present
        if (Object.prototype.hasOwnProperty.call(version, 'file')) {
          // read the file
          try {
            let filePath = path.resolve(config.catalogueFolder + '/' + version.file);
            let data = fs.readFileSync(filePath, 'utf-8');
            version.swaggerDef = JSON.parse(data.trim());
          } catch (err) {
            console.log('Unable to read the local catalogue file: [%s]', version.file, err);
          }
        }
      }
    }
    return catalogue;
  }

  /**
   * Perform search in the catalogue object definitions
   * @param {*} catalog
   * @param {*} key
   * @param {*} version
   */

  //! Note: assumption here is the pre-load function has performed .toLowerCase() !
  //! Note: the cache key is made up of the Catalogue+API_ID+Version - aka iComposedKey+iVersion
  static async findCatalogueItem (iComposedKey, iVersion, statusObject) {
    let catalogFound = false;
    let apiFound = false;
    let versionFound = false;
    let cacheKey = iComposedKey + iVersion;

    // search the object inside the cache
    let result = LocalCache.getSpefication(cacheKey);
    if (result !== undefined) {
      console.log('[findCatalogueItem]-> Object found in cache records with key: [%s]', cacheKey);
      statusObject.conformanceDetails.officialRelease = result;
      return statusObject;
    }

    // cache failed, identify the catalogue
    for (let i = 0; i < staticCatalogue.length; ++i) {
      let catalogue = staticCatalogue[i];

      // extract from the catalogue definition the key
      var catRegexp = catalogue.nameRegexp;
      var keyRegexp = catalogue.keyRegexp;
      var iCatalogName = '';
      var iKey = '';

      // apply the regexp expression to get the catalogue name and the key

      // extract the catalogue name using the definition regexp from the composed key
      let catMatch = iComposedKey.match(new RegExp(catRegexp, 'is'));
      if (catMatch == null) {
        console.log('[findCatalogueItem]-> Catalogue Name, no match against the expression: [%s]', catRegexp);
        continue;
      } else {
        iCatalogName = catMatch[0];
      }

      // extract the api key using the definition regexp from the composed key
      let keyMatch = iComposedKey.match(new RegExp(keyRegexp, 'is'));
      if (keyMatch == null) {
        console.log('[findCatalogueItem]-> API Key, no match against the expression: [%s]', keyRegexp);
        continue;
      } else {
        iKey = keyMatch[0];
      }

      if (catalogue.name === iCatalogName) {
        catalogFound = true;
        // catalogue identified
        console.log('[findCatalogueItem]-> Catalogue found: [%s]', iCatalogName);

        // start looping through the items
        for (let j = 0; j < catalogue.items.length; ++j) {
          if (
            catalogue.items[j].key === iKey ||
            catalogue.items[j].key.substr(catalogue.items[j].key.length - 3) === iKey
          ) {
            apiFound = true;
            let itemAPI = catalogue.items[j];

            // we found the key
            console.log('[findCatalogueItem]-> Key found: [%s]', iKey);

            // start looking for the appropriate version
            let versionsArray = catalogue.items[j].versions;
            for (let k = 0; k < versionsArray.length; ++k) {
              if (versionsArray[k].version === iVersion) {
                let itemVersion = versionsArray[k];
                versionFound = true;
                console.log('[findCatalogueItem]-> Found version: [%s]', iVersion);
                if (itemVersion.url !== undefined) {
                  console.log('[findCatalogueItem]-> Found URL', itemVersion.url);

                  // TODO: check if the swagger object was already loaded

                  // retrieve the swagger definition
                  try {
                    var resp = await this.retrieveSpecification(itemVersion.url, catalogue.token, false);

                    //perform swagger file validation
                    try {
                      let localDef = cmpSpec.clone(resp);
                      await validate.validateSwaggerDef(localDef);
                    } catch (error) {
                      console.log(`The retrieved catalogue file is not valid [${itemVersion.url}]: [${error}]`);
                      throw error;
                    }

                    // populate the statusObject
                    itemVersion.swaggerDef = resp;

                    let officialRelease = validate.createRelease(
                      itemAPI.url,
                      itemAPI.key,
                      itemVersion.swaggerDef.info.title,
                      itemVersion.swaggerDef.info.description,
                      itemVersion.swaggerDef.info.version,
                      itemVersion.swaggerDef
                    );

                    try {
                      officialRelease = await this.loadItemExtensions(officialRelease, itemVersion, catalogue.token);
                    } catch (error) {
                      console.log('Unable to load the provided extensions for this release [%s]: [%s]', itemAPI.url, error);
                      throw error;
                    }

                    // put the swagger definition back into statusObject
                    // add a deep copy clone
                    statusObject.conformanceDetails.officialRelease = cmpSpec.clone(officialRelease);

                    // save the object back in the cache for future reference
                    LocalCache.saveSpecification(cacheKey, officialRelease);

                    // return the statusObject
                    return statusObject;
                  } catch (err) {
                    console.log('[findCatalogueItem]->retrieveSpecification-> Err:[%s]', err.message);
                    statusObject.statusMessage =
                      'Unable to use the definition of the API from the URL: ' + itemVersion.url + ' [' + err.message + ']';
                    throw statusObject;
                  }
                } else {
                  console.log('[findCatalogueItem]-> Found local: [%s]', itemVersion.file);

                  let officialRelease = this.createCacheObj(
                    itemAPI.url,
                    itemAPI.key,
                    itemVersion.swaggerDef.info.title,
                    itemVersion.swaggerDef.info.description,
                    itemVersion.swaggerDef.info.version,
                    itemVersion.swaggerDef
                  );

                  //perform swagger file validation
                  try {
                    let localDef = cmpSpec.clone(officialRelease.swaggerDef);
                    //console.log(localDef);
                    await validate.validateSwaggerDef(localDef);
                  } catch (error) {
                    console.log(`The retrieved catalogue file is not valid [%s]: [${error}]`, itemAPI.url);
                    statusObject.statusMessage = `The retrieved catalogue file is not valid: [${error}]`;
                    throw error;
                  }

                  try {
                    officialRelease = await this.loadItemExtensions(officialRelease, itemVersion, catalogue.token);
                  } catch (error) {
                    console.log(`Unable to load the provided extensions for this release [${itemAPI.url}]: [${error}]`);
                    statusObject.statusMessage = `Unable to load the provided extensions for this release [${itemAPI.url}]: [${error}]`;
                    throw error;
                  }

                  // put the swagger definition back into statusObject
                  statusObject.conformanceDetails.officialRelease = officialRelease;

                  // save the object back in the cache for future reference
                  LocalCache.saveSpecification(cacheKey, officialRelease);

                  return statusObject;
                }
              }
            }
          }
        }
      }
    }

    if (!catalogFound) {
      statusObject.statusMessage = 'Unable to identify the catalogue name from: ' + iComposedKey;
      console.log(statusObject.statusMessage);
      throw statusObject;
    }

    if (!apiFound) {
      statusObject.statusMessage = 'Unable to identify the API key identifier from: ' + iComposedKey;
      console.log(statusObject.statusMessage);
      throw statusObject;
    }

    if (!versionFound) {
      statusObject.statusMessage = 'Unable to identify the API version : ' + iVersion;
      console.log(statusObject.statusMessage);
      throw statusObject;
    }
  }

  /**
   * Find all catalogues
   * @return {*} the list of nameRegexp of all of the catalogues
   */
  //! Note: assumption here is the pre-load function has performed .toLowerCase() !
  static findCatalogueNames () {
    let resultList = [];

    // Traverse the catalogue collecting names
    for (let i = 0; i < staticCatalogue.length; ++i) {
      let catalogue = staticCatalogue[i];
      resultList.push(catalogue.nameRegexp);
    }
    //console.log(resultList);
    return resultList;
  }

  /*
    static function testConfig(overrides) {
        const defaults = {stringify: "pretty"};
        return Object.assign({}, defaults, overrides || {});
    }*/

  /**
   * Load and merge the extensions back in the main swagger file (official definition)
   * @param {*} release
   * @param {*} catalogItem
   * @param {*} token
   */
  static async loadItemExtensions (release, catalogItem, token) {
    //check if there are any extensions defined
    if (!Object.prototype.hasOwnProperty.call(catalogItem, 'extensions')) return release;

    let extensions = catalogItem.extensions;
    if (Object.prototype.hasOwnProperty.call(catalogItem, 'extensions') && catalogItem.extensions.length > 0) {
      console.log('[loadItemExtensions]-> Found [%d] extension(s) available', extensions.length);

      release['extensionKeys'] = [];
      for (let i = 0; i < extensions.length; ++i) {
        let extension = extensions[i];
        console.log('[loadItemExtensions]-> Loading extension:', extensions[i].extensionKey);

        //cycle through the extensionFile
        let extensionFiles = extension.extensionFiles;
        for (let j = 0; j < extensionFiles.length; ++j) {
          try {
            let resp;

            if (Object.prototype.hasOwnProperty.call(extensionFiles[j], 'url') && extensionFiles[j].url!='') {
              resp = await this.retrieveSpecification(extensionFiles[j].url, token, true);
            } else if (Object.prototype.hasOwnProperty.call(extensionFiles[j], 'localFile')) {
              // load the extension from the local disk
              let rawdata = fs.readFileSync(path.resolve(config.catalogueFolder, extensionFiles[j].localFile));
              resp = JSON.parse(rawdata);
            } else {
              console.log('[loadItemExtensions]-> Current extension does not have either a URL or a localFile attribute, ignoring...');
              continue;
            }
            let mergedOutput = jsonMerger.mergeObjects([release.swaggerDef, resp]);

            //let mergedOutput = mergeJSON.merge(release.swaggerDef, resp);
            //console.log(JSON.stringify(mergedOutput));
            /*
            fs.writeFile('outputSwagger.swagger.json', JSON.stringify(mergedOutput), function (err) {
              if (err) return console.log(err);
              console.log('output');
            });
            */

            //perform swagger file validation
            try {
              let localDef = cmpSpec.clone(mergedOutput);
              await validate.validateSwaggerDef(localDef);
            } catch (error) {
              console.log('The swagger file with the extension[%s] is not valid', extensions[i].extensionKey, error);
              throw error;
            }

            // eslint-disable-next-line require-atomic-updates
            release.swaggerDef = cmpSpec.clone(mergedOutput);

            //extract from the extension the definitions
            if (resp.definitions != undefined) {
              Object.keys(resp.definitions).forEach(function (key) {
                let extensionObj = {};
                extensionObj['extensionKey'] = extension.extensionKey;
                extensionObj['extensionName'] = extension.extensionName;
                extensionObj['type'] = 'definition';
                extensionObj['key'] = key;

                //add the extension back in the status object
                release.extensionKeys.push(extensionObj);
              });
            }
          } catch (error) {
            console.log('The retrieved extension is not valid [%s]: [%s]', extension.extensionName, error);
            throw error;
          }
        }
        console.log('[loadItemExtensions]-> Extension[%s] loaded successfully', extensions[i].extensionKey);
      }
    }
    return release;
  }

  /**
     * Method will create a cache object with the following definition:
     * "key": "620",
       "url": "https://api.github.com/repos/tmforum-apis/TMF620_ProductCatalog/contents/",
       "title": "",
	   "description": "",
       "version": "2.2",
       "url": "https://raw.githubusercontent.com/tmforum-apis/TMF620_ProductCatalog/master/TMF620_Product_Catalog_Management.regular.swagger.json",
       "swaggerDef": {}
     */
  static createCacheObj (iUrl, iKey, iTitle, iDescription, iVersion, iSwaggerDef) {
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

  /**
   * Method will strip the BOM character
   * @param {*} content
   */
  static stripBOM (content) {
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }
    return content;
  }

  /**
   * Method will retrieve the API Definition from the URL
   * @param {*} url
   */
  static async retrieveSpecification (url, token, useToken) {
    console.log('Trying to retrieve the definition from: [%s]', url);
    // retrieve the specification

    let axiosSettings = {
      method: 'get',
      url: url,
      headers: { Accept: 'application/vnd.github.v3.raw+json' },
      proxy: false
    };

    //check if the catalogue is github
    if (useToken || (url && url.includes('github.')) ) {
      let githubToken = process.env[token];
      axiosSettings.headers['Authorization'] = 'Bearer ' + githubToken;
    }

    if (
      typeof config.proxy !== 'undefined' &&
      typeof config.proxy.enable !== 'undefined' &&
      config.proxy.enable == true
    ){
      axiosSettings['httpsAgent'] = proxyAgent;
    }

    return axios(axiosSettings)
      .then(function (resp) {
        let respData = resp.data;
        if (resp.headers['content-type'].includes('text/plain')) {
          try {
            if (typeof respData === 'string') {
              respData = CatalogueConf.stripBOM(respData);

              respData = loadSpec.loadJsonOrYaml(respData);
            }
          } catch (err) {
            console.log('Unable to parse the response content: [%s]', err);
            throw new Error(err);
          }
        }

        console.log('Successfully retrieved the definition from live url');
        return respData;
      })
      .catch(err => {
        console.log(`Unable to retrieve the API specification from [${url}]: [${err.message}]`);
        throw new Error(err);
      });


  }

  /**
   * Method will retrieve the API Extension from the URL
   * @param {*} url
   */
  /*
    static retrieveExtension (url, token) {
        console.log('Trying to retrieve the extension definition from: [%s]', url);
        // retrieve the specification

        let axiosSettings = {
            method: 'get',
            url: url,
            headers: { Accept: 'application/vnd.github.v3.raw+json' }
        };

        //extensions always require the token due to the access restrictions on github
        let githubToken = process.env[token];
        axiosSettings.headers['Authorization'] = 'Bearer ' + githubToken;

        if (typeof config.proxy !== 'undefined' && typeof config.proxy.enable !== 'undefined' && config.proxy.enable == true)
            axiosSettings['httpAgent'] = proxyAgent;

        return axios(axiosSettings)
            .then(function (resp) {
                let respData = resp.data;
                if (resp.headers['content-type'].includes('text/plain')) {
                    try {
                        if (typeof respData === 'string') {
                            respData = this.stripBOM(respData);
                        }
                    }
                    catch (err) {
                        console.log('Unable to parse the response content: [%s]', err);
                        throw new Error(err);
                    }
                }

                console.log('Successfully retrieved the definition from live url');
                return respData;
            })
            .catch(err => {
                console.log('Unable to retrieve the API specification: [%s]', err);
                throw new Error(err);
            });
    }
*/
  /**
   * Simple getter
   */
  getCatalogue () {
    return staticCatalogue;
  }

  static getExceptionRules () {
    return exceptionRules;
  }

  static getExceptionRulesOAS3 () {
    return exceptionRulesOAS3;
  }
}

module.exports = CatalogueConf;
module.exports.staticCatalogue = staticCatalogue;
//module.exports.staticExceptionRules = exceptionRules;

/*{
            method: 'get',
            url: url,
            headers: { Accept: 'application/vnd.github.v3.raw+json' }
            httpsAgent: proxyAgent
        }
*/
