'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = editObjectPropertyRequired;
function editObjectPropertyRequired (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match =
    (kind === 'N' || kind === 'E') &&
    path.length >= 3 &&
    path[path.length - 3] === 'properties' &&
    path[path.length - 1] === 'required' &&
    rhs === true;
  if (match) {
    var objectPath = '/' + path.slice(0, -3).join('/').replace('//', '/');
    var propertyName = path[path.length - 2];
    return {
      message: objectPath + ' - Property ' + propertyName + ' became required',
      path: objectPath,
      property: propertyName
    };
  }
  return false;
}
module.exports = exports['default'];
