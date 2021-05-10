'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addContent;
function addContent(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;

  var match = kind === 'N' && path.length >= 3  && path[path.length - 1] === 'content';
  if (match) {
    var objectPath = '/' + path.slice(0, -1).join('/').replace('//', '/');
    var pathId = path[1];
    var method = path[path.length - 2];
    return {
      message: pathId + ' (' + method + ') - Content add',
      path: objectPath,
      method: method
    };
  }
  return false;
}
module.exports = exports['default'];