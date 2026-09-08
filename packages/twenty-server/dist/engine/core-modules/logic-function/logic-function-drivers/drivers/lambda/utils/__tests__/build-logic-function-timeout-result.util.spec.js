"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildlogicfunctiontimeoutresultutil = require("../build-logic-function-timeout-result.util");
const _logicfunctionexecutionresultdto = require("../../../../../../../metadata-modules/logic-function/dtos/logic-function-execution-result.dto");
describe('buildLogicFunctionTimeoutResult', ()=>{
    it('returns an ERROR result for a timeout', ()=>{
        const result = (0, _buildlogicfunctiontimeoutresultutil.buildLogicFunctionTimeoutResult)(30_000);
        expect(result.status).toBe(_logicfunctionexecutionresultdto.LogicFunctionExecutionStatus.ERROR);
        expect(result.data).toBeNull();
        expect(result.error?.errorType).toBe('TimeoutError');
        expect(result.error?.errorMessage).toBe('Function execution timed out after 30s');
        expect(result.duration).toBe(30_000);
    });
    it('rounds the timeout to whole seconds', ()=>{
        expect((0, _buildlogicfunctiontimeoutresultutil.buildLogicFunctionTimeoutResult)(900_000).error?.errorMessage).toBe('Function execution timed out after 900s');
        expect((0, _buildlogicfunctiontimeoutresultutil.buildLogicFunctionTimeoutResult)(1_500).error?.errorMessage).toBe('Function execution timed out after 2s');
    });
});

//# sourceMappingURL=build-logic-function-timeout-result.util.spec.js.map