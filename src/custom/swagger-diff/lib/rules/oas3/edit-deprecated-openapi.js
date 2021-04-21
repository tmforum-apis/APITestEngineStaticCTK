'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editDeprecated;
function editDeprecated(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length === 4 && path[0] === 'paths' && path[3] === 'deprecated';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    return {
      message: pathId + ' (' + method + ') - Deprecated turned from ' + lhs + ' to ' + rhs,
      path: pathId,
      method: method,
      previousOperationId: lhs,
      currentOperationId: rhs
    };
  }
  return false;
}
module.exports = exports['default'];