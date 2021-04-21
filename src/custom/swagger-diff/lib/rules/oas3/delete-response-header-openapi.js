'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = delResponseHeader;
function delResponseHeader(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'D' && path.length >= 5 && path[0] === 'paths' && 
                              path[3] === 'responses' && path[5] === 'headers';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var responseId = path[4];
    var objectPath = path.slice(0, -1).join('/');
    return {
      message: pathId + ' - Deleted response header',
      path: objectPath,
      method: method,
      response: responseId
    };
  }
  return false;
}
module.exports = exports['default'];