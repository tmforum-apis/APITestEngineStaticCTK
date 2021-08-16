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
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/TMF666-AccountManagement-2.1.passing.swagger.json');

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
    let officialSwagger = path.resolve(__dirname, '../test/samples/oas3/Converted-Official-TMF666-AccountManagement-2.1.swagger.json');
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/TMF666-AccountManagement-2.1.passing.swagger.json');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger);
    expect(response.compliance).toBe(0);
    expect(response.statusMessage).toContain('Swagger types do not match');
  });

  test('Compliance Pass', async () => {
    let officialSwagger = path.resolve(__dirname, '../test/samples/Official-TMF666-AccountManagement-2.1.swagger.json');
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/TMF666-AccountManagement-2.1.passing.swagger.json');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger, undefined, 'ALL');
    expect(response.compliance).toBe(2);
    expect(response.statusMessage).toBe('Compliance test passed. ');
  });

  test('Compliance Warning', async () => {
    let officialSwagger = path.resolve(
      __dirname,
      '../test/samples/Official-TMF634-Resource_Catalog_Management-2.0.swagger.json'
    );
    let suppliedSwagger = path.resolve(
      __dirname,
      '../test/samples/TMF634-Resource_Catalog_Management-2.0.warning.swagger.json'
    );

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger, undefined, 'DISABLE');
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
      '../test/samples/TMF622-ProductOrderingManagement-4.0.0.failing.swagger.json'
    );

    expect.assertions(1);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger, undefined, 'DISABLE');
    expect(response.compliance).toBe(0);
    //expect(response.statusMessage).toBe('The following are breaking compatibility:[edit-base-path][add-required-header];The following are worth noting, but do not strictly break compatibility:[add-optional-param][add-response][add-optional-object-property];');
  });


  test('Generate Flat - no key', async () => {
    let key = '';
    let version = '4.0.0';


    try {
      await cliController.performGenerateFlatFileWithExtension(key, version);
    } catch (error) {
      console.log(error);
      expect(error.message).toContain(
        'No API Key supplied. The API Key must be in the format <catalog>+<unique_identifier>, e.g. TMF678'
      );
    }

    expect.assertions(1);
  });

  test('Generate Flat - no version', async () => {
    let key = 'TMF678';
    let version = '';

    try {
      await cliController.performGenerateFlatFileWithExtension(key, version);
    } catch (error) {
      console.log(error);
      expect(error.message).toContain(
        'No API Version supplied. The API Key must be in the format <major.minor.patch> or <major.minor>, e.g. 4.0.0 or 3.2'
      );
    }

    expect.assertions(1);
  });

  
  test('Compliance OAS3 Pass', async () => {
    let officialSwagger = path.resolve(__dirname, '../test/samples/oas3/Converted-Official-TMF666-AccountManagement-2.1.swagger.json');
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/oas3/Converted-TMF666-AccountManagement-2.1.passing.swagger.json');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger, undefined, 'ALL');
    expect(response.compliance).toBe(2);
    expect(response.statusMessage).toBe('Compliance test passed. ');
  });

  test('Compliance OAS3 Warning', async () => {
    let officialSwagger = path.resolve(
      __dirname,
      '../test/samples/oas3/Converted-Official-TMF634-Resource_Catalog_Management-2.0.swagger.json'
    );
    let suppliedSwagger = path.resolve(
      __dirname,
      '../test/samples/oas3/Converted-TMF634-Resource_Catalog_Management-2.0.warning.swagger.json'
    );

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger, undefined, 'MD');
    expect(response.compliance).toBe(1);
    expect(response.statusMessage).toContain(
      'Compliance test passed. The following are worth noting, but do not strictly break compatibility:[delete-schema-object-openapi][add-optional-object-property];'
    );
  });

  test('Compliance OAS3 Failed', async () => {
    let officialSwagger = path.resolve(
      __dirname,
      '../test/samples/oas3/Converted-Official-TMF622-ProductOrderingManagement-4.0.0.swagger.json'
    );
    let suppliedSwagger = path.resolve(
      __dirname,
      '../test/samples/oas3/Converted-TMF622-ProductOrderingManagement-4.0.0.failing.swagger.json'
    );

    expect.assertions(1);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger, undefined, 'ASCIIDOC');
    expect(response.compliance).toBe(0);
    //expect(response.statusMessage).toBe('The following are breaking compatibility:[edit-base-path][add-required-header];The following are worth noting, but do not strictly break compatibility:[add-optional-param][add-response][add-optional-object-property];');
  });


  test('Compliance Swagger to OAS3 Pass', async () => {
    let officialSwagger = path.resolve(__dirname, '../test/samples/oas3/ES/TMF621-TroubleTicket.swagger.json');
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/oas3/ES/ConvertedTMF621-TroubleTicket.swagger.json');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheck(officialSwagger, suppliedSwagger, undefined, 'JSON');
    expect(response.compliance).toBe(2);
    expect(response.statusMessage).toBe('Compliance test passed. ');
  });


  test('performGenerateFlatFileWithExtension - fail', async ()=>{
    let key='TMF678';
    let version='4.0.0';
    try{
      const resp= await cliController.performGenerateFlatFileWithExtension(key,version);
    }catch(e){

    }
   
  });

  test('performGenerateFlatFileWithExtension - ', async ()=>{
    let key='TMF666';
    let version='2.1';
    const resp= await cliController.performGenerateFlatFileWithExtension(key,version);
  });

  test('API Check Compliance Pass', async () => {
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/TMF666-AccountManagement-2.1.passing.swagger.json');

    expect.assertions(2);
    const response = await cliController.performCLIComplianceCheckWithAPI('TMF666', '2.1', suppliedSwagger, undefined, 'DISABLE');
    expect(response.compliance).toBe(2);
    expect(response.statusMessage).toBe('Compliance test passed. ');
  });

  test('API Check Compliance fail', async () => {
    let suppliedSwagger = path.resolve(__dirname, '../test/samples/TMF666-AccountManagement-2.1.passing.swagger.json');

    expect.assertions(1);
    const response = await cliController.performCLIComplianceCheckWithAPI('TMF666', '2.1.0', suppliedSwagger, undefined, 'DISABLE');
    expect(response.statusMessage).toContain('API not found');
  });

});

  

