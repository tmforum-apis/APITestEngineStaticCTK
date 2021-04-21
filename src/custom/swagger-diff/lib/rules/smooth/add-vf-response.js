'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = addOptionalResponse;
function addOptionalResponse (_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var stringValue = 'responses';
  var includesField = path.includes(stringValue);
  // console.log(includesField);

  /*  if (kind === 'N') {
    if (path[0] === 'paths') {
      if (includesField == true) {
        
          console.log('working');
        
      }
    }
  }  */

  var match = kind === 'N' && path[0] === 'paths' && path[3] === 'responses';
  if (match) {
    var pathId = path[1];
    var method = path[2];
    var paramName = path[3];
    return {
      message: pathId + ' (' + method + ') - Optional response ' + stringValue + ' ' + paramName + ' added ',
      path: pathId,
      method: method
    };
  }
  return false;
}
module.exports = exports['default'];
