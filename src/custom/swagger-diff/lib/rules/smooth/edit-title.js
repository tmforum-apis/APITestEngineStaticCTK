'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editTitle;
function editTitle(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  var match = kind === 'E' && path.length === 2 && path[0] === 'info' && path[1] === 'title';
  if (match) {
    var pathId = path[0];
    var method = path[1];
    return {
      message: '/info/title - Title turned from ' + lhs + ' to ' + rhs,
      method: method,
      previousSummary: lhs,
      currentSummary: rhs
    };
  }
  return false;
}
module.exports = exports['default'];