var app = require('../src/app.js');
var request = require('supertest');

// Basic REST Route Tests ---------------------------------------------------------------------------------------------

describe('Test GET checkFile API', () => {
  test('should return 404 status code', done => {
    request(app)
      .get('/staticComplianceTesting/v1/checkFile')
      .expect(404)
      .end(err => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});

describe('Test POST checkFile API', () => {
  test('should return 200 status code', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .expect(200)
      .end(err => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});

// Request Input Requirements Tests -----------------------------------------------------------------------------------

describe('Test POST checkFile with no fields', () => {
  test('should return 200 status code and statusMessage: "Invalid request: No file"', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.statusMessage).toBe('Invalid request: No file');
        done();
      });
  });
});

describe('Test POST checkFile with only file', () => {
  test('should return 200 status code and statusMessage: "Invalid request: Missing key"', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json')
      .expect(200)
      .end((err, res) => {
        expect(res.body.statusMessage).toBe('Invalid request: Missing key');
        done();
      });
  });
});

describe('Test POST checkFile with file and key', () => {
  test('should return 200 status code and statusMessage: "Invalid request: Missing market"', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json')
      .field('key', 'TMF620')
      .expect(200)
      .end((err, res) => {
        expect(res.body.statusMessage).toBe('Invalid request: Missing market');
        done();
      });
  });
});

describe('Test POST checkFile with file, key and market', () => {
  test('should return 200 status code', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json')
      .field('key', 'TMF620')
      .field('market', 'DE')
      .expect(200)
      .end(() => {
        done();
      });
  });
});

// Swagger Fields Validation (metadata) -------------------------------------------------------------------------------

describe('Test POST checkFile with an erroneous swagger file', () => {
  test('should return 200 status code and statusMessage: "Invalid swagger file"', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/erroneousJson.json')
      .field('key', 'TMF620')
      .field('market', 'DE')
      .expect(200)
      .end((err, res) => {
        expect(res.body.statusMessage).toBe('Invalid swagger file');
        done();
      });
  });
});

describe('Test POST checkFile with no version', () => {
  test('should return 200 status code and statusMessage: "Unable to find version within the swagger file"', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/noVersion.json')
      .field('key', 'TMF620')
      .field('market', 'DE')
      .expect(200)
      .end((err, res) => {
        expect(res.body.statusMessage).toBe('Unable to find version within the swagger file');
        done();
      });
  });
});

describe('Test POST checkFile with no title', () => {
  test('should return 200 status code and statusMessage: "Unable to find title within the swagger file"', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/noTitle.json')
      .field('key', 'TMF620')
      .field('market', 'DE')
      .expect(200)
      .end((err, res) => {
        expect(res.body.statusMessage).toBe('Unable to find title within the swagger file');
        done();
      });
  });
});

describe('Test POST checkFile with no description', () => {
  test('should return 200 status code and statusMessage: "Compliance test passed" and should not throw error', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/noDescription.json')
      .field('key', 'TMF620')
      .field('market', 'DE')
      .expect(200)
      .end((err, res) => {
        expect(res.body.statusMessage).toBe('Compliance test passed. ');
        done();
      });
  });
});

describe('Test POST checkFile with no url', () => {
  test('should return 200 status code and no url', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json')
      .field('key', 'TMF620')
      .field('market', 'DE')
      .expect(200)
      .end((err, res) => {
        expect(res.body.conformanceDetails.suppliedRelease.url).toBe(undefined);
        done();
      });
  });
});

describe('Test POST checkFile with a url', () => {
  test('should return 200 status code and show the same url', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json')
      .field('key', 'TMF620')
      .field('market', 'DE')
      .field(
        'url',
        'https://github.com//Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json'
      )
      .expect(200)
      .end((err, res) => {
        expect(res.body.conformanceDetails.suppliedRelease.url).toBe(
        'https://github.com//Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json'
        );
        done();
      });
  });
});

describe('Test POST checkFile without sendToGrafa', () => {
  test('should return 200 status code', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json')
      .field('key', 'TMF620')
      .field('market', 'DE')
      .expect(200)
      .end(() => {
        done();
      });
  });
});

// describe('Test POST checkFile with sendToGrafa = yes', () => {
//     test('should return 200 status code', done => {
//         request(app)
//             .post('/staticComplianceTesting/v1/checkFile')
//             .attach('swaggerFile', 'samples/Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json')
//             .field('key', 'TMF620')
//             .field('market', 'DE')
//             .expect(200)
//             .end(() => {
//                 done();
//             });
//     });
// });

describe('Test POST checkFile with invalid swagger', () => {
  test('XXshould return 200 status code and statusMessage: ', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/invalidSwagger.json')
      .field('key', 'TMF620')
      .field('market', 'DE')
      .expect(200)
      .end((err, res) => {
        expect(res.body.statusMessage.includes('[validateCheckFileInput]->Supplied file is invalid:')).toBeTruthy();
        done();
      });
  });
});

// Catalogue Checking -------------------------------------------------------------------------------------------------

describe('Test POST checkFile with an invalid key', () => {
  test('should return 200 status code', done => {
    request(app)
      .post('/staticComplianceTesting/v1/checkFile')
      .attach('swaggerFile', 'test/samples/Market/DE/TMF620-ProductCatalogManagement-2.2.0.swagger.json')
      .field('key', 'T20')
      .field('market', 'DE')
      .expect(200)
      .end((err, res) => {
        expect(res.body.statusMessage).toBe('Unable to identify the catalogue name from: T20');
        done();
      });
  });
});
// This could go on for a while. Would it not be better to make a seperate test file for the catalog. That way we can split up the tests.
