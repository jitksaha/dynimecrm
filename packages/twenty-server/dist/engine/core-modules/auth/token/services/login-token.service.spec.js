"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _authexception = require("../../auth.exception");
const _jwttokentypeenum = require("../../types/jwt-token-type.enum");
const _logintokenservice = require("./login-token.service");
describe('LoginTokenService', ()=>{
    const jwtWrapperService = {
        decode: jest.fn(),
        signAsyncOrThrow: jest.fn(),
        verifyJwtToken: jest.fn()
    };
    const twentyConfigService = {
        get: jest.fn().mockReturnValue('1h')
    };
    const service = new _logintokenservice.LoginTokenService(jwtWrapperService, twentyConfigService);
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    it('does not generate a login token without an authentication provider', async ()=>{
        await expect(service.generateLoginToken('test@example.com', 'workspace-id', undefined)).rejects.toMatchObject({
            code: _authexception.AuthExceptionCode.INVALID_INPUT
        });
        expect(jwtWrapperService.signAsyncOrThrow).not.toHaveBeenCalled();
    });
    it('rejects a login token without an authentication provider', async ()=>{
        jwtWrapperService.decode.mockReturnValue({
            type: _jwttokentypeenum.JwtTokenTypeEnum.LOGIN,
            sub: 'test@example.com',
            workspaceId: 'workspace-id'
        });
        await expect(service.verifyLoginToken('login-token')).rejects.toMatchObject({
            code: _authexception.AuthExceptionCode.UNAUTHENTICATED
        });
    });
});

//# sourceMappingURL=login-token.service.spec.js.map