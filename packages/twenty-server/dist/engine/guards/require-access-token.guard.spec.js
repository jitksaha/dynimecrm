"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _authexception = require("../core-modules/auth/auth.exception");
const _jwttokentypeenum = require("../core-modules/auth/types/jwt-token-type.enum");
const _requireaccesstokenguard = require("./require-access-token.guard");
const buildExecutionContext = (request)=>({
        getType: ()=>'http',
        switchToHttp: ()=>({
                getRequest: ()=>request
            })
    });
describe('RequireAccessTokenGuard', ()=>{
    const guard = new _requireaccesstokenguard.RequireAccessTokenGuard();
    it('allows a session ACCESS token', ()=>{
        const context = buildExecutionContext({
            tokenType: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS
        });
        expect(guard.canActivate(context)).toBe(true);
    });
    it('rejects a PLAYGROUND token so it cannot mint further tokens', ()=>{
        const context = buildExecutionContext({
            tokenType: _jwttokentypeenum.JwtTokenTypeEnum.PLAYGROUND
        });
        expect(()=>guard.canActivate(context)).toThrow(_authexception.AuthException);
    });
    it('rejects an API_KEY token', ()=>{
        const context = buildExecutionContext({
            tokenType: _jwttokentypeenum.JwtTokenTypeEnum.API_KEY
        });
        expect(()=>guard.canActivate(context)).toThrow(_authexception.AuthException);
    });
    it('rejects a request without a resolved token type', ()=>{
        const context = buildExecutionContext({
            tokenType: undefined
        });
        expect(()=>guard.canActivate(context)).toThrow(_authexception.AuthException);
    });
    it('denies when there is no request on the context', ()=>{
        const context = buildExecutionContext(undefined);
        expect(guard.canActivate(context)).toBe(false);
    });
});

//# sourceMappingURL=require-access-token.guard.spec.js.map