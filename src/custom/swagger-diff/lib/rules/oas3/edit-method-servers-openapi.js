'use strict';
const pathM = require('path');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editMethodServers;
function editMethodServers(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = (kind === 'E' || kind === 'N') &&  path.length > 2 && path[0] === 'paths' && 
                              path[3] === 'servers' && path[path.length - 1] != 'description';
  if (match) {
    let relativePath = pathM.relative(lhs, rhs);
    if (relativePath != '') {
      var objectPath = '/' + path.slice(0, -1).join('/').replace('//', '/');
      return {
        message: 'Servers turned from ' + lhs + ' to ' + rhs,
        previousBasePath: lhs,
        currentBasePath: rhs,
        path: objectPath
      };
    }
  }
  return false;
}
module.exports = exports['default'];