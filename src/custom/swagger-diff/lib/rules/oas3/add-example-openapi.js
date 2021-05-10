'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addExampleOAS;
function addExampleOAS(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;

  var match = kind === 'N' && path.length >= 3  && path[path.length - 1] === 'example';
  if (match) {
    var objectPath = '/' + path.slice(0, -1).join('/').replace('//', '/');
    var pathId = path[1];
    var method = path[path.length - 2];
    return {
      message: pathId + ' (' + method + ') - Example add',
      path: objectPath,
      method: method
    };
  }
  return false;
}
module.exports = exports['default'];