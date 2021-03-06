'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = addResponse;

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function addResponse (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'N' && path.length === 5 && path[0] === 'paths' && path[3] === 'responses';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var responseId = path[4];
    var definition = (0, _lodash2.default)(rhs, ['schema', '$ref']);
    return {
      message: pathId + ' (' + method + ') - Response ' + responseId + ' added to ' + (definition || rhs),
      path: pathId,
      method: method,
      responseId: responseId
    };
  }
  return false;
}
module.exports = exports['default'];
