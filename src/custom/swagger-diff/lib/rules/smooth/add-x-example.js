'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = addxexample;
function addxexample (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var stringValue = 'x-example';
  // var includesField = path.includes(stringValue);
  // console.log(includesField);

  /*   if (kind === 'N') {
    if (path[0] === 'paths') {
      if (includesField == true) {
        if (Object.prototype.hasOwnProperty.call(rhs, 'in')) {
          console.log('florin');
        }
      }
    }
  } */

  var match = kind === 'N' && path[0] === 'paths' && path[path.length - 1] === stringValue; //&& Object.prototype.hasOwnProperty.call(rhs, 'in'); // && path[3] === 'get' && rhs.required === true && rhs.in === 'header';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var paramName = path[4];
    return {
      message: pathId + ' (' + method + ') - Optional parameter ' + stringValue + ' added',
      path: pathId,
      method: method
    };
  }
  return false;
}
module.exports = exports['default'];
