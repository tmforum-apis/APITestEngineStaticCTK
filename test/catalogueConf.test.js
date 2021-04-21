const fs = require('fs');
const path = require('path');
const axios = require('axios');

jest.mock(
  '../configuration/config.json',
  () => ({
    serverPort: 3000,
    apiListURL: 'https://api.github.com/users/tmforum-apis/repos?per_page=100',
    token: 'abcdefg123456',
    staticTMFCatalogue: './configuration/TMFCatalogue.json',
    elasticSearch: {
      sendToElastic: false, //altered
      url: 'https://elasticSearch.test.org',
      index: 'static'
    },
    catalogueFolder: './configuration/catalogues',
    catalogueSchema: './configuration/Catalogue.schema.json',
    exceptionRules: './configuration/exceptionRules.json',
    exceptionRulesOAS3: './configuration/exceptionRulesOAS3.json',
    cacheExpire: 360,
    proxy: {
      enable: false,
      host: '10.74.170.20',
      port: 8080
    }
  }),
  { virtual: false }
);

/*
beforeAll(() => {
  process.env = Object.assign(process.env, { GITHUB_TOKEN: 'token' });
});
*/

var CatalogueConf = require('../src/helpers/catalogueConf');
const config = require('../configuration/config.json');

describe('Incorect catalog path', () => {
  test('path non existent', () => {
    jest.resetModules();
    config.staticTMFCatalogue = 'yy';
    config.catalogueFolder = './configuration/cataloguesXXX';
    let catalog = new CatalogueConf();
    expect(catalog.isInitialised()).toBe(false);
  });

  test('no files in the path', () => {
    jest.resetModules();
    config.catalogueFolder = './configuration/';
    config.staticTMFCatalogue = 'yy';
    let catalog = new CatalogueConf();
    expect(catalog.isInitialised()).toBe(false);
  });
});

describe('Initialise the catalog', () => {
  test('it should initialise', () => {
    jest.resetModules();
    config.catalogueFolder = './configuration/catalogues';
    console.log('COnfig: [%o]', config);
    let catalog = new CatalogueConf();
    expect(catalog.getCatalogue()).not.toBeUndefined();
  });

  test('it should have catalogs', () => {
    let config = require('../configuration/config.json');
    config.catalogueFolder = './configuration/catalogues';
    config.catalogueSchema = './configuration/Catalogue.schema.json';
    config.exceptionRules = './configuration/exceptionRules.json';
    config.exceptionRulesOAS3 = './configuration/exceptionRulesOAS3.json';
    let catalog = new CatalogueConf();
    expect(catalog.getCatalogue().length).toBeTruthy(); //it should have catalogues in it (TMF)
    expect(CatalogueConf.findCatalogueNames().length >= 1); // it should find all of the catalogue names - currently 3
  });
});

describe('Retrieve specifications cases', () => {
  test('it should retrieve the file', () => {
    let url =
      'https://raw.githubusercontent.com/tmforum-apis/TMF620_ProductCatalog/master/TMF620_Product_Catalog_Management.regular.swagger.json';

    return CatalogueConf.retrieveSpecification(url, process.env.GITHUB_TOKEN, false).then(data => {
      expect(data).not.toBeUndefined();
      expect(data.swagger).toBe('2.0');
    });
  });

  test('it should throw an error', () => {
    let url =
      'https://raw.githubusercontent.com/tmforum-apis/TMF620_ProductCatalog/master/TMF620_Product_Catalog_Management.regular.swaggerXXX.json';

    return CatalogueConf.retrieveSpecification(url, process.env.GITHUB_TOKEN, false).catch(e => {
      expect(e).not.toBeNull();
      expect(e.message).toBe('Error: Request failed with status code 404');
    });
  });
});

describe('Create cache object', () => {
  test('it should create the cache object', () => {
    let iUrl = 'iUrl';
    let iKey = 'iKey';
    let iTitle = 'iTitle';
    let iDescription = 'iDescription';
    let iVersion = 'iVersion';
    let iSwaggerDef = 'iSwaggerDef';

    let cacheObj = CatalogueConf.createCacheObj(iUrl, iKey, iTitle, iDescription, iVersion, iSwaggerDef);
    expect(cacheObj.url).toBe('iUrl');
    expect(cacheObj.key).toBe('iKey');
    expect(cacheObj.title).toBe('iTitle');
    expect(cacheObj.description).toBe('iDescription');
    expect(cacheObj.version).toBe('iVersion');
    expect(cacheObj.swaggerDef).toBe('iSwaggerDef');
  });
});

describe('Find catalogue items', () => {

  test('findCatalogueItem - Invalid Extension', async () => {

    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    //re-initialise the catalogue definitions
    // eslint-disable-next-line no-unused-vars
    let catalog = new CatalogueConf();
    catalog.reInitialise();
    let sc = catalog.getCatalogue();

    for (let i = 0; i < sc.length; ++i) {
      let cat = sc[i];
      if (cat.name==='TMF')
      {
          for (let j=0; j< cat.items.length; j++ ){
            let item = cat.items[j];
            if (item.key=='622'){
                for (let k=0; k< item.versions.length; k++){
                  let versions = item.versions[k];
                  if (versions.version=='4.0.0'){
                      for (let e=0; e< versions.extensions.length; e++){
                        let extensions = versions.extensions[e];
                        if (extensions.extensionFiles.length>0){
                          extensions.extensionFiles[0].url='invalid url';
                        }
                      }
                  }
                }
            }
          }
      }
    }

    //sc[1].items[27].versions[0].extensions[0].extensionFiles[0].url='invalid url';
    
    try {
      await CatalogueConf.findCatalogueItem('TMF622', '4.0.0', statusObject);
    } catch (statusObj) {
      console.log(statusObj);
      expect(statusObj.statusMessage).toContain('Unable to use the definition of the API from the URL:');
    }

    expect.assertions(1);
});



  test('it should reinitialise the catalog and perform basic test', () => {
    jest.resetModules();
    config.apiListURL = 'https://api.github.com/users/tmforum-apis/repos?per_page=100'; //!Note: do we really use this anymore ?
    config.token = 'abcdefg1234567'; //!Note: do we really use this anymore ?
    config.catalogueFolder = './configuration/catalogues';
    config.catalogueSchema = './configuration/Catalogue.schema.json';
    config.elasticSearch = {
      sendToElastic: false, //altered
      url: 'https://elasticSearch.test.org',
      index: 'static'
    };
    config.cacheExpire = 3600;

    //re-initialise the catalogue definitions
    let catalog = new CatalogueConf();
    catalog.reInitialise();

    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    let iComposedKey = 'TMF620';
    let iVersion = '2.2';

    return CatalogueConf.findCatalogueItem(iComposedKey, iVersion, statusObject).then(statusObject => {
      expect(statusObject.conformanceDetails.officialRelease.key).toBe('620'); //assert that we found the proper spec
      expect(statusObject.conformanceDetails.officialRelease.version).toBe('2.2'); //assert that we have found the proper version
      expect(statusObject.conformanceDetails.officialRelease.swaggerDef.swagger).toBe('2.0'); //assert that we have the swagger definition
    });
  });

  test('it should retrieve the specification from the cache', async () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    config.apiListURL = 'https://api.github.com/users/tmforum-apis/repos?per_page=100'; //!Note: do we really use this anymore ?
    config.token = 'abcdefg123456'; //!Note: do we really use this anymore ?
    config.staticTMFCatalogue = './configuration/TMFCatalogue.json';
    config.catalogueSchema = './configuration/Catalogue.schema.json';
    config.elasticSearch = {
      sendToElastic: false,
      url: 'https://elasticSearch.test.org',
      index: 'static'
    };
    config.catalogueFolder = './configuration/catalogues';
    config.cacheExpire = 3600;
    //re-initialise the catalogue definitions
    // eslint-disable-next-line no-unused-vars
    let catalog = new CatalogueConf();

    let iComposedKey = 'TMF620';
    let iVersion = '2.2';

    //first call, the definition is retrieved and object saved in the cache
    await CatalogueConf.findCatalogueItem(iComposedKey, iVersion, statusObject).then(statusObject => {
      expect(statusObject.conformanceDetails.officialRelease.key).toBe('620'); //assert that we found the proper spec
      expect(statusObject.conformanceDetails.officialRelease.version).toBe('2.2'); //assert that we have found the proper version
      expect(statusObject.conformanceDetails.officialRelease.swaggerDef.swagger).toBe('2.0'); //assert that we have the swagger definition
    });

    //reset the object
    statusObject = JSON.parse(rawdata);
    expect(statusObject.conformanceDetails.officialRelease.url).toBe('');

    // eslint-disable-next-line require-atomic-updates
    CatalogueConf.retrieveSpecification = jest.fn();

    //second call, the definition is retrieved from cache
    return CatalogueConf.findCatalogueItem(iComposedKey, iVersion, statusObject).then(statusObject => {
      expect(statusObject.conformanceDetails.officialRelease.key).toBe('620'); //assert that we found the proper spec
      expect(statusObject.conformanceDetails.officialRelease.version).toBe('2.2'); //assert that we have found the proper version
      expect(statusObject.conformanceDetails.officialRelease.swaggerDef.swagger).toBe('2.0'); //assert that we have the swagger definition
      expect(CatalogueConf.retrieveSpecification).toHaveBeenCalledTimes(0);
    });
  });

  test("it should throw an error when catalogue can't be found", async () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    config.apiListURL = 'https://api.github.com/users/tmforum-apis/repos?per_page=100'; //!Note: do we really use this anymore ?
    config.token = 'abcdefg123456'; //!Note: do we really use this anymore ?
    config.staticTMFCatalogue = './configuration/TMFCatalogue.json';
    config.catalogueSchema = './configuration/Catalogue.schema.json';
    config.elasticSearch = {
      sendToElastic: false, //altered
      url: 'https://elasticSearch.test.org',
      index: 'static'
    };
    config.catalogueFolder = './configuration/catalogues';
    config.cacheExpire = 3600;
    //re-initialise the catalogue definitions
    // eslint-disable-next-line no-unused-vars
    let catalog = new CatalogueConf();

    let iComposedKey = 'TEST620';
    let iVersion = '2.2.0';
    let outputStatusMsg = 'Unable to identify the catalogue name from: ' + iComposedKey;

    try {
      await CatalogueConf.findCatalogueItem(iComposedKey, iVersion, statusObject);
    } catch (error) {
      expect(error.statusMessage).toMatch(outputStatusMsg);
    }
  });

  test("it should throw an error when key can't be found", async () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    //re-initialise the catalogue definitions
    // eslint-disable-next-line no-unused-vars
    let catalog = new CatalogueConf();

    let iComposedKey = 'TMF999';
    let iVersion = '2.2.0';
    let outputStatusMsg = 'Unable to identify the API key identifier from: ' + iComposedKey;

    try {
      await CatalogueConf.findCatalogueItem(iComposedKey, iVersion, statusObject);
    } catch (error) {
      expect(error.statusMessage).toMatch(outputStatusMsg);
    }
  });

  test("it should throw an error when version can't be found", async () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    //re-initialise the catalogue definitions
    // eslint-disable-next-line no-unused-vars
    let catalog = new CatalogueConf();

    let iComposedKey = 'TMF654';
    let iVersion = '9.9.9';
    let outputStatusMsg = 'Unable to identify the API version : ' + iVersion;

    try {
      await CatalogueConf.findCatalogueItem(iComposedKey, iVersion, statusObject);
    } catch (error) {
      expect(error.statusMessage).toMatch(outputStatusMsg);
    }
  });

  test('it should find a valid local file definition', async () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    //re-initialise the catalogue definitions
    // eslint-disable-next-line no-unused-vars
    let catalog = new CatalogueConf();

    let iComposedKey = 'TMF620';
    let iVersion = '1.8';

    return CatalogueConf.findCatalogueItem(iComposedKey, iVersion, statusObject).then(statusObject => {
      expect(statusObject.conformanceDetails.officialRelease.key).toBe('620'); //assert that we found the proper spec
      expect(statusObject.conformanceDetails.officialRelease.version).toBe('1.8'); //assert that we have found the proper version
      expect(statusObject.conformanceDetails.officialRelease.swaggerDef.swagger).toBe('2.0'); //assert that we have the swagger definition
    });
  });
});

describe('Load Extensions', () => {
  test('it should load the extension', async () => {
    let catalogItem = {
      extensions: [
        {
          extensionKey: 'NAG241',
          extensionName: 'RetailPremise',
          extensionFiles: [
            {
              localFile: '../../test/samples/extensions/RetailPremiseExtended.swagger.json'
            }
          ]
        }
      ]
    };

    let rawdata = fs.readFileSync(path.resolve(__dirname, '../test/samples/TMF674-GeographicSite-4.0.0.swagger.json'));
    let referenceSwaggerDef = JSON.parse(rawdata);
    let release = {
      swaggerDef: referenceSwaggerDef
    };

    try {
      let merged = await CatalogueConf.loadItemExtensions(release, catalogItem, 'Token');
      expect(merged.swaggerDef.definitions.RetailPremise).not.toBeNull();
      expect(merged.swaggerDef.paths['/geographicSite'].post.parameters[0].schema['$ref']).toBe(
        '#/definitions/GeographicSite'
      );
    } catch (error) {
      expect(error).toMatch('Error');
    }

    expect.assertions(2);
  });

  test('it should fail as the version is not valid', async () => {
    // create new status object
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
    let statusObject = JSON.parse(rawdata);

    //re-initialise the catalogue definitions
    // eslint-disable-next-line no-unused-vars
    let catalog = new CatalogueConf();

    try {
      await CatalogueConf.findCatalogueItem('TMF674', '9.0.0', statusObject);
    } catch (statusObj) {
      expect(statusObj.statusMessage).toMatch('Unable to identify the API version : 9.0.0');
    }

    expect.assertions(1);
  });

  test('no extension', async () => {
    let catalogItem = {};

    let rawdata = fs.readFileSync(path.resolve(__dirname, '../test/samples/TMF674-GeographicSite-4.0.0.swagger.json'));
    let referenceSwaggerDef = JSON.parse(rawdata);
    let release = {
      swaggerDef: referenceSwaggerDef
    };

    try {
      let merged = await CatalogueConf.loadItemExtensions(release, catalogItem, 'Token');
      expect(merged.swaggerDef.definitions.RetailPremise).toBeUndefined();
      expect(merged.swaggerDef.paths['/geographicSite'].post.parameters[0].schema['$ref']).toBe(
        '#/definitions/GeographicSite_Create'
      );
    } catch (error) {
      expect(error).toMatch('Error');
    }

    expect.assertions(2);
  });

  test('extension is present but has not content', async () => {
    let catalogItem = {
      extensions: [
        {
          extensionKey: 'NAG241',
          extensionName: 'RetailPremise',
          extensionFiles: [
            {
              localFile: ''
            }
          ]
        }
      ]
    };

    let rawdata = fs.readFileSync(path.resolve(__dirname, '../test/samples/TMF674-GeographicSite-4.0.0.swagger.json'));
    let referenceSwaggerDef = JSON.parse(rawdata);
    let release = {
      swaggerDef: referenceSwaggerDef
    };

    try {
      await CatalogueConf.loadItemExtensions(release, catalogItem, 'Token');
    } catch (error) {
      expect(error.message).toMatch('EISDIR: illegal operation on a directory, read');
    }

    expect.assertions(1);
  });

  test('merged swagger is invalid', async () => {
    let catalogItem = {
      extensions: [
        {
          extensionKey: 'NAG241',
          extensionName: 'RetailPremise',
          extensionFiles: [
            {
              localFile: '../../test/samples/extensions/RetailPremiseExtended.swagger.json'
            }
          ]
        }
      ]
    };

    let rawdata = fs.readFileSync(path.resolve(__dirname, '../test/samples/TMF674-GeographicSite-4.0.0.swagger.json'));
    let referenceSwaggerDef = JSON.parse(rawdata);
    let release = {
      swaggerDef: referenceSwaggerDef
    };

    release.swaggerDef.paths = {};

    try {
      await CatalogueConf.loadItemExtensions(release, catalogItem, 'Token');
    } catch (error) {
      expect(error.message).toContain(
        '[validateCheckFileInput]->Supplied file is invalid: [API is invalid. Swagger schema validation failed'
      );
    }

    expect.assertions(1);
  });

  test('StripBOM test - no BOM', async () => {
    let sContent = '{}';
    sContent = CatalogueConf.stripBOM(sContent);

    expect(sContent).toBe('{}');
    expect.assertions(1);
  });

  test('StripBOM test - BOM character present', async () => {
    let sContent = '\ufeff{}';
    let sOutput = CatalogueConf.stripBOM(sContent);

    expect(sOutput).toBe('{}');
    expect(sContent).toBe('\ufeff{}');
    expect.assertions(2);
  });

    test('LoadExceptionRulesOAS3 - fail', async () => {

      jest.resetModules();
      config.exceptionRulesOAS3='../invalidFile';
      let catalog = new CatalogueConf();

      let sOutput = catalog.loadExceptionRuleOAS3();

      expect(sOutput).toBe(false);
      expect.assertions(1);
    });

    test('initialise invalid schema - fail ', async () => {

      jest.resetModules();
      config.catalogueSchema='../invalidFile';
      let catalog = new CatalogueConf();
      catalog.reInitialise();

      expect(catalog.isInitialised()).toBe(false);
      expect.assertions(1);
    });

    test('loadLocalFiles - fail ', async () => {

      let catalogConfig = {
        "name": "TMF-Fail",
        "nameRegexp": "TMF",
        "keyRegexp": ".{3}$",
        "url": "https://github.com/tmforum-apis",
        "token": "GITHUB_TOKEN",
        "items": [
          {
            "key": "620",
            "url": "https://api.github.com/repos/tmforum-apis/TMF620_ProductCatalog/contents/",
            "versions": [
              {
                "version": "4.0.0",
                "file": "../ssss",
                "swaggerDef": {}
              }
            ]
          }
        ]
      }

      jest.resetModules();
      let catalog = new CatalogueConf();

      catalogConfig = catalog.loadLocalFiles(catalogConfig);

      expect(catalogConfig.items[0].versions[0].swaggerDef).toStrictEqual({});
      expect.assertions(1);
    });


    test('findCatalogueItem - invalid Key', async () => {
      // create new status object
      let rawdata = fs.readFileSync(path.resolve(__dirname, '../src/utils/statusObj.json'));
      let statusObj = JSON.parse(rawdata);

      jest.resetModules();
      jest.clearAllMocks();
      console.log = jest.fn();
      config.catalogueFolder='./test/samples/catalogues/invalidRegexp/';
      config.catalogueSchema= './configuration/Catalogue.schema.json';
      config.exceptionRules='./configuration/exceptionRules.json';
      config.exceptionRulesOAS3='./configuration/exceptionRulesOAS3.json';
      let catalog = new CatalogueConf();
      catalog.reInitialise();
      
      try {
        await CatalogueConf.findCatalogueItem('TMF-QQQ', 222, statusObj);
      } catch (error) {}

      expect(console.log).toHaveBeenCalledWith('[findCatalogueItem]-> API Key, no match against the expression: [%s]', '.{10}$');
      expect.assertions(1);
    });

    
  
    test('findCatalogueItem - extension missing url', async () => {
      
      jest.resetModules();
      jest.clearAllMocks();

      let catalogItem = {
        extensions: [
          {
            extensionKey: 'NAG241',
            extensionName: 'RetailPremise',
            extensionFiles: [
              {
              }
            ]
          }
        ]
      };
  
      let rawdata = fs.readFileSync(path.resolve(__dirname, '../test/samples/TMF674-GeographicSite-4.0.0.swagger.json'));
      let referenceSwaggerDef = JSON.parse(rawdata);
      let release = {
        swaggerDef: referenceSwaggerDef
      };

      console.log = jest.fn();
      try {
        await CatalogueConf.loadItemExtensions(release, catalogItem, 'Token');
      } catch (error) {
        expect(error).toMatch('Error');
      }
  
      expect(console.log).toHaveBeenCalledWith('[loadItemExtensions]-> Current extension does not have either a URL or a localFile attribute, ignoring...');
      expect.assertions(1);
    });
    

});
