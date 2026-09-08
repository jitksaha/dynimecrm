"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _apikeyservice = require("../api-key/services/api-key.service");
const _apptokenentity = require("../app-token/app-token.entity");
const _authexception = require("./auth.exception");
const _eventlogemitterservice = require("../event-logs/emit/event-log-emitter.service");
const _impersonationauthorizationservice = require("../impersonation/services/impersonation-authorization.service");
const _signinupservice = require("./services/sign-in-up.service");
const _accesstokenservice = require("./token/services/access-token.service");
const _refreshtokenservice = require("./token/services/refresh-token.service");
const _ssoexchangetokenservice = require("./token/services/sso-exchange-token.service");
const _workspaceagnostictokenservice = require("./token/services/workspace-agnostic-token.service");
const _captchaguard = require("../captcha/captcha.guard");
const _throttlerexception = require("../throttler/throttler.exception");
const _throttlerservice = require("../throttler/throttler.service");
const _subdomainmanagerservice = require("../domain/subdomain-manager/services/subdomain-manager.service");
const _workspacedomainsservice = require("../domain/workspace-domains/services/workspace-domains.service");
const _emailverificationservice = require("../email-verification/services/email-verification.service");
const _featureflagservice = require("../feature-flag/services/feature-flag.service");
const _filecorepictureservice = require("../file/file-core-picture/services/file-core-picture.service");
const _usersessioncookieservice = require("../user-session/services/user-session-cookie.service");
const _usersessionservice = require("../user-session/services/user-session.service");
const _ssoservice = require("../sso/services/sso.service");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
const _twofactorauthenticationservice = require("../two-factor-authentication/two-factor-authentication.service");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _userworkspaceservice = require("../user-workspace/user-workspace.service");
const _userservice = require("../user/services/user.service");
const _userentity = require("../user/user.entity");
const _workspacetype = require("../workspace/types/workspace.type");
const _permissionsservice = require("../../metadata-modules/permissions/permissions.service");
const _authresolver = require("./auth.resolver");
const _authservice = require("./services/auth.service");
const _resetpasswordservice = require("./services/reset-password.service");
const _emailverificationtokenservice = require("./token/services/email-verification-token.service");
const _logintokenservice = require("./token/services/login-token.service");
const _renewtokenservice = require("./token/services/renew-token.service");
const _transienttokenservice = require("./token/services/transient-token.service");
describe('AuthResolver', ()=>{
    let resolver;
    let appTokenRepository;
    let authService;
    let emailVerificationService;
    let emailVerificationTokenService;
    let loginTokenService;
    let resetPasswordService;
    let signInUpService;
    let throttlerService;
    let userService;
    let workspaceDomainsService;
    const mock_CaptchaGuard = {
        canActivate: jest.fn(()=>true)
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _authresolver.AuthResolver,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_apptokenentity.AppTokenEntity),
                    useValue: {
                        remove: jest.fn()
                    }
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_userentity.UserEntity),
                    useValue: {}
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_userworkspaceentity.UserWorkspaceEntity),
                    useValue: {}
                },
                {
                    provide: _authservice.AuthService,
                    useValue: {
                        checkAccessForSignIn: jest.fn(),
                        findWorkspaceForSignInUp: jest.fn(),
                        formatUserDataPayload: jest.fn(),
                        signInUp: jest.fn()
                    }
                },
                {
                    provide: _refreshtokenservice.RefreshTokenService,
                    useValue: {}
                },
                {
                    provide: _userservice.UserService,
                    useValue: {
                        findUserByEmail: jest.fn(),
                        findUserByIdOrThrow: jest.fn(),
                        markEmailAsVerified: jest.fn()
                    }
                },
                {
                    provide: _workspacedomainsservice.WorkspaceDomainsService,
                    useValue: {
                        buildWorkspaceURL: jest.fn().mockResolvedValue(new URL('http://localhost:3001')),
                        getWorkspaceByOriginOrDefaultWorkspace: jest.fn(),
                        getWorkspaceUrls: jest.fn()
                    }
                },
                {
                    provide: _subdomainmanagerservice.SubdomainManagerService,
                    useValue: {}
                },
                {
                    provide: _filecorepictureservice.FileCorePictureService,
                    useValue: {}
                },
                {
                    provide: _usersessionservice.UserSessionService,
                    useValue: {
                        issueSessionForTokenPair: jest.fn()
                    }
                },
                {
                    provide: _usersessioncookieservice.UserSessionCookieService,
                    useValue: {}
                },
                {
                    provide: _userworkspaceservice.UserWorkspaceService,
                    useValue: {
                        findAvailableWorkspacesByEmail: jest.fn(),
                        findFirstWorkspaceByUserId: jest.fn(),
                        setLoginTokenToAvailableWorkspacesWhenAuthProviderMatch: jest.fn()
                    }
                },
                {
                    provide: _renewtokenservice.RenewTokenService,
                    useValue: {}
                },
                {
                    provide: _signinupservice.SignInUpService,
                    useValue: {
                        signUpOnNewWorkspace: jest.fn()
                    }
                },
                {
                    provide: _apikeyservice.ApiKeyService,
                    useValue: {}
                },
                {
                    provide: _accesstokenservice.AccessTokenService,
                    useValue: {}
                },
                {
                    provide: _resetpasswordservice.ResetPasswordService,
                    useValue: {
                        generateAndSendPasswordResetLink: jest.fn().mockResolvedValue(undefined)
                    }
                },
                {
                    provide: _throttlerservice.ThrottlerService,
                    useValue: {
                        tokenBucketThrottleOrThrow: jest.fn()
                    }
                },
                {
                    provide: _logintokenservice.LoginTokenService,
                    useValue: {
                        generateLoginToken: jest.fn()
                    }
                },
                {
                    provide: _workspaceagnostictokenservice.WorkspaceAgnosticTokenService,
                    useValue: {
                        generateWorkspaceAgnosticToken: jest.fn()
                    }
                },
                {
                    provide: _ssoexchangetokenservice.SSOExchangeTokenService,
                    useValue: {}
                },
                {
                    provide: _transienttokenservice.TransientTokenService,
                    useValue: {}
                },
                {
                    provide: _emailverificationservice.EmailVerificationService,
                    useValue: {
                        sendVerificationEmail: jest.fn()
                    }
                },
                {
                    provide: _emailverificationtokenservice.EmailVerificationTokenService,
                    useValue: {
                        validateEmailVerificationTokenOrThrow: jest.fn()
                    }
                },
                {
                    provide: _impersonationauthorizationservice.ImpersonationAuthorizationService,
                    useValue: {}
                },
                {
                    provide: _permissionsservice.PermissionsService,
                    useValue: {}
                },
                {
                    provide: _featureflagservice.FeatureFlagService,
                    useValue: {}
                },
                {
                    provide: _ssoservice.SSOService,
                    useValue: {}
                },
                {
                    provide: _twofactorauthenticationservice.TwoFactorAuthenticationService,
                    useValue: {}
                },
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: {}
                },
                {
                    provide: _eventlogemitterservice.EventLogEmitterService,
                    useValue: {
                        createContext: jest.fn().mockReturnValue({
                            insertWorkspaceEvent: jest.fn()
                        })
                    }
                }
            ]
        }).overrideGuard(_captchaguard.CaptchaGuard).useValue(mock_CaptchaGuard).compile();
        resolver = module.get(_authresolver.AuthResolver);
        appTokenRepository = module.get((0, _typeorm.getRepositoryToken)(_apptokenentity.AppTokenEntity));
        authService = module.get(_authservice.AuthService);
        emailVerificationService = module.get(_emailverificationservice.EmailVerificationService);
        emailVerificationTokenService = module.get(_emailverificationtokenservice.EmailVerificationTokenService);
        loginTokenService = module.get(_logintokenservice.LoginTokenService);
        resetPasswordService = module.get(_resetpasswordservice.ResetPasswordService);
        signInUpService = module.get(_signinupservice.SignInUpService);
        throttlerService = module.get(_throttlerservice.ThrottlerService);
        userService = module.get(_userservice.UserService);
        workspaceDomainsService = module.get(_workspacedomainsservice.WorkspaceDomainsService);
    });
    it('should be defined', ()=>{
        expect(resolver).toBeDefined();
    });
    describe('password authentication provider propagation', ()=>{
        const user = {
            id: 'user-id',
            email: 'test@example.com'
        };
        const workspace = {
            id: 'workspace-id'
        };
        const loginToken = {
            token: 'login-token',
            expiresAt: new Date('2026-01-01T00:00:00.000Z')
        };
        it('uses the password provider when verifying an email on a workspace domain', async ()=>{
            const appToken = {
                user,
                context: {}
            };
            emailVerificationTokenService.validateEmailVerificationTokenOrThrow.mockResolvedValue(appToken);
            userService.markEmailAsVerified.mockResolvedValue(user);
            workspaceDomainsService.getWorkspaceByOriginOrDefaultWorkspace.mockResolvedValue(workspace);
            workspaceDomainsService.getWorkspaceUrls.mockReturnValue({
                subdomainUrl: 'https://workspace.example.com'
            });
            loginTokenService.generateLoginToken.mockResolvedValue(loginToken);
            await resolver.verifyEmailAndGetLoginToken({
                email: user.email,
                emailVerificationToken: 'email-verification-token'
            }, 'https://workspace.example.com');
            expect(loginTokenService.generateLoginToken).toHaveBeenCalledWith(user.email, workspace.id, _workspacetype.AuthProviderEnum.Password);
            expect(appTokenRepository.remove).toHaveBeenCalledWith(appToken);
        });
        it('uses the password provider when signing up in a workspace', async ()=>{
            authService.findWorkspaceForSignInUp.mockResolvedValue(workspace);
            userService.findUserByEmail.mockResolvedValue(null);
            authService.formatUserDataPayload.mockReturnValue({
                userData: {
                    type: 'newUser'
                }
            });
            authService.signInUp.mockResolvedValue({
                user,
                workspace
            });
            loginTokenService.generateLoginToken.mockResolvedValue(loginToken);
            workspaceDomainsService.getWorkspaceUrls.mockReturnValue({
                subdomainUrl: 'https://workspace.example.com'
            });
            await resolver.signUpInWorkspace({
                email: user.email,
                password: 'password'
            });
            expect(emailVerificationService.sendVerificationEmail).toHaveBeenCalled();
            expect(loginTokenService.generateLoginToken).toHaveBeenCalledWith(user.email, workspace.id, _workspacetype.AuthProviderEnum.Password);
        });
        it('rejects a missing provider before creating a new workspace', async ()=>{
            let caughtError;
            try {
                await resolver.signUpInNewWorkspace({
                    id: user.id
                }, undefined);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).toMatchObject({
                code: _authexception.AuthExceptionCode.UNAUTHENTICATED
            });
            expect(userService.findUserByIdOrThrow).not.toHaveBeenCalled();
            expect(signInUpService.signUpOnNewWorkspace).not.toHaveBeenCalled();
        });
    });
    describe('emailPasswordResetLink', ()=>{
        const emailPasswordResetInput = {
            email: 'test@example.com',
            workspaceId: 'workspace-id'
        };
        const context = {
            req: {
                locale: 'en'
            }
        };
        it('should send the password reset link and return success', async ()=>{
            const result = await resolver.emailPasswordResetLink(emailPasswordResetInput, context);
            expect(result).toEqual({
                success: true
            });
            expect(resetPasswordService.generateAndSendPasswordResetLink).toHaveBeenCalledWith({
                email: 'test@example.com',
                workspaceId: 'workspace-id',
                locale: 'en'
            });
        });
        it('should return success without waiting for the link to be sent', async ()=>{
            const loggerErrorSpy = jest.spyOn(_common.Logger.prototype, 'error').mockImplementation();
            resetPasswordService.generateAndSendPasswordResetLink.mockRejectedValue(new Error('database down'));
            const result = await resolver.emailPasswordResetLink(emailPasswordResetInput, context);
            expect(result).toEqual({
                success: true
            });
            expect(loggerErrorSpy).toHaveBeenCalledWith('Failed to send the password reset link', expect.any(Error));
        });
        it('should throttle and send with a normalized email address', async ()=>{
            await resolver.emailPasswordResetLink({
                email: 'TeSt@Example.com'
            }, context);
            expect(throttlerService.tokenBucketThrottleOrThrow).toHaveBeenCalledWith('password-reset-email:test@example.com', 1, expect.any(Number), expect.any(Number));
            expect(resetPasswordService.generateAndSendPasswordResetLink).toHaveBeenCalledWith(expect.objectContaining({
                email: 'test@example.com'
            }));
        });
        it('should surface the throttling error without sending the link', async ()=>{
            throttlerService.tokenBucketThrottleOrThrow.mockRejectedValue(new _throttlerexception.ThrottlerException('Limit reached', _throttlerexception.ThrottlerExceptionCode.LIMIT_REACHED));
            await expect(resolver.emailPasswordResetLink(emailPasswordResetInput, context)).rejects.toThrow(_throttlerexception.ThrottlerException);
            expect(resetPasswordService.generateAndSendPasswordResetLink).not.toHaveBeenCalled();
        });
        it('should rethrow non throttling errors', async ()=>{
            throttlerService.tokenBucketThrottleOrThrow.mockRejectedValue(new Error('cache down'));
            await expect(resolver.emailPasswordResetLink(emailPasswordResetInput, context)).rejects.toThrow('cache down');
            expect(resetPasswordService.generateAndSendPasswordResetLink).not.toHaveBeenCalled();
        });
    });
});

//# sourceMappingURL=auth.resolver.spec.js.map