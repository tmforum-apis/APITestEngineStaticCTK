const path = require('path');
const fs = require('fs');
var loadSpec = require('../src/helpers/loadSpecs.js');

describe('Load either JSON or YAML file', () => {
  test('it should identify the JSON file', () => {
    const suppliedSwagger = fs.readFileSync(
      path.resolve(__dirname, '../test/samples/Official-TMF666-AccountManagement-2.1.swagger.json')
    );

    expect.assertions(1);
    expect(loadSpec.isJson(suppliedSwagger)).toBe(true);
  });

  test('it should identify the YAML file', () => {
    const suppliedSwagger = fs.readFileSync(
      path.resolve(__dirname, '../test/samples/TMF666-AccountManagement-2.1.swagger.yaml')
    );

    expect.assertions(1);
    expect(loadSpec.isJson(suppliedSwagger)).toBe(false);
  });

  test('it should return the JSON object', () => {
    const suppliedSwagger = fs.readFileSync(
      path.resolve(__dirname, '../test/samples/Official-TMF666-AccountManagement-2.1.swagger.json')
    );

    const swagger = loadSpec.loadJsonOrYaml(suppliedSwagger);
    expect.assertions(1);
    expect(swagger.info.title).toBe('Account Management');
  });

  test('it should return the YAML object', () => {
    const suppliedSwagger = fs.readFileSync(
      path.resolve(__dirname, '../test/samples/TMF666-AccountManagement-2.1.swagger.yaml')
    );

    const swagger = loadSpec.loadJsonOrYaml(suppliedSwagger);
    expect.assertions(1);
    expect(swagger.info.title).toBe('Account Management');
  });
});
