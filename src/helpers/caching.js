'use strict';

const NodeCache = require('node-cache');
const catalogueCache = new NodeCache();
const config = require('../../configuration/config.json');

class LocalCache {

  /**
   * Method will flush all data from the cache
   */
  static flushCache(){
    catalogueCache.flushAll();
  }

  /**
   * Method will save the specification in the local cache
   * Method will only save the objects that have swagger structure
   *
   * @param {String} key
   * @param {Object} payload
   */
  static saveSpecification (key, payload) {
    let result = catalogueCache.set(key, payload, config.cacheExpire); // all the entries will have an expire date of 1hour;
    return result;
  }

  /**
   * Method will retrieve a specification based on the key from cache
   * @param {String} key
   */
  static getSpefication (key) {
    let spec = catalogueCache.get(key);
    return spec;
  }

  /**
   * Method will return the current caching stats
   */
  static getStats () {
    return catalogueCache.getStats();
  }
}

module.exports = LocalCache;
