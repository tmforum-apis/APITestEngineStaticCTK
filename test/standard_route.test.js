var app = require('../src/app.js');
var request = require('supertest');

jest.setTimeout(500000);


describe('Test GET index route', () => {
  test('should return 404', done => {
    request(app)
      .get('/rnd')
      .expect(404)
      .end(function (err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});

describe('Test POST index route', () => {
  test('should return 404', done => {
    request(app)
      .post('/rnd')
      .expect(404)
      .end(() => {
        done();
      });
  });
});
