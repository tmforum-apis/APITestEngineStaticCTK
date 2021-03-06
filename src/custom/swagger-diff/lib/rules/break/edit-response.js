'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = editResponse;
function editResponse (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match =
    kind === 'E' &&
    path.length === 7 &&
    path[0] === 'paths' &&
    path[3] === 'responses' &&
    path[5] === 'schema' &&
    path[6] === '$ref';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var responseId = path[4];
    return {
      message: pathId + ' (' + method + ') - Response ' + responseId + ' turned from ' + lhs + ' to ' + rhs,
      path: pathId,
      method: method,
      responseId: responseId,
      previousResponse: lhs,
      currentResponse: rhs
    };
  }
  return false;
}
module.exports = exports['default'];
