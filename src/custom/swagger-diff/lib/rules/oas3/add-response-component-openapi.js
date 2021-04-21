'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addResponseComponent;

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addResponseComponent(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'N' && path.length === 3 && path[0] === 'components' && path[1] === 'responses';
  if (match) {
    var pathId = path[1];
    var responseId = path[path.length - 1];
    return {
      message: '/components/responses - Response ' + responseId + ' added  ' ,
      path: pathId,
      responseId: responseId
    };
  }
  return false;
}
module.exports = exports['default'];