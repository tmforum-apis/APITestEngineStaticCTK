'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deleteComponentField;
function deleteComponentField(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'D' && path.length >= 2 && path[0] === 'components' &&  
       (['responses', 'parameters', 'examples', 'requestBodies', 'headers', 'securitySchemes', 'links', 'callbacks'].indexOf(path[1]) > -1);
  if (match) {
    var objectPath = path.slice(0, -1).join('/');
    var id = path[path.length - 1];
    return {
      message: objectPath + ' - Component ' + path[1] + ' ' + id + ' deleted',
      path: objectPath,
      componentId: id,
    };
  }
  return false;
}
module.exports = exports['default'];