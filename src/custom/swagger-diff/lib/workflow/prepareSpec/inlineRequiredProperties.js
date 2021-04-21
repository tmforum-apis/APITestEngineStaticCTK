'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = inlineRequiredProperties;

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _constants = require('../../constants');

function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * @warning mutate spec
 */
function inlineRequiredProperties (spec) {
  (0, _lodash2.default)(spec, function (child) {
    if ((0, _lodash4.default)(child)) {
      inlineRequiredProperties(child);
    }
  });

  //if (spec.type && spec.type === "object" && spec.required && Array.isArray(spec.required)) {
  if (spec.required && Array.isArray(spec.required)) {
    //AVTS-283 - workaround the missing "type:object"
    if (!spec.type && spec[_constants.PROPERTIES_KEY]) {
      spec['type'] = 'object';
    }

    spec.required.forEach(function (requiredProperty) {
      if (Object.prototype.hasOwnProperty.call(spec, _constants.PROPERTIES_KEY)) {
        if (Object.prototype.hasOwnProperty.call(spec[_constants.PROPERTIES_KEY], requiredProperty)) {
          spec[_constants.PROPERTIES_KEY][requiredProperty].required = true;
          //console.log('spec[%s][%s].required:%s',_constants.PROPERTIES_KEY, requiredProperty, spec[_constants.PROPERTIES_KEY][requiredProperty].required);
        }
      }
    });
    delete spec.required;
  }

  return spec;
} /* eslint no-param-reassign:0 */

module.exports = exports['default'];
