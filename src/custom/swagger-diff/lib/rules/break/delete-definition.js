'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = deleteDefinition;
function deleteDefinition (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'D' && path.length === 2 && path[0] === 'definitions';
  if (match) {
    var pathId = path[1];
    return {
      message: pathId + ' - Deleted',
      path: pathId
    };
  }
  return false;
}
module.exports = exports['default'];
