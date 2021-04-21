'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addRequiredComponentParam;
function addRequiredComponentParam(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'N' && path.length === 3 && path[0] === 'components' && path[1] === 'parameters' 
      && rhs.required === true && rhs.in === 'query';
  if (match) {
    var pathId = path[1];
    var paramName = path[2];
    return {
      message: '/components/parameters - Required param ' + paramName + ' added',
      path: pathId,
      param: paramName
    };
  }
  return false;
}
module.exports = exports['default'];