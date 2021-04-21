'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = addAPIProxyVersion;
function addAPIProxyVersion (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var stringValue = 'x-api-proxy-version';
  var match = (kind === 'E' || kind === 'N') && path[0] === 'info' && path[1] === 'x-api-proxy-version';

  if (match) {
    var pathId = path[0];
    var paramName = path[1];
    return {
      message: 'Extra swagger parameter: `' + stringValue + '` added',
      param: stringValue,
      value: rhs
    };
  }
  return false;
}
module.exports = exports['default'];
