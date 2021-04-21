'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addOptionalParamComponent;
function addOptionalParamComponent(_ref) {
  var kind = _ref.kind;
  var path = _ref.path;
  var lhs = _ref.lhs;
  var rhs = _ref.rhs;

  /*if (kind==='N')
  {
    if (path.length===5)
    {
      if (path[0]==='paths'){
        if (path[3]=== 'parameters'){
          if (!rhs.required){
            if (!rhs.name){
              console.log('x');
            }

          }
        }
      }
    }
  }*/

  var matchComponent = kind === 'N' && path.length === 3 && path[0] === 'components' && path[1] === 'parameters' && 
              (!Object.prototype.hasOwnProperty.call(rhs, 'required') || ( rhs.required === false)) && 
              rhs.name!=='fields' && rhs.name!=='offset' && rhs.name!=='limit';

  if (matchComponent) {
    var pathId = path[1];
    var paramName = path[2];
    return {
      message: 'components/parameters - Optional param ' + paramName + ' added',
      path: pathId,
      param: paramName
    };
  }
  return false;
}
module.exports = exports['default'];