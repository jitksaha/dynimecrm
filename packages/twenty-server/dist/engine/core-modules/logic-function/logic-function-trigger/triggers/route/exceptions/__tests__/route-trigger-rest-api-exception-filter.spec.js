"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _routetriggerrestapiexceptionfilter = require("../route-trigger-rest-api-exception-filter");
const _routetriggerexception = require("../route-trigger.exception");
describe('RouteTriggerRestApiExceptionFilter', ()=>{
    const handleError = jest.fn();
    const response = {};
    const httpExceptionHandlerService = {
        handleError
    };
    const filter = new _routetriggerrestapiexceptionfilter.RouteTriggerRestApiExceptionFilter(httpExceptionHandlerService);
    const host = {
        switchToHttp: ()=>({
                getResponse: ()=>response
            })
    };
    afterEach(()=>{
        jest.clearAllMocks();
    });
    it('returns 500 and does NOT capture user-uncaught errors in Sentry', ()=>{
        const exception = new _routetriggerexception.RouteTriggerException('boom', _routetriggerexception.RouteTriggerExceptionCode.ROUTE_TRIGGER_USER_UNCAUGHT_ERROR);
        filter.catch(exception, host);
        expect(handleError).toHaveBeenCalledWith(exception, response, 500, undefined, undefined, {
            shouldBeCapturedBySentry: false
        });
    });
    it('returns 500 and captures platform errors in Sentry', ()=>{
        const exception = new _routetriggerexception.RouteTriggerException('boom', _routetriggerexception.RouteTriggerExceptionCode.ROUTE_TRIGGER_PLATFORM_ERROR);
        filter.catch(exception, host);
        expect(handleError).toHaveBeenCalledWith(exception, response, 500);
    });
    it('maps oversized dependencies to 422 without Sentry capture', ()=>{
        const exception = new _routetriggerexception.RouteTriggerException('dependencies too large', _routetriggerexception.RouteTriggerExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED);
        filter.catch(exception, host);
        expect(handleError).toHaveBeenCalledWith(exception, response, 422, undefined, undefined, {
            shouldBeCapturedBySentry: false
        });
    });
    it('maps a disabled function to 403', ()=>{
        const exception = new _routetriggerexception.RouteTriggerException('disabled', _routetriggerexception.RouteTriggerExceptionCode.FORBIDDEN_EXCEPTION);
        filter.catch(exception, host);
        expect(handleError).toHaveBeenCalledWith(exception, response, 403);
    });
    it('maps a suspended workspace to 403', ()=>{
        const exception = new _routetriggerexception.RouteTriggerException('suspended', _routetriggerexception.RouteTriggerExceptionCode.WORKSPACE_SUSPENDED);
        filter.catch(exception, host);
        expect(handleError).toHaveBeenCalledWith(exception, response, 403);
    });
    it('maps not-found codes to 404', ()=>{
        const exception = new _routetriggerexception.RouteTriggerException('missing', _routetriggerexception.RouteTriggerExceptionCode.LOGIC_FUNCTION_NOT_FOUND);
        filter.catch(exception, host);
        expect(handleError).toHaveBeenCalledWith(exception, response, 404);
    });
});

//# sourceMappingURL=route-trigger-rest-api-exception-filter.spec.js.map