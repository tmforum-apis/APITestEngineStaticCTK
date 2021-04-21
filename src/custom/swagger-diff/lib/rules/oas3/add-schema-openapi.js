'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addSchema;
function addSchema(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'N' && path.length >= 3  && path[0] === 'components' && path[1] === 'schemas';
  if (match) {
    var pathId = path[1];
    var object = path[path.length - 1];
    var p = '/' + path.slice(0, -1).join('/') + '/';
    return {
      message: pathId + ' - Added ' + object,
      path: pathId,
      schema: p
    };
  }
  return false;
}
module.exports = exports['default'];