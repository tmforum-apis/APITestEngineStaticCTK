'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = addOptionalHeader;
function addOptionalHeader (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  if (kind === 'N') {
    if (path.length === 5) {
      if (path[path.length - 1] === 'fields') {
        console.log('Found it!');
      }
    }
  }

  var match =
    kind === 'N' &&
    path.length === 5 &&
    path[0] === 'paths' &&
    path[3] === 'parameters' &&
    rhs.in === 'header' &&
    (!Object.prototype.hasOwnProperty.call(rhs, 'required') || rhs.required === false);

  if (match) {
    var pathId = path[1];
    var method = path[2];
    var paramName = path[4];
    return {
      message: pathId + ' (' + method + ') - Optional header ' + paramName + ' added',
      path: pathId,
      method: method,
      param: paramName
    };
  }
  return false;
}
module.exports = exports['default'];
