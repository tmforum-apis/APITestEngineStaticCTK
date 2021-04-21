'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * !TODO description
 */
exports.default = editObjectPropertyRestriction;
function editObjectPropertyRestriction(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length >= 3 && path[path.length - 3] === 'properties' && 
      (path[path.length - 1] === 'maximum' ||
       path[path.length - 1] === 'exclusiveMaximum' ||
       path[path.length - 1] === 'minimum' ||
       path[path.length - 1] === 'exclusiveMinimum' ||
       path[path.length - 1] === 'maxLength' ||
       path[path.length - 1] === 'minLength' ||
       path[path.length - 1] === 'pattern' ||
       path[path.length - 1] === 'maxItems' ||
       path[path.length - 1] === 'minItems' ||
       path[path.length - 1] === 'uniqueItems' ||
       path[path.length - 1] === 'multipleOf' ||
       path[path.length - 1] === 'maxProperties' ||
       path[path.length - 1] === 'minProperties' ||
       path[path.length - 1] === 'enum');

  if (match) {
    var objectPath = path.slice(0, -3).join('/');
    var propertyName = path[path.length - 2];
    return {
      message: objectPath + ' - For property \'' + propertyName + '\' a restriction has been changed, ' +  path[path.length - 1] +'Previous value:'+lhs + ', new value: ' + rhs,
      path: objectPath,
      property: propertyName,
      restriction: path[path.length - 1],
      previousValue: lhs,
      currentValue: rhs
    };
  }
  return false;
}
module.exports = exports['default'];