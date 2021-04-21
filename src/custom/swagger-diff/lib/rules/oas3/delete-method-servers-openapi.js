'use strict';
const pathM = require('path');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = delMethodServers;
function delMethodServers(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'D' &&  path.length > 2 && path[0] === 'paths' && 
                              path[3] === 'servers' && path[path.length - 1] != 'description';
  if (match) {
    var objectPath = path.slice(0, -1).join('/');
    return {
      message: 'Servers deleted',
      path: objectPath
  }
  }
  return false;
}
module.exports = exports['default'];