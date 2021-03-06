'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = editHost;
function editHost (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length === 1 && path[0] === 'host';
  if (match) {
    return {
      message: 'Host turned from ' + lhs + ' to ' + rhs,
      previousHost: lhs,
      currentHost: rhs
    };
  }
  return false;
}
module.exports = exports['default'];
