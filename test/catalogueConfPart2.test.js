const fs = require('fs');
const path = require('path');
const axios = require('axios');

jest.mock(
  '../configuration/config.json',
  () => ({
    serverPort: 3000,
    apiListURL: 'https://api.github.com/users/tmforum-apis/repos?per_page=100',
    token: 'abcdefgh123456',
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

jest.mock('axios');

beforeAll(() => {
  process.env = Object.assign(process.env, { GITHUB_TOKEN: 'token' });
});

var CatalogueConf = require('../src/helpers/catalogueConf');
const config = require('../configuration/config.json');

describe('Mocked Axios', () => {

  test('retrieveSpecification - success', async () => {

    let urlRemote = 'https://raw.githubusercontent.com/tmforum-apis/TMF633_ServiceCatalog/master/TMF633-ServiceCatalog-v4.0.0.swagger.json';
    let token = '';
    let useToken = '';

    let rawdata = fs.readFileSync(path.resolve(__dirname, '../test/samples/TMF674-GeographicSite-4.0.0.swagger.json'));
    let referenceSwaggerDef = rawdata.toString();
    let loadedSwagger = JSON.parse(rawdata);

    let headerDef = [];
    headerDef['content-type'] = 'text/plain';

    axios.mockResolvedValueOnce({
      status: 200,
      data: referenceSwaggerDef,
      headers: headerDef
    });

    let axiosSettings = {
      method: 'get',
      url: urlRemote,
      headers: { Accept: 'application/vnd.github.v3.raw+json' }
    };


    let response = await CatalogueConf.retrieveSpecification(urlRemote, token, useToken);

    expect(response).toEqual(loadedSwagger);
    expect.assertions(1);
  });

  test('retrieveSpecification - success - proxy', async () => {

    config.proxy.enable = true;
    let urlRemote = 'https://raw.githubusercontent.com/tmforum-apis/TMF633_ServiceCatalog/master/TMF633-ServiceCatalog-v4.0.0.swagger.json';
    let token = '';
    let useToken = '';

    let rawdata = fs.readFileSync(path.resolve(__dirname, '../test/samples/TMF674-GeographicSite-4.0.0.swagger.json'));
    let referenceSwaggerDef = rawdata.toString();
    let loadedSwagger = JSON.parse(rawdata);

    let headerDef = [];
    headerDef['content-type'] = 'text/plain';

    axios.mockResolvedValueOnce({
      status: 200,
      data: referenceSwaggerDef,
      headers: headerDef
    });

    let axiosSettings = {
      method: 'get',
      url: urlRemote,
      headers: { Accept: 'application/vnd.github.v3.raw+json' }
    };


    let response = await CatalogueConf.retrieveSpecification(urlRemote, token, useToken);

    expect(response).toEqual(loadedSwagger);
    expect.assertions(1);
  });

  test('retrieveSpecification - success - BOM character', async () => {

    config.proxy.enable = true;
    let urlRemote = 'https://raw.githubusercontent.com/tmforum-apis/TMF633_ServiceCatalog/master/TMF633-ServiceCatalog-v4.0.0.swagger.json';
    let token = '';
    let useToken = '';

    let rawdata = fs.readFileSync(path.resolve(__dirname, '../test/samples/TMF674-GeographicSite-4.0.0.swagger.json'));
    let referenceSwaggerDef = rawdata.toString();
    let loadedSwagger = JSON.parse(rawdata);

    //prepend the swagger def with the BOM character
    referenceSwaggerDef = '\ufeff' + referenceSwaggerDef;

    let headerDef = [];
    headerDef['content-type'] = 'text/plain';

    axios.mockResolvedValueOnce({
      status: 200,
      data: referenceSwaggerDef,
      headers: headerDef
    });

    let axiosSettings = {
      method: 'get',
      url: urlRemote,
      headers: { Accept: 'application/vnd.github.v3.raw+json' }
    };


    let response = await CatalogueConf.retrieveSpecification(urlRemote, token, useToken);

    expect(response).toEqual(loadedSwagger);
    expect.assertions(1);
  });

  test('retrieveSpecification - fail', async () => {

    let urlRemote = 'https://github.test.com/tmforum-apis/TMF633_ServiceCatalog/master/TMF633-ServiceCatalog-v4.0.0.swagger.json';
    let token = '';
    let useToken = '';

    let referenceSwaggerDef = '{"sdsdsds:"ssdsds"}';

    let headerDef = [];
    headerDef['content-type'] = 'text/plain';

    axios.mockResolvedValueOnce({
      status: 200,
      data: referenceSwaggerDef,
      headers: headerDef
    });

    let axiosSettings = {
      method: 'get',
      url: urlRemote,
      headers: { Accept: 'application/vnd.github.v3.raw+json' }
    };

    let outputStatusMsg='Error: Error: Invalid swagger file';

    try {
      await CatalogueConf.retrieveSpecification(urlRemote, token, useToken);
    } catch (error) {
      expect(error.message).toMatch(outputStatusMsg);
    }

    expect.assertions(1);
  });

  test('loadExceptionRule - fail', async () => {
    
    let outputStatusMsg = '';
    let catalog = new CatalogueConf();

    config.exceptionRules = '../test/missingfile';
    let result = catalog.loadExceptionRule();

    expect(result).toBe(false);
    expect.assertions(1);
  });


  test('initialise - fail on the catalog configuration', async () => {
    
    let outputStatusMsg = '';
    
    //config.exceptionRules = '../test/missingfile';
    let catalog = new CatalogueConf();
    config.catalogueFolder = './test/samples/catalogues/';
    catalog.reInitialise();

    expect(catalog.isInitialised()).toBe(false);
    expect.assertions(1);
  });

  


});
