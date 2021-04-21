'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editComponentField;
function editComponentField(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length >= 2 && path[0] === 'components' &&  
       (['responses', 'parameters', 'examples', 'requestBodies', 'headers', 'securitySchemes', 'links', 'callbacks'].indexOf(path[1]) >= 0);
  if (match) {
    var objectPath = path.slice(0, -1).join('/');
    var id = path[2];
    return {
      message: objectPath + ' - Component ' + path[1] + ' ' + id + ' turned from ' + lhs + ' to ' + rhs,
      path: objectPath,
      componentId: id,
      previousResponse: lhs,
      currentResponse: rhs
    };
  }
  return false;
}
module.exports = exports['default'];