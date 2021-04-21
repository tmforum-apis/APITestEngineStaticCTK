'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editParamTypeComponent;
function editParamTypeComponent(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length >= 4 && path[0] === 'components' && path[1] === 'parameters' && path[path.length - 1] === 'type';
  if (match) {
    var pathId = path[1];
    var paramName = path[2];
    return {
      message: '/components/parameters - Param ' + paramName + ' type turn from from ' + lhs + ' to ' + rhs,
      path: pathId,
      param: paramName,
      previousType: lhs,
      currentType: rhs
    };
  }
  return false;
}
module.exports = exports['default'];