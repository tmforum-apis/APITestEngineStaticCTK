'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = addDefinition;
function addDefinition (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'N' && path.length === 2 && path[0] === 'definitions';
  if (match) {
    var pathId = path[1];
    return {
      message: pathId + ' - Added',
      path: pathId
    };
  }
  return false;
}
module.exports = exports['default'];
