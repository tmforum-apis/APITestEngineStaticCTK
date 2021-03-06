'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = addOptionalParam;
function addOptionalParam (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  if (kind === 'N') {
    if (path.length === 5) {
      if (path[0] === 'paths') {
        if (path[3] === 'parameters') {
          if (!rhs.required) {
            if (!rhs.name) {
              console.log('x');
            }
          }
        }
      }
    }
  }

  var match =
    kind === 'N' &&
    path.length === 5 &&
    path[0] === 'paths' &&
    path[3] === 'parameters' &&
    (!Object.prototype.hasOwnProperty.call(rhs, 'required') || rhs.required === false) &&
    rhs.name !== 'fields' &&
    rhs.name !== 'offset' &&
    rhs.name !== 'limit';

  if (match) {
    var pathId = path[1];
    var method = path[2];
    var paramName = path[4];
    return {
      message: pathId + ' (' + method + ') - Optional param ' + paramName + ' added',
      path: pathId,
      method: method,
      param: paramName
    };
  }
  return false;
}
module.exports = exports['default'];
