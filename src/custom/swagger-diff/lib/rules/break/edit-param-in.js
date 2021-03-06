'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = editParamIn;
function editParamIn (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length === 6 && path[0] === 'paths' && path[3] === 'parameters' && path[5] === 'in';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var paramName = path[4];
    return {
      message: pathId + ' (' + method + ') - Param ' + paramName + ' in turn from ' + lhs + ' to ' + rhs,
      path: pathId,
      method: method,
      param: paramName,
      previousIn: lhs,
      currentIn: rhs
    };
  }
  return false;
}
module.exports = exports['default'];
