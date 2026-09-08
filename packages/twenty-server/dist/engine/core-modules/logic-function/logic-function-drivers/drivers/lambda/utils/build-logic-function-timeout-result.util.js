"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildLogicFunctionTimeoutResult", {
    enumerable: true,
    get: function() {
        return buildLogicFunctionTimeoutResult;
    }
});
const _logicfunctionexecutionresultdto = require("../../../../../../metadata-modules/logic-function/dtos/logic-function-execution-result.dto");
const buildLogicFunctionTimeoutResult = (timeoutMs)=>({
        data: null,
        logs: '',
        duration: timeoutMs,
        billedDurationMs: timeoutMs,
        status: _logicfunctionexecutionresultdto.LogicFunctionExecutionStatus.ERROR,
        error: {
            errorType: 'TimeoutError',
            errorMessage: `Function execution timed out after ${Math.round(timeoutMs / 1_000)}s`,
            stackTrace: []
        }
    });

//# sourceMappingURL=build-logic-function-timeout-result.util.js.map