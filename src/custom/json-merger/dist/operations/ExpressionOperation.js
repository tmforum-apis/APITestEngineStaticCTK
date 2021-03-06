"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
//var safeEval = require("safe-eval");
var Operation_1 = require("./Operation");
var ExpressionOperation = (function (_super) {
    __extends(ExpressionOperation, _super);
    function ExpressionOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExpressionOperation.prototype.name = function () {
        return "expression";
    };
    ExpressionOperation.prototype.processInObject = function (keyword, source, target) {
        var keywordValue = source[keyword];
        var input;
        var expression;
        if (typeof keywordValue === "string") {
            expression = keywordValue;
        }
        else {
            if (typeof keywordValue.expression === "string") {
                expression = keywordValue.expression;
            }
            if (keywordValue.input !== undefined) {
                input = this._processor.processSourceProperty(keywordValue.input, "input");
            }
        }
        if (!expression) {
            return;
        }
        var evalContext = __assign(__assign({}, this._processor.currentScope.scopeVariables), { $sourceProperty: keywordValue, $targetProperty: target, $input: input });
        //return safeEval(expression, evalContext);
        return expression;
    };
    return ExpressionOperation;
}(Operation_1.default));
exports.default = ExpressionOperation;
//# sourceMappingURL=ExpressionOperation.js.map