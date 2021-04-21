'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editXOriginOpenapi;
function editXOriginOpenapi(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && ((path.length >= 1 && path[0] === 'x-origin') || 
                            (path.length >= 2 && path[path.length - 2] === 'x-origin'));
  if (match) {
    var p = '/' + path.slice(0, -1).join('/') + '/';
    return {
      message: p + ' - x-origin updated ' + lhs + ' to ' + rhs,
      path: p,
      previous: lhs,
      current: rhs
    };
  }
  return false;
}
module.exports = exports['default'];