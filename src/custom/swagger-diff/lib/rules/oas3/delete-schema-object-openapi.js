'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deleteSchemaObject;
function deleteSchemaObject(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'D' && path.length >= 3 && path[0] === 'components' && path[1] === 'schemas';
  if (match) {
    var pathId = path[1];
    var objectPath = path.slice(0, -1).join('/');
    return {
      message: pathId + ' - Deleted ' + path[path.length - 1],
      path: objectPath
    };
  }
  return false;
}
module.exports = exports['default'];