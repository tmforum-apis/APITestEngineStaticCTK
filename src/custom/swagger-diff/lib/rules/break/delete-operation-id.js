'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = deleteOperationId;
function deleteOperationId (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'D' && path.length === 4 && path[0] === 'paths' && path[3] === 'operationId';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    return {
      message: pathId + ' (' + method + ') - OperationId (' + lhs + ') deleted',
      path: pathId,
      method: method,
      operationId: lhs
    };
  }
  return false;
}
module.exports = exports['default'];
