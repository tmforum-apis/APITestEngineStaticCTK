'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addComponentObject;
function addComponentObject(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'N' && path.length >= 2 && path[0] === 'components' &&  
       (['responses', 'parameters', 'examples', 'requestBodies', 'headers', 'securitySchemes', 'links', 'callbacks'].indexOf(path[1]) > -1);
  if (match) {
    var objectPath = '/' + path.slice(0, -1).join('/').replace('//', '/');
    var id = path[path.length - 1];
    return {
      message: objectPath + ' - Added component ' + path[1] + ' ' + id,
      componentId: id,
      path: objectPath
    };
  }
  return false;
}
module.exports = exports['default'];