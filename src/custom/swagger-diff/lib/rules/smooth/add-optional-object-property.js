'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = addOptionalObjectProperty;
function addOptionalObjectProperty (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'N' && path.length >= 3 && path[path.length - 2] === 'properties' && !rhs.required;
  if (match) {
    var objectPath = '/' + path.slice(0, -2).join('/').replace('//', '/');
    var propertyName = path[path.length - 1];
    return {
      message: objectPath + ' - Optional property ' + propertyName + ' added',
      path: objectPath,
      property: propertyName
    };
  }
  return false;
}
module.exports = exports['default'];
