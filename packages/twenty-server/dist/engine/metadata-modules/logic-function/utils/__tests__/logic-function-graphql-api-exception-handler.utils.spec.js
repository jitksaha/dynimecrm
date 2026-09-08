"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphqlerrorsutil = require("../../../../core-modules/graphql/utils/graphql-errors.util");
const _logicfunctionexception = require("../../logic-function.exception");
const _logicfunctiongraphqlapiexceptionhandlerutils = require("../logic-function-graphql-api-exception-handler.utils");
describe('logicFunctionGraphQLApiExceptionHandler', ()=>{
    it('should map LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED to UserInputError', ()=>{
        expect(()=>(0, _logicfunctiongraphqlapiexceptionhandlerutils.logicFunctionGraphQLApiExceptionHandler)(new _logicfunctionexception.LogicFunctionException('dependencies too large', _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED))).toThrow(_graphqlerrorsutil.UserInputError);
    });
    it('should map LOGIC_FUNCTION_NOT_FOUND to NotFoundError', ()=>{
        expect(()=>(0, _logicfunctiongraphqlapiexceptionhandlerutils.logicFunctionGraphQLApiExceptionHandler)(new _logicfunctionexception.LogicFunctionException('not found', _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_NOT_FOUND))).toThrow(_graphqlerrorsutil.NotFoundError);
    });
    it('should map LOGIC_FUNCTION_DISABLED to ForbiddenError', ()=>{
        expect(()=>(0, _logicfunctiongraphqlapiexceptionhandlerutils.logicFunctionGraphQLApiExceptionHandler)(new _logicfunctionexception.LogicFunctionException('disabled', _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DISABLED))).toThrow(_graphqlerrorsutil.ForbiddenError);
    });
    it('should rethrow LOGIC_FUNCTION_LAYER_BUILD_FAILED unchanged', ()=>{
        const exception = new _logicfunctionexception.LogicFunctionException('layer build failed', _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_LAYER_BUILD_FAILED);
        expect(()=>(0, _logicfunctiongraphqlapiexceptionhandlerutils.logicFunctionGraphQLApiExceptionHandler)(exception)).toThrow(exception);
    });
    it('should rethrow unknown errors unchanged', ()=>{
        const error = new Error('unrelated');
        expect(()=>(0, _logicfunctiongraphqlapiexceptionhandlerutils.logicFunctionGraphQLApiExceptionHandler)(error)).toThrow(error);
    });
});

//# sourceMappingURL=logic-function-graphql-api-exception-handler.utils.spec.js.map