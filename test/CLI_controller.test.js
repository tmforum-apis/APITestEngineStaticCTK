const cliController = require('../src/controllers/CLIController.js');
const path = require('path');

describe('Test CLI file comparison tool', () => {
  // test('Shouldn\'t error', async done => {
  //     const suppliedSwagger = 'test/samples/noDescription.json';
  //     const response = cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
  //     expect(response.compliance).toBe(0);
  //     expect(response.statusMessage).toBe('Unable to find description within the swagger file');
  //     done();
  // });

  // test('Should error', async done => {
  //     const suppliedSwagger = fs.readFile('samples/erroneousJson.json', () => {});
  //     expect(await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger)).rejects;
  //     done();
  // });

  test('Invalid left side', async () => {
    let officialSwagger = path.resolve(__dirname, '../test/samples/XXX');
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/demo/TMF666-AccountManagement-2.1.passing.swagger.json');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(0);
    expect(response.statusMessage).toContain('Invalid swagger file');
  });

  test('Invalid right side', async () => {
    let officialSwagger = path.resolve(__dirname, '../test/samples/Official-TMF666-AccountManagement-2.1.swagger.json');
    let suppliedSwagger = path.resolve(__dirname, 'xxx');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(0);
    expect(response.statusMessage).toContain('Invalid swagger file');
  });

  test('Invalid left & right side', async () => {
    let officialSwagger = path.resolve(__dirname, 'xxx');
    let suppliedSwagger = path.resolve(__dirname, 'xxx');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(0);
    expect(response.statusMessage).toContain('Invalid swagger file');
  });

  test('Different swagger versions', async () => {
    let officialSwagger = path.resolve(__dirname, '../test/samples/Converted-Official-TMF666-AccountManagement-2.1.swagger.json');
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/demo/TMF666-AccountManagement-2.1.passing.swagger.json');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(0);
    expect(response.statusMessage).toContain('Swagger types do not match');
  });

  test('Complaince Pass', async () => {
    let officialSwagger = path.resolve(__dirname, '../test/samples/Official-TMF666-AccountManagement-2.1.swagger.json');
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/demo/TMF666-AccountManagement-2.1.passing.swagger.json');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(2);
    expect(response.statusMessage).toBe('Compliance test passed. ');
  });

  test('Complaince Warning', async () => {
    let officialSwagger = path.resolve(
      __dirname,
      '../test/samples/Official-TMF634-Resource_Catalog_Management-2.0.swagger.json'
    );
    let suppliedSwagger = path.resolve(
      __dirname,
      '../test/samples/demo/TMF634-Resource_Catalog_Management-2.0.warning.swagger.json'
    );

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(1);
    expect(response.statusMessage).toContain(
      'Compliance test passed. The following are worth noting, but do not strictly break compatibility:[add-optional-object-property];'
    );
  });

  test('Complaince Failed', async () => {
    let officialSwagger = path.resolve(
      __dirname,
      '../test/samples/Official-TMF622-ProductOrderingManagement-4.0.0.swagger.json'
    );
    let suppliedSwagger = path.resolve(
      __dirname,
      '../test/samples/demo/TMF622-ProductOrderingManagement-4.0.0.failing.swagger.json'
    );

    expect.assertions(1);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(0);
    //expect(response.statusMessage).toBe('The following are breaking compatibility:[edit-base-path][add-required-header];The following are worth noting, but do not strictly break compatibility:[add-optional-param][add-response][add-optional-object-property];');
  });


  
  test('Compliance OAS3 Pass', async () => {
    let officialSwagger = path.resolve(__dirname, '../test/samples/Converted-Official-TMF666-AccountManagement-2.1.swagger.json');
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/demo/Converted-TMF666-AccountManagement-2.1.passing.swagger.json');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(2);
    expect(response.statusMessage).toBe('Compliance test passed. ');
  });

  test('Compliance OAS3 Warning', async () => {
    let officialSwagger = path.resolve(
      __dirname,
      '../test/samples/Converted-Official-TMF634-Resource_Catalog_Management-2.0.swagger.json'
    );
    let suppliedSwagger = path.resolve(
      __dirname,
      '../test/samples/demo/Converted-TMF634-Resource_Catalog_Management-2.0.warning.swagger.json'
    );

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(1);
    expect(response.statusMessage).toContain(
      'Compliance test passed. The following are worth noting, but do not strictly break compatibility:[delete-schema-object-openapi][add-optional-object-property];'
    );
  });

  test('Compliance OAS3 Failed', async () => {
    let officialSwagger = path.resolve(
      __dirname,
      '../test/samples/Converted-Official-TMF622-ProductOrderingManagement-4.0.0.swagger.json'
    );
    let suppliedSwagger = path.resolve(
      __dirname,
      '../test/samples/demo/Converted-TMF622-ProductOrderingManagement-4.0.0.failing.swagger.json'
    );

    expect.assertions(1);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(0);
    //expect(response.statusMessage).toBe('The following are breaking compatibility:[edit-base-path][add-required-header];The following are worth noting, but do not strictly break compatibility:[add-optional-param][add-response][add-optional-object-property];');
  });



});
