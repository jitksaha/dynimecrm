"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _jwttokentypeenum = require("../../auth/types/jwt-token-type.enum");
const _workspacetype = require("../../workspace/types/workspace.type");
const _usersessionservice = require("./user-session.service");
describe('UserSessionService.issueSessionForTokenPair', ()=>{
    const userSessionRepository = {
        create: jest.fn((input)=>input),
        save: jest.fn()
    };
    const jwtWrapperService = {
        decode: jest.fn().mockReturnValue({
            type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
            userId: 'user-id',
            workspaceId: 'workspace-id',
            userWorkspaceId: 'user-workspace-id',
            authProvider: _workspacetype.AuthProviderEnum.Password
        })
    };
    const twentyConfigService = {
        get: jest.fn().mockReturnValue('30d')
    };
    const userSessionCookieService = {
        attachSessionTokenToResponse: jest.fn(),
        clearSessionCookie: jest.fn(),
        extractSessionTokenFromRequest: jest.fn()
    };
    const service = new _usersessionservice.UserSessionService(userSessionRepository, {}, {}, twentyConfigService, jwtWrapperService, {}, userSessionCookieService);
    const tokenPair = {
        accessOrWorkspaceAgnosticToken: {
            token: 'access-token',
            expiresAt: new Date('2026-01-01T00:00:00.000Z')
        },
        refreshToken: {
            token: 'refresh-token',
            expiresAt: new Date('2026-01-01T00:00:00.000Z')
        }
    };
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    it('preserves the presented session when replacement creation fails', async ()=>{
        const creationError = new Error('session insert failed');
        userSessionCookieService.extractSessionTokenFromRequest.mockReturnValue('presented-session-token');
        userSessionRepository.save.mockRejectedValue(creationError);
        const revokeSessionByToken = jest.spyOn(service, 'revokeSessionByToken');
        await expect(service.issueSessionForTokenPair({
            tokenPair,
            request: {
                headers: {},
                ip: '127.0.0.1',
                res: {}
            },
            origin: 'sign_in'
        })).rejects.toBe(creationError);
        expect(revokeSessionByToken).not.toHaveBeenCalled();
        expect(userSessionCookieService.attachSessionTokenToResponse).not.toHaveBeenCalled();
        expect(userSessionCookieService.clearSessionCookie).not.toHaveBeenCalled();
    });
    it('fails when the required response is unavailable', async ()=>{
        await expect(service.issueSessionForTokenPair({
            tokenPair,
            request: {
                headers: {}
            },
            origin: 'sign_in'
        })).rejects.toThrow('Cannot issue a user session without an HTTP response');
        expect(userSessionRepository.save).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=user-session.service.spec.js.map