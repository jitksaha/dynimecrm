"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildYarnInstallFailureException", {
    enumerable: true,
    get: function() {
        return buildYarnInstallFailureException;
    }
});
const _logicfunctionexception = require("../../../../../../metadata-modules/logic-function/logic-function.exception");
const buildYarnInstallFailureException = (payload)=>{
    if (payload.errorType === 'Runtime.OutOfMemory') {
        return new _logicfunctionexception.LogicFunctionException(`Yarn install Lambda ran out of memory: the dependency tree is too large to install`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED);
    }
    return new _logicfunctionexception.LogicFunctionException(`Yarn install Lambda failed: ${JSON.stringify(payload)}`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_CREATE_FAILED);
};

//# sourceMappingURL=build-yarn-install-failure-exception.util.js.map