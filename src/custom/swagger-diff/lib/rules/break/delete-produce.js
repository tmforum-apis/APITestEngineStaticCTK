'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = deleteProduce;
function deleteProduce (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var index = _ref.index;
  var item = _ref.item;

  var match = kind === 'A' && path.length === 4 && path[0] === 'paths' && path[3] === 'produces' && item.kind === 'D';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    return {
      message: pathId + ' (' + method + ') - Produces ' + item.lhs + ' deleted',
      path: pathId,
      method: method,
      produce: item.lhs
    };
  }
  return false;
}
module.exports = exports['default'];
