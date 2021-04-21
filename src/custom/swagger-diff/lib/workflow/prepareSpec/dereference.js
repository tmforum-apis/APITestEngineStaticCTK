'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = dereference;

var _swaggerParser = require('swagger-parser');

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function dereference (spec) {
  /*  return _swaggerParser2.default.dereference(spec, {
    dereference: {
      circular: "ignore"                 // Don't allow circular $refs
    }});
*/
  //return specDeref;
  return _swaggerParser2.default.dereference(spec, {
    dereference: {
      internal: false,
      external: true,
      circular: 'ignore'
    }
  });
}
module.exports = exports['default'];
