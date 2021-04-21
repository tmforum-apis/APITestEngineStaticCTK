'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editRequestBody;
function editRequestBody(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length > 4 && path[0] === 'paths' && 
                              path[3] === 'requestBody';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var objectPath = path.slice(0, -3).join('/');
    return {
      message: pathId + ' - Updated requestBody',
      path: objectPath,
      method: method,
      previous: lhs,
      current: rhs
    };
  }
  return false;
}
module.exports = exports['default'];