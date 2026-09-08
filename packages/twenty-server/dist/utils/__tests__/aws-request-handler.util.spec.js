"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _awsrequesthandlerutil = require("../aws-request-handler.util");
describe('buildAwsRequestHandlerOptions', ()=>{
    it('always sets a non-zero request timeout', ()=>{
        expect((0, _awsrequesthandlerutil.buildAwsRequestHandlerOptions)().requestTimeout).toBeGreaterThan(0);
    });
    it('always throws on request timeout rather than only warning', ()=>{
        expect((0, _awsrequesthandlerutil.buildAwsRequestHandlerOptions)().throwOnRequestTimeout).toBe(true);
    });
    it('always sets a non-zero connection timeout', ()=>{
        expect((0, _awsrequesthandlerutil.buildAwsRequestHandlerOptions)().connectionTimeout).toBeGreaterThan(0);
    });
    it('applies the defaults when called with no arguments', ()=>{
        expect((0, _awsrequesthandlerutil.buildAwsRequestHandlerOptions)()).toEqual({
            connectionTimeout: _awsrequesthandlerutil.AWS_DEFAULT_CONNECTION_TIMEOUT_MS,
            requestTimeout: _awsrequesthandlerutil.AWS_DEFAULT_REQUEST_TIMEOUT_MS,
            throwOnRequestTimeout: true,
            httpsAgent: {
                maxSockets: _awsrequesthandlerutil.AWS_DEFAULT_MAX_SOCKETS
            }
        });
    });
    it('allows callers with long-running requests to raise the timeouts', ()=>{
        const options = (0, _awsrequesthandlerutil.buildAwsRequestHandlerOptions)({
            requestTimeoutMs: 960_000,
            connectionTimeoutMs: 60_000
        });
        expect(options.requestTimeout).toBe(960_000);
        expect(options.connectionTimeout).toBe(60_000);
    });
    it('allows the socket pool size to be raised above the SDK default', ()=>{
        expect((0, _awsrequesthandlerutil.buildAwsRequestHandlerOptions)({
            maxSockets: 500
        }).httpsAgent.maxSockets).toBe(500);
    });
});

//# sourceMappingURL=aws-request-handler.util.spec.js.map