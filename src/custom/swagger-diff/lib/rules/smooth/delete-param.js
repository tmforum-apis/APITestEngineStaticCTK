'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = deleteParam;
function deleteParam (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'D' && path.length === 5 && path[0] === 'paths' && path[3] === 'parameters';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var paramName = path[4];
    return {
      message: pathId + ' (' + method + ') - Param ' + paramName + ' deleted',
      path: pathId,
      method: method,
      param: paramName
    };
  }
  return false;
}
module.exports = exports['default'];
