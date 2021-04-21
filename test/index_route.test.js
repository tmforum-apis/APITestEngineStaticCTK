var app = require('../src/app.js');
var request = require('supertest');

describe('Test GET index route', () => {
  test('should return 404', done => {
    request(app)
      .get('/')
      .expect(404)
      .end(() => {
        done();
      });
  });
});

describe('Test POST index route', () => {
  test('should return 404', done => {
    request(app)
      .post('/')
      .expect(404)
      .end(() => {
        done();
      });
  });
});
