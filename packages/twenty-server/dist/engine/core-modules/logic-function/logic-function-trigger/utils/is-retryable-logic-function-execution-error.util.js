"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isRetryableLogicFunctionExecutionError", {
    enumerable: true,
    get: function() {
        return isRetryableLogicFunctionExecutionError;
    }
});
const _logicfunction = require("twenty-shared/logic-function");
const isRetryableLogicFunctionExecutionError = (logicFunctionExecutionError)=>logicFunctionExecutionError?.errorType === _logicfunction.RETRYABLE_LOGIC_FUNCTION_ERROR_NAME;

//# sourceMappingURL=is-retryable-logic-function-execution-error.util.js.map