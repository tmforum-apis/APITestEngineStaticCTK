const server = require('../src/server.js');

describe('Test the server is listening', () => {
  test('should be listening on port 3000', () => {
    expect(server.listening).toBe(true);
    server.close();
  });
});
