'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * The rule will detect any restriction that is placed on a property from within a definition
 * The restrictions have been selected from the swagger 2.0 specification available here: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
 * The current rule applies only to NEW restrictions not for a change in value of an existing restriction
 */
exports.default = addObjectPropertyRestriction;
function addObjectPropertyRestriction(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'N' && path.length >= 3 && path[path.length - 3] === 'properties' && 
      (path[path.length - 1] === 'maximum' ||
       path[path.length - 1] === 'exclusiveMaximum' ||
       path[path.length - 1] === 'minimum' ||
       path[path.length - 1] === 'exclusiveMinimum' ||
       path[path.length - 1] === 'maxLength' ||
       path[path.length - 1] === 'minLength' ||
       path[path.length - 1] === 'pattern' ||
       path[path.length - 1] === 'maxItems' ||
       path[path.length - 1] === 'minItems' ||
       path[path.length - 1] === 'multipleOf' ||
       path[path.length - 1] === 'uniqueItems' ||
       path[path.length - 1] === 'maxProperties' ||
       path[path.length - 1] === 'minProperties');

  if (match) {
    var objectPath = '/' + path.slice(0, -3).join('/').replace('//', '/');
    var propertyName = path[path.length - 2];
    return {
      message: objectPath + ' - For property \'' + propertyName + '\' a new restriction has been added, ' +  path[path.length - 1] + ' with value: ' + rhs,
      path: objectPath,
      property: propertyName,
      restriction: path[path.length - 1],
      restrictionValue: rhs
    };
  }
  return false;
}
module.exports = exports['default'];