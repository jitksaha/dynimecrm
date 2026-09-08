"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphqlerrorsutil = require("../../../../../core-modules/graphql/utils/graphql-errors.util");
const _logicfunctionexception = require("../../../../../metadata-modules/logic-function/logic-function.exception");
const _logicfunctiondependenciessizegraphqlapiexceptionhandlerutil = require("../logic-function-dependencies-size-graphql-api-exception-handler.util");
describe('logicFunctionDependenciesSizeGraphqlApiExceptionHandler', ()=>{
    it('should throw a metadata validation error carrying one logicFunction entry', ()=>{
        const exception = new _logicfunctionexception.LogicFunctionException("Dependency layer 'deps-abc' exceeds the Lambda layer size limit", _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED);
        let thrown;
        try {
            (0, _logicfunctiondependenciessizegraphqlapiexceptionhandlerutil.logicFunctionDependenciesSizeGraphqlApiExceptionHandler)(exception);
        } catch (error) {
            thrown = error;
        }
        expect(thrown).toBeInstanceOf(_graphqlerrorsutil.BaseGraphQLError);
        const extensions = thrown?.extensions;
        expect(extensions.summary).toEqual({
            totalErrors: 1,
            logicFunction: 1
        });
        expect(extensions.errors.logicFunction).toHaveLength(1);
        expect(extensions.errors.logicFunction?.[0].errors[0].code).toBe(_logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED);
        expect(extensions.errors.logicFunction?.[0].errors[0].value).toBe(exception.message);
    });
});

//# sourceMappingURL=logic-function-dependencies-size-graphql-api-exception-handler.util.spec.js.map