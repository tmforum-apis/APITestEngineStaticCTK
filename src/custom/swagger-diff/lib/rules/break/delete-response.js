'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = deleteResponse;
function deleteResponse (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'D' && path.length === 5 && path[0] === 'paths' && path[3] === 'responses';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var responseId = path[4];
    return {
      message: pathId + ' (' + method + ') - Response ' + responseId + ' deleted',
      path: pathId,
      reponseId: responseId,
      method: method
    };
  }
  return false;
}
module.exports = exports['default'];
