var app = require('../src/app.js');
var request = require('supertest');

describe('Test GET health route', () => {
  test('should return 200', done => {
    request(app)
      .get('/health')
      .expect(200)
      .end(() => {
        done();
      });
  });
});

describe('Test POST health route', () => {
  test('should return 200', done => {
    request(app)
      .post('/health')
      .expect(200)
      .end(() => {
        done();
      });
  });
});
