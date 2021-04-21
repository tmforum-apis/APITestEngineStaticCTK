var localCache = require('../src/helpers/caching.js');

describe('Test the cache module', () => {
  test('it should return undefined', () => {
    expect(localCache.getSpefication('key')).toBeUndefined();
  });

  test('it should save the item in the local cache', () => {
    localCache.saveSpecification('key1', 'payload');
    expect(localCache.getSpefication('key1')).toMatch('payload');
  });

  test('key deleted from cache, it should return undefined', done => {
    let config = require('../configuration/config.json');
    config.cacheExpire = 1; //force the cache to expire the entry after 2 seconds
    localCache.saveSpecification('key10', 'payloadKey10'); //add specification in the cache
    expect.assertions(2);
    expect(localCache.getSpefication('key10')).toMatch('payloadKey10'); //check if the cache has our record
    setTimeout(() => {
      console.log('Wait for cache to expire');
      expect(localCache.getSpefication('key10')).toBeUndefined(); //we should get undefined
      done();
    }, 2000);
  });

  test('should return the stats object', () => {
    console.log(localCache.getStats());
    expect(localCache.getStats()).not.toBeUndefined();
  });
});
