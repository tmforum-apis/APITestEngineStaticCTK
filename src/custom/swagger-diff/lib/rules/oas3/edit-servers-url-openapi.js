'use strict';
const pathM = require('path');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editServersUrl;
function editServersUrl(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length > 1 && path[0] === 'servers' && path[path.length - 1] === 'url';
  if (match) {
    let relativePath = pathM.relative(lhs, rhs);
    if (relativePath != '') {
      return {
        message: 'Servers turned from ' + lhs + ' to ' + rhs,
        previousBasePath: lhs,
        currentBasePath: rhs
      };
    }
  }
  return false;
}
module.exports = exports['default'];