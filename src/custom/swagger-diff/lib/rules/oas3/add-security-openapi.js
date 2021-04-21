'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addSecurity;
function addSecurity(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;

  var match = (kind === 'N' || kind === 'A') && path.length >= 4 && path[0] === 'paths' && path[3] === 'security';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    return {
      message: pathId + ' (' + method + ') - Security object add',
      path: pathId,
      method: method
    };
  }
  return false;
}
module.exports = exports['default'];