const yaml = require('js-yaml');

/**
 * Check if the payload is JSON or not
 * @param {*} str
 */
function isJson (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Method will convert a YAML payload to JSON
 * @param {*} payload
 */
function loadJsonOrYaml (payload) {
  let respData = {};

  if (isJson(payload)) {
    respData = JSON.parse(payload);
  } else {
    //we try to validate as yaml file
    try {
      respData = yaml.safeLoad(payload);
    } catch (e) {
      throw Error('Invalid swagger file');
    }
  }

  return respData;
}

module.exports = {
  isJson: function (payload) {
    return isJson(payload);
  },
  loadJsonOrYaml: function (payload) {
    return loadJsonOrYaml(payload);
  }
};
