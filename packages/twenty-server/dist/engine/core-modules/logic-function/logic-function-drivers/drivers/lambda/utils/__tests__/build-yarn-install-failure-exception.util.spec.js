"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildyarninstallfailureexceptionutil = require("../build-yarn-install-failure-exception.util");
const _logicfunctionexception = require("../../../../../../../metadata-modules/logic-function/logic-function.exception");
describe('buildYarnInstallFailureException', ()=>{
    it('should map an out-of-memory kill to LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED', ()=>{
        const exception = (0, _buildyarninstallfailureexceptionutil.buildYarnInstallFailureException)({
            errorType: 'Runtime.OutOfMemory',
            errorMessage: 'Error: Runtime exited with error: signal: killed'
        });
        expect(exception.code).toBe(_logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED);
    });
    it('should map any other failure to LOGIC_FUNCTION_CREATE_FAILED', ()=>{
        const exception = (0, _buildyarninstallfailureexceptionutil.buildYarnInstallFailureException)({
            errorType: 'Error',
            errorMessage: 'yarn install failed: ENETDOWN'
        });
        expect(exception.code).toBe(_logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_CREATE_FAILED);
    });
    it('should map an empty payload to LOGIC_FUNCTION_CREATE_FAILED', ()=>{
        const exception = (0, _buildyarninstallfailureexceptionutil.buildYarnInstallFailureException)({});
        expect(exception.code).toBe(_logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_CREATE_FAILED);
    });
});

//# sourceMappingURL=build-yarn-install-failure-exception.util.spec.js.map