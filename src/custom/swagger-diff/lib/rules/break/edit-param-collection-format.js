'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = editParamCollectionFormat;
/* eslint max-len: 0 */

function editParamCollectionFormat (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match =
    (kind === 'N' || kind === 'E') &&
    path.length === 6 &&
    path[0] === 'paths' &&
    path[3] === 'parameters' &&
    path[5] === 'collectionFormat';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var paramName = path[4];
    return {
      message:
        pathId +
        ' (' +
        method +
        ') - Param ' +
        paramName +
        ' collection format turn from ' +
        (lhs || '(none)') +
        ' to ' +
        (rhs || '(none)'),
      path: pathId,
      method: method,
      param: paramName,
      previousFormat: lhs,
      currentFormat: rhs
    };
  }
  return false;
}
module.exports = exports['default'];
