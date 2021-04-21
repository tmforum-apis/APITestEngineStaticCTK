'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deleteRequestBody;
function deleteRequestBody(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'D' && path.length > 4 && path[0] === 'paths' && 
                              path[3] === 'requestBody';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var object = path[path.length -1];
    var objectPath = path.slice(0, -3).join('/');
    return {
      message: pathId + ' - Deleted requestBody' + object,
      path: objectPath,
      method: method,
    };
  }
  return false;
}
module.exports = exports['default'];