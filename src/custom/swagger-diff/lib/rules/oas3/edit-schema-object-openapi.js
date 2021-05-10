'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editSchemaObject;
function editSchemaObject(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length >= 3 && path[0] === 'components' && path[1] === 'schemas' && path[path.length - 1] !== 'type';
  if (match) {
    var pathId = path[1];
    var objectPath = '/' + path.slice(0, -1).join('/').replace('//', '/');
    return {
      message: pathId + ' - Updated ' + path[path.length - 1],
      path: objectPath
    };
  }
  return false;
}
module.exports = exports['default'];