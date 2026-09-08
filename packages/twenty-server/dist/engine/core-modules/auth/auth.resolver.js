"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthResolver", {
    enumerable: true,
    get: function() {
        return AuthResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _typeorm = require("@nestjs/typeorm");
const _bytes = /*#__PURE__*/ _interop_require_default(require("bytes"));
const _GraphQLUpload = /*#__PURE__*/ _interop_require_default(require("graphql-upload/GraphQLUpload.mjs"));
const _lodashomit = /*#__PURE__*/ _interop_require_default(require("lodash.omit"));
const _constants = require("twenty-shared/constants");
const _translations = require("twenty-shared/translations");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _settings = require("../../constants/settings");
const _apikeyservice = require("../api-key/services/api-key.service");
const _apptokenentity = require("../app-token/app-token.entity");
const _eventlogemitterservice = require("../event-logs/emit/event-log-emitter.service");
const _impersonation = require("../event-logs/emit/events/workspace-event/impersonation/impersonation");
const _authexception = require("./auth.exception");
const _apikeytokeninput = require("./dto/api-key-token.input");
const _apptokeninput = require("./dto/app-token.input");
const _authorizeappdto = require("./dto/authorize-app.dto");
const _authorizeappinput = require("./dto/authorize-app.input");
const _availableworkspacesandaccesstokensdto = require("./dto/available-workspaces-and-access-tokens.dto");
const _emailpasswordresetlinkdto = require("./dto/email-password-reset-link.dto");
const _emailpasswordresetlinkinput = require("./dto/email-password-reset-link.input");
const _getauthtokenfromemailverificationtokeninput = require("./dto/get-auth-token-from-email-verification-token.input");
const _getauthorizationurlforssodto = require("./dto/get-authorization-url-for-sso.dto");
const _getauthorizationurlforssoinput = require("./dto/get-authorization-url-for-sso.input");
const _invalidatepassworddto = require("./dto/invalidate-password.dto");
const _signupdto = require("./dto/sign-up.dto");
const _transienttokendto = require("./dto/transient-token.dto");
const _updatepasswordviaresettokeninput = require("./dto/update-password-via-reset-token.input");
const _validatepasswordresettokendto = require("./dto/validate-password-reset-token.dto");
const _validatepasswordresettokeninput = require("./dto/validate-password-reset-token.input");
const _verifyemailandgetlogintokendto = require("./dto/verify-email-and-get-login-token.dto");
const _authgraphqlapiexceptionfilter = require("./filters/auth-graphql-api-exception.filter");
const _resetpasswordservice = require("./services/reset-password.service");
const _throttlergraphqlapiexceptionfilter = require("../throttler/filters/throttler-graphql-api-exception.filter");
const _throttlerservice = require("../throttler/throttler.service");
const _signinupservice = require("./services/sign-in-up.service");
const _accesstokenservice = require("./token/services/access-token.service");
const _emailverificationtokenservice = require("./token/services/email-verification-token.service");
const _logintokenservice = require("./token/services/login-token.service");
const _refreshtokenservice = require("./token/services/refresh-token.service");
const _renewtokenservice = require("./token/services/renew-token.service");
const _ssoexchangetokenservice = require("./token/services/sso-exchange-token.service");
const _transienttokenservice = require("./token/services/transient-token.service");
const _workspaceagnostictokenservice = require("./token/services/workspace-agnostic-token.service");
const _authcontexttype = require("./types/auth-context.type");
const _jwttokentypeenum = require("./types/jwt-token-type.enum");
const _captchaguard = require("../captcha/captcha.guard");
const _captchagraphqlapiexceptionfilter = require("../captcha/filters/captcha-graphql-api-exception.filter");
const _subdomainavailabilitydto = require("../domain/subdomain-manager/dtos/subdomain-availability.dto");
const _workspacecreationdefaultsdto = require("../domain/subdomain-manager/dtos/workspace-creation-defaults.dto");
const _subdomainmanagerservice = require("../domain/subdomain-manager/services/subdomain-manager.service");
const _workspacedomainsservice = require("../domain/workspace-domains/services/workspace-domains.service");
const _emailverificationexceptionfilterutil = require("../email-verification/email-verification-exception-filter.util");
const _emailverificationconstants = require("../email-verification/email-verification.constants");
const _emailverificationservice = require("../email-verification/services/email-verification.service");
const _filewithsignurldto = require("../file/dtos/file-with-sign-url.dto");
const _filecorepictureservice = require("../file/file-core-picture/services/file-core-picture.service");
const _preventnesttoautologgraphqlerrorsfilter = require("../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _i18ncontexttype = require("../i18n/types/i18n-context.type");
const _impersonationdenialbyreasonconstant = require("../impersonation/constants/impersonation-denial-by-reason.constant");
const _impersonationdeniallogmessagebyreasonconstant = require("../impersonation/constants/impersonation-denial-log-message-by-reason.constant");
const _impersonationauthorizationservice = require("../impersonation/services/impersonation-authorization.service");
const _ssoservice = require("../sso/services/sso.service");
const _twofactorauthenticationverificationinput = require("../two-factor-authentication/dto/two-factor-authentication-verification.input");
const _twofactorauthenticationexceptionfilter = require("../two-factor-authentication/two-factor-authentication-exception.filter");
const _twofactorauthenticationservice = require("../two-factor-authentication/two-factor-authentication.service");
const _usersessioncookieservice = require("../user-session/services/user-session-cookie.service");
const _usersessionservice = require("../user-session/services/user-session.service");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _userworkspaceservice = require("../user-workspace/user-workspace.service");
const _userservice = require("../user/services/user.service");
const _userentity = require("../user/user.entity");
const _workspacetype = require("../workspace/types/workspace.type");
const _workspacegraphqlapiexceptionfilter = require("../workspace/filters/workspace-graphql-api-exception.filter");
const _workspaceentity = require("../workspace/workspace.entity");
const _authproviderdecorator = require("../../decorators/auth/auth-provider.decorator");
const _authuserdecorator = require("../../decorators/auth/auth-user.decorator");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _publicendpointguard = require("../../guards/public-endpoint.guard");
const _requireaccesstokenguard = require("../../guards/require-access-token.guard");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _userauthguard = require("../../guards/user-auth.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _permissionsgraphqlapiexceptionfilter = require("../../metadata-modules/permissions/utils/permissions-graphql-api-exception.filter");
const _getrequestbaseurlutil = require("../../../utils/get-request-base-url.util");
const _streamtobuffer = require("../../../utils/stream-to-buffer");
const _apikeytokendto = require("./dto/api-key-token.dto");
const _authtokendto = require("./dto/auth-token.dto");
const _authtokensdto = require("./dto/auth-tokens.dto");
const _getauthtokensfromlogintokeninput = require("./dto/get-auth-tokens-from-login-token.input");
const _getauthtokensfromssoexchangetokeninput = require("./dto/get-auth-tokens-from-sso-exchange-token.input");
const _logintokendto = require("./dto/login-token.dto");
const _signupinnewworkspaceinput = require("./dto/sign-up-in-new-workspace.input");
const _signupinput = require("./dto/sign-up.input");
const _usercredentialsinput = require("./dto/user-credentials.input");
const _userexistsdto = require("./dto/user-exists.dto");
const _userexistsinput = require("./dto/user-exists.input");
const _workspaceinvitehashvaliddto = require("./dto/workspace-invite-hash-valid.dto");
const _workspaceinvitehashinput = require("./dto/workspace-invite-hash.input");
const _authservice = require("./services/auth.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const PASSWORD_RESET_EMAIL_RATE_LIMIT_MAX = 3;
const PASSWORD_RESET_EMAIL_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
let AuthResolver = class AuthResolver {
    async checkUserExists(checkUserExistsInput) {
        return await this.authService.checkUserExists(checkUserExistsInput.email.toLowerCase());
    }
    async getAuthorizationUrlForSSO(params) {
        return await this.ssoService.getAuthorizationUrlForSSO(params.identityProviderId, (0, _lodashomit.default)(params, [
            'identityProviderId'
        ]));
    }
    async checkWorkspaceInviteHashIsValid(workspaceInviteHashValidInput) {
        return await this.authService.checkWorkspaceInviteHashIsValid(workspaceInviteHashValidInput.inviteHash);
    }
    async findWorkspaceFromInviteHash(workspaceInviteHashValidInput) {
        return await this.authService.findWorkspaceFromInviteHashOrFail(workspaceInviteHashValidInput.inviteHash);
    }
    async getLoginTokenFromCredentials(getLoginTokenFromCredentialsInput, origin) {
        const workspace = await this.workspaceDomainsService.getWorkspaceByOriginOrDefaultWorkspace(origin);
        (0, _utils.assertIsDefinedOrThrow)(workspace, new _authexception.AuthException('Workspace not found', _authexception.AuthExceptionCode.WORKSPACE_NOT_FOUND));
        const user = await this.authService.validateLoginWithPassword(getLoginTokenFromCredentialsInput, workspace);
        const loginToken = await this.loginTokenService.generateLoginToken(user.email, workspace.id, // email validation is active only for password flow
        _workspacetype.AuthProviderEnum.Password);
        return {
            loginToken
        };
    }
    async signIn(userCredentials, context) {
        const user = await this.authService.validateLoginWithPassword(userCredentials);
        const availableWorkspaces = await this.userWorkspaceService.findAvailableWorkspacesByEmail(user.email);
        const result = {
            availableWorkspaces: await this.userWorkspaceService.setLoginTokenToAvailableWorkspacesWhenAuthProviderMatch(availableWorkspaces, user, _workspacetype.AuthProviderEnum.Password),
            tokens: {
                accessOrWorkspaceAgnosticToken: await this.workspaceAgnosticTokenService.generateWorkspaceAgnosticToken({
                    userId: user.id,
                    authProvider: _workspacetype.AuthProviderEnum.Password
                }),
                refreshToken: await this.refreshTokenService.generateRefreshToken({
                    userId: user.id,
                    authProvider: _workspacetype.AuthProviderEnum.Password,
                    targetedTokenType: _jwttokentypeenum.JwtTokenTypeEnum.WORKSPACE_AGNOSTIC
                })
            }
        };
        await this.userSessionService.issueSessionForTokenPair({
            tokenPair: result.tokens,
            request: context.req,
            origin: 'sign_in'
        });
        return result;
    }
    async verifyEmailAndGetLoginToken(getAuthTokenFromEmailVerificationTokenInput, origin) {
        const appToken = await this.emailVerificationTokenService.validateEmailVerificationTokenOrThrow(getAuthTokenFromEmailVerificationTokenInput);
        if (appToken.context?.email && appToken.context.email !== appToken.user.email) {
            await this.userService.updateEmailFromVerificationToken(appToken.user.id, appToken.context.email);
        }
        const user = await this.userService.markEmailAsVerified(appToken.user.id);
        await this.appTokenRepository.remove(appToken);
        const workspace = await this.workspaceDomainsService.getWorkspaceByOriginOrDefaultWorkspace(origin) ?? await this.userWorkspaceService.findFirstWorkspaceByUserId(user.id);
        const loginToken = await this.loginTokenService.generateLoginToken(user.email, workspace.id, _workspacetype.AuthProviderEnum.Password);
        const workspaceUrls = this.workspaceDomainsService.getWorkspaceUrls(workspace);
        return {
            loginToken,
            workspaceUrls
        };
    }
    async verifyEmailAndGetWorkspaceAgnosticToken(getAuthTokenFromEmailVerificationTokenInput, context) {
        const appToken = await this.emailVerificationTokenService.validateEmailVerificationTokenOrThrow(getAuthTokenFromEmailVerificationTokenInput);
        if (appToken.context?.email && appToken.context.email !== appToken.user.email) {
            await this.userService.updateEmailFromVerificationToken(appToken.user.id, appToken.context.email);
        }
        const user = await this.userService.markEmailAsVerified(appToken.user.id);
        await this.appTokenRepository.remove(appToken);
        const availableWorkspaces = await this.userWorkspaceService.findAvailableWorkspacesByEmail(user.email);
        const result = {
            availableWorkspaces: await this.userWorkspaceService.setLoginTokenToAvailableWorkspacesWhenAuthProviderMatch(availableWorkspaces, user, _workspacetype.AuthProviderEnum.Password),
            tokens: {
                accessOrWorkspaceAgnosticToken: await this.workspaceAgnosticTokenService.generateWorkspaceAgnosticToken({
                    userId: user.id,
                    authProvider: _workspacetype.AuthProviderEnum.Password
                }),
                refreshToken: await this.refreshTokenService.generateRefreshToken({
                    userId: user.id,
                    authProvider: _workspacetype.AuthProviderEnum.Password,
                    targetedTokenType: _jwttokentypeenum.JwtTokenTypeEnum.WORKSPACE_AGNOSTIC
                })
            }
        };
        await this.userSessionService.issueSessionForTokenPair({
            tokenPair: result.tokens,
            request: context.req,
            origin: 'sign_in'
        });
        return result;
    }
    async getAuthTokensFromOTP(twoFactorAuthenticationVerificationInput, origin, context) {
        const { sub: email, authProvider, workspaceId } = await this.loginTokenService.verifyLoginToken(twoFactorAuthenticationVerificationInput.loginToken);
        const workspace = await this.validateWorkspaceAccess(origin, workspaceId);
        const user = await this.userService.findUserByEmailOrThrow(email);
        await this.twoFactorAuthenticationService.validateStrategy(user.id, twoFactorAuthenticationVerificationInput.otp, workspace.id, _types.TwoFactorAuthenticationStrategy.TOTP);
        const authTokens = await this.authService.verify(email, workspace.id, authProvider);
        await this.userSessionService.issueSessionForTokenPair({
            tokenPair: authTokens.tokens,
            request: context.req,
            origin: 'sign_in'
        });
        return authTokens;
    }
    async signUp(signUpInput, context) {
        const user = await this.signInUpService.signUpWithoutWorkspace({
            email: signUpInput.email,
            locale: signUpInput.locale
        }, {
            provider: _workspacetype.AuthProviderEnum.Password,
            password: signUpInput.password
        });
        const availableWorkspaces = await this.userWorkspaceService.findAvailableWorkspacesByEmail(user.email);
        await this.emailVerificationService.sendVerificationEmail({
            userId: user.id,
            email: user.email,
            workspace: undefined,
            locale: signUpInput.locale ?? _translations.SOURCE_LOCALE,
            verifyEmailRedirectPath: signUpInput.verifyEmailRedirectPath,
            verificationTrigger: _emailverificationconstants.EmailVerificationTrigger.SIGN_UP
        });
        const result = {
            availableWorkspaces: await this.userWorkspaceService.setLoginTokenToAvailableWorkspacesWhenAuthProviderMatch(availableWorkspaces, user, _workspacetype.AuthProviderEnum.Password),
            tokens: {
                accessOrWorkspaceAgnosticToken: await this.workspaceAgnosticTokenService.generateWorkspaceAgnosticToken({
                    userId: user.id,
                    authProvider: _workspacetype.AuthProviderEnum.Password
                }),
                refreshToken: await this.refreshTokenService.generateRefreshToken({
                    userId: user.id,
                    authProvider: _workspacetype.AuthProviderEnum.Password,
                    targetedTokenType: _jwttokentypeenum.JwtTokenTypeEnum.WORKSPACE_AGNOSTIC
                })
            }
        };
        await this.userSessionService.issueSessionForTokenPair({
            tokenPair: result.tokens,
            request: context.req,
            origin: 'sign_in'
        });
        return result;
    }
    async signUpInWorkspace(signUpInput) {
        const currentWorkspace = await this.authService.findWorkspaceForSignInUp({
            workspaceInviteHash: signUpInput.workspaceInviteHash,
            authProvider: _workspacetype.AuthProviderEnum.Password,
            workspaceId: signUpInput.workspaceId
        });
        const invitation = currentWorkspace && signUpInput.workspacePersonalInviteToken ? await this.authService.findInvitationForSignInUp({
            currentWorkspace,
            workspacePersonalInviteToken: signUpInput.workspacePersonalInviteToken
        }) : undefined;
        const existingUser = await this.userService.findUserByEmail(signUpInput.email);
        const { userData } = this.authService.formatUserDataPayload({
            email: signUpInput.email,
            locale: signUpInput.locale
        }, existingUser);
        await this.authService.checkAccessForSignIn({
            userData,
            invitation,
            workspaceInviteHash: signUpInput.workspaceInviteHash,
            workspace: currentWorkspace
        });
        const { user, workspace } = await this.authService.signInUp({
            userData,
            workspace: currentWorkspace,
            invitation,
            authParams: {
                provider: _workspacetype.AuthProviderEnum.Password,
                password: signUpInput.password
            }
        });
        await this.emailVerificationService.sendVerificationEmail({
            userId: user.id,
            email: user.email,
            workspace,
            locale: signUpInput.locale ?? _translations.SOURCE_LOCALE,
            verifyEmailRedirectPath: signUpInput.verifyEmailRedirectPath,
            verificationTrigger: _emailverificationconstants.EmailVerificationTrigger.SIGN_UP
        });
        const loginToken = await this.loginTokenService.generateLoginToken(user.email, workspace.id, _workspacetype.AuthProviderEnum.Password);
        return {
            loginToken,
            workspace: {
                id: workspace.id,
                workspaceUrls: this.workspaceDomainsService.getWorkspaceUrls(workspace)
            }
        };
    }
    async checkWorkspaceSubdomainAvailability(subdomain) {
        return this.subdomainManagerService.getSubdomainAvailability(subdomain);
    }
    async getWorkspaceCreationDefaults(currentUser) {
        const user = await this.userService.findUserByIdOrThrow(currentUser.id);
        return this.subdomainManagerService.getWorkspaceCreationDefaults(user.email);
    }
    async signUpInNewWorkspace(currentUser, authProvider, input) {
        (0, _utils.assertIsDefinedOrThrow)(authProvider, new _authexception.AuthException('Authentication provider is missing', _authexception.AuthExceptionCode.UNAUTHENTICATED));
        const fullUser = await this.userService.findUserByIdOrThrow(currentUser.id);
        const { user, workspace } = await this.signInUpService.signUpOnNewWorkspace({
            type: 'existingUser',
            existingUser: fullUser
        }, {
            displayName: input?.displayName,
            subdomain: input?.subdomain
        });
        const loginToken = await this.loginTokenService.generateLoginToken(user.email, workspace.id, authProvider);
        return {
            loginToken,
            workspace: {
                id: workspace.id,
                workspaceUrls: this.workspaceDomainsService.getWorkspaceUrls(workspace)
            }
        };
    }
    async uploadNewWorkspaceLogo(currentUser, workspaceId, { createReadStream, filename }) {
        const workspace = await this.fileCorePictureService.getPendingWorkspaceForLogoUploadOrThrow({
            userId: currentUser.id,
            workspaceId
        });
        const buffer = await (0, _streamtobuffer.streamToBuffer)(createReadStream(), (0, _bytes.default)(_settings.settings.storage.maxFileSize) ?? undefined);
        return this.fileCorePictureService.uploadWorkspacePicture({
            file: buffer,
            filename,
            workspace
        });
    }
    async generateTransientToken(user, workspace) {
        const workspaceMember = await this.userService.loadWorkspaceMember(user, workspace);
        if (!workspaceMember) {
            return;
        }
        const transientToken = await this.transientTokenService.generateTransientToken({
            workspaceId: workspace.id,
            userId: user.id,
            workspaceMemberId: workspaceMember.id
        });
        return {
            transientToken
        };
    }
    async getAuthTokensFromLoginToken(getAuthTokensFromLoginTokenInput, origin, context) {
        const tokenPayload = await this.validateAndDecodeLoginToken(getAuthTokensFromLoginTokenInput.loginToken);
        const workspace = await this.validateWorkspaceAccess(origin, tokenPayload.workspaceId);
        const { user, userWorkspace } = await this.validateUserAccess(tokenPayload.sub, tokenPayload.workspaceId);
        let authTokens;
        if (tokenPayload.authProvider === _workspacetype.AuthProviderEnum.Impersonation) {
            const { workspaceId, impersonatorUserWorkspaceId, impersonatedUserWorkspaceId, impersonatorUserId, impersonatedUserId } = await this.validateAndLogImpersonation(tokenPayload, workspace, user.email);
            authTokens = await this.authService.generateImpersonationAccessTokenAndRefreshToken({
                workspaceId,
                impersonatorUserWorkspaceId,
                impersonatedUserWorkspaceId,
                _impersonatorUserId: impersonatorUserId,
                impersonatedUserId
            });
        } else {
            await this.validateRegularAuthentication(workspace, userWorkspace);
            authTokens = await this.authService.verify(user.email, workspace.id, tokenPayload.authProvider);
        }
        await this.userSessionService.issueSessionForTokenPair({
            tokenPair: authTokens.tokens,
            request: context.req,
            origin: 'sign_in'
        });
        return authTokens;
    }
    async getAuthTokensFromSSOExchangeToken({ ssoExchangeToken }, context) {
        const { userId, authProvider } = await this.ssoExchangeTokenService.validateAndConsumeSSOExchangeTokenOrThrow(ssoExchangeToken);
        const authTokens = {
            tokens: {
                accessOrWorkspaceAgnosticToken: await this.workspaceAgnosticTokenService.generateWorkspaceAgnosticToken({
                    userId,
                    authProvider
                }),
                refreshToken: await this.refreshTokenService.generateRefreshToken({
                    userId,
                    authProvider,
                    targetedTokenType: _jwttokentypeenum.JwtTokenTypeEnum.WORKSPACE_AGNOSTIC
                })
            }
        };
        await this.userSessionService.issueSessionForTokenPair({
            tokenPair: authTokens.tokens,
            request: context.req,
            origin: 'sign_in'
        });
        return authTokens;
    }
    async validateAndDecodeLoginToken(loginToken) {
        return await this.loginTokenService.verifyLoginToken(loginToken);
    }
    async validateWorkspaceAccess(origin, tokenWorkspaceId) {
        const workspace = await this.workspaceDomainsService.getWorkspaceByOriginOrDefaultWorkspace(origin);
        (0, _utils.assertIsDefinedOrThrow)(workspace, new _authexception.AuthException('Workspace not found', _authexception.AuthExceptionCode.WORKSPACE_NOT_FOUND));
        if (tokenWorkspaceId !== workspace.id) {
            throw new _authexception.AuthException('Token is not valid for this workspace', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        return workspace;
    }
    async validateUserAccess(email, workspaceId) {
        const user = await this.userService.findUserByEmailOrThrow(email);
        await this.authService.checkIsEmailVerified(user.isEmailVerified);
        const userWorkspace = await this.userWorkspaceService.getUserWorkspaceForUserOrThrow({
            userId: user.id,
            workspaceId
        });
        return {
            user,
            userWorkspace
        };
    }
    async validateRegularAuthentication(workspace, userWorkspace) {
        await this.twoFactorAuthenticationService.validateTwoFactorAuthenticationRequirement(workspace, userWorkspace.twoFactorAuthenticationMethods);
    }
    async validateAndLogImpersonation(tokenPayload, workspace, targetUserEmail) {
        const { impersonatorUserWorkspaceId } = tokenPayload;
        const impersonatorUserWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                id: impersonatorUserWorkspaceId
            },
            relations: [
                'user',
                'workspace',
                'twoFactorAuthenticationMethods'
            ]
        });
        const toImpersonateUserWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                user: {
                    email: targetUserEmail
                },
                workspaceId: workspace.id
            },
            relations: [
                'user',
                'workspace'
            ]
        });
        if (!(0, _utils.isDefined)(impersonatorUserWorkspace) || !(0, _utils.isDefined)(toImpersonateUserWorkspace)) {
            throw new _authexception.AuthException('Impersonator or target user workspace not found', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        if (impersonatorUserWorkspace.userId === toImpersonateUserWorkspace.userId) {
            throw new _authexception.AuthException('User cannot impersonate themselves', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        const eventLogContext = this.eventLogEmitterService.createContext({
            workspaceId: workspace.id,
            userId: impersonatorUserWorkspace.user.id
        });
        const impersonationLevel = this.impersonationAuthorizationService.getImpersonationLevel(impersonatorUserWorkspace, toImpersonateUserWorkspace);
        void eventLogContext.insertWorkspaceEvent(_impersonation.IMPERSONATION_EVENT, {
            level: impersonationLevel,
            action: 'token_exchange_attempt',
            message: `Impersonation token exchange attempt for ${targetUserEmail} by ${impersonatorUserWorkspace.user.id}`
        });
        const authorizationResult = await this.impersonationAuthorizationService.checkImpersonationAuthorization(impersonatorUserWorkspace, toImpersonateUserWorkspace);
        if (!authorizationResult.allowed) {
            void eventLogContext.insertWorkspaceEvent(_impersonation.IMPERSONATION_EVENT, {
                level: authorizationResult.level,
                action: 'token_exchange_failed',
                message: _impersonationdeniallogmessagebyreasonconstant.IMPERSONATION_DENIAL_LOG_MESSAGE_BY_REASON[authorizationResult.reason]({
                    targetUserEmail,
                    impersonatorUserId: impersonatorUserWorkspace.user.id
                })
            });
            const { message, exceptionCode, userFriendlyMessage } = _impersonationdenialbyreasonconstant.IMPERSONATION_DENIAL_BY_REASON[authorizationResult.reason];
            throw new _authexception.AuthException(message, exceptionCode, {
                userFriendlyMessage
            });
        }
        void eventLogContext.insertWorkspaceEvent(_impersonation.IMPERSONATION_EVENT, {
            level: authorizationResult.level,
            action: 'token_exchange_success',
            message: `Impersonation token exchanged for ${targetUserEmail} by userId ${impersonatorUserWorkspace.user.id}`
        });
        return {
            workspaceId: workspace.id,
            impersonatorUserWorkspaceId: impersonatorUserWorkspace.id,
            impersonatedUserWorkspaceId: toImpersonateUserWorkspace.id,
            impersonatorUserId: impersonatorUserWorkspace.user.id,
            impersonatedUserId: toImpersonateUserWorkspace.user.id
        };
    }
    async authorizeApp(authorizeAppInput, user, workspace, context) {
        return await this.authService.generateAuthorizationCode({
            authorizeAppInput,
            user,
            workspace,
            requestBaseUrl: (0, _getrequestbaseurlutil.getRequestBaseUrl)(context.req)
        });
    }
    async renewToken(args, context) {
        const tokens = await this.renewTokenService.generateTokensFromRefreshToken(args.appToken);
        await this.userSessionService.issueSessionForTokenPair({
            tokenPair: tokens,
            request: context.req,
            origin: 'renewal_bridge'
        });
        return {
            tokens: tokens
        };
    }
    async signOut(context, refreshToken) {
        try {
            await this.userSessionService.signOut({
                sessionToken: this.userSessionCookieService.extractSessionTokenFromRequest(context.req),
                refreshToken
            });
        } finally{
            // This mutation is public and SameSite=Lax keeps the cookie off cross-site
            // POSTs, so clearing unconditionally would let any site sign a visitor out.
            if ((0, _utils.isDefined)(context.req.res) && this.userSessionCookieService.hasSessionCookie(context.req)) {
                this.userSessionCookieService.clearSessionCookie(context.req.res);
            }
        }
        return true;
    }
    async generateApiKeyToken(args, { id: workspaceId }) {
        return await this.apiKeyService.generateApiKeyToken(workspaceId, args.apiKeyId, args.expiresAt);
    }
    async generatePlaygroundToken(user, workspace, authProvider) {
        return await this.accessTokenService.generatePlaygroundToken({
            userId: user.id,
            workspaceId: workspace.id,
            authProvider
        });
    }
    async emailPasswordResetLink(emailPasswordResetInput, context) {
        const normalizedEmail = emailPasswordResetInput.email.toLowerCase();
        await this.throttlerService.tokenBucketThrottleOrThrow(`password-reset-email:${normalizedEmail}`, 1, PASSWORD_RESET_EMAIL_RATE_LIMIT_MAX, PASSWORD_RESET_EMAIL_RATE_LIMIT_WINDOW_MS);
        void this.resetPasswordService.generateAndSendPasswordResetLink({
            email: normalizedEmail,
            workspaceId: emailPasswordResetInput.workspaceId,
            locale: context.req.locale
        }).catch((error)=>{
            this.logger.error('Failed to send the password reset link', error);
        });
        return {
            success: true
        };
    }
    async updatePasswordViaResetToken({ passwordResetToken, newPassword }) {
        const { id } = await this.resetPasswordService.validatePasswordResetToken(passwordResetToken);
        await this.authService.updatePassword(id, newPassword);
        return await this.resetPasswordService.invalidatePasswordResetToken(id);
    }
    async validatePasswordResetToken(args) {
        return this.resetPasswordService.validatePasswordResetToken(args.passwordResetToken);
    }
    constructor(throttlerService, userWorkspaceRepository, appTokenRepository, twoFactorAuthenticationService, authService, renewTokenService, userService, apiKeyService, accessTokenService, resetPasswordService, loginTokenService, workspaceAgnosticTokenService, ssoExchangeTokenService, refreshTokenService, signInUpService, transientTokenService, emailVerificationService, workspaceDomainsService, userWorkspaceService, emailVerificationTokenService, ssoService, eventLogEmitterService, impersonationAuthorizationService, subdomainManagerService, fileCorePictureService, userSessionService, userSessionCookieService){
        this.throttlerService = throttlerService;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.appTokenRepository = appTokenRepository;
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
        this.authService = authService;
        this.renewTokenService = renewTokenService;
        this.userService = userService;
        this.apiKeyService = apiKeyService;
        this.accessTokenService = accessTokenService;
        this.resetPasswordService = resetPasswordService;
        this.loginTokenService = loginTokenService;
        this.workspaceAgnosticTokenService = workspaceAgnosticTokenService;
        this.ssoExchangeTokenService = ssoExchangeTokenService;
        this.refreshTokenService = refreshTokenService;
        this.signInUpService = signInUpService;
        this.transientTokenService = transientTokenService;
        this.emailVerificationService = emailVerificationService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.userWorkspaceService = userWorkspaceService;
        this.emailVerificationTokenService = emailVerificationTokenService;
        this.ssoService = ssoService;
        this.eventLogEmitterService = eventLogEmitterService;
        this.impersonationAuthorizationService = impersonationAuthorizationService;
        this.subdomainManagerService = subdomainManagerService;
        this.fileCorePictureService = fileCorePictureService;
        this.userSessionService = userSessionService;
        this.userSessionCookieService = userSessionCookieService;
        this.logger = new _common.Logger(AuthResolver.name);
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_captchaguard.CaptchaGuard, _publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    (0, _graphql.Query)(()=>_userexistsdto.CheckUserExistDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userexistsinput.EmailAndCaptchaInput === "undefined" ? Object : _userexistsinput.EmailAndCaptchaInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "checkUserExists", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_getauthorizationurlforssodto.GetAuthorizationUrlForSSODTO),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _getauthorizationurlforssoinput.GetAuthorizationUrlForSSOInput === "undefined" ? Object : _getauthorizationurlforssoinput.GetAuthorizationUrlForSSOInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "getAuthorizationUrlForSSO", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_workspaceinvitehashvaliddto.WorkspaceInviteHashValidDTO),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceinvitehashinput.WorkspaceInviteHashValidInput === "undefined" ? Object : _workspaceinvitehashinput.WorkspaceInviteHashValidInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "checkWorkspaceInviteHashIsValid", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_workspaceentity.WorkspaceEntity),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceinvitehashinput.WorkspaceInviteHashValidInput === "undefined" ? Object : _workspaceinvitehashinput.WorkspaceInviteHashValidInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "findWorkspaceFromInviteHash", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_logintokendto.LoginTokenDTO),
    (0, _common.UseGuards)(_captchaguard.CaptchaGuard, _publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Args)('origin')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usercredentialsinput.UserCredentialsInput === "undefined" ? Object : _usercredentialsinput.UserCredentialsInput,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "getLoginTokenFromCredentials", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_availableworkspacesandaccesstokensdto.AvailableWorkspacesAndAccessTokensDTO),
    (0, _common.UseGuards)(_captchaguard.CaptchaGuard, _publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usercredentialsinput.UserCredentialsInput === "undefined" ? Object : _usercredentialsinput.UserCredentialsInput,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "signIn", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_verifyemailandgetlogintokendto.VerifyEmailAndGetLoginTokenDTO),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Args)('origin')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _getauthtokenfromemailverificationtokeninput.GetAuthTokenFromEmailVerificationTokenInput === "undefined" ? Object : _getauthtokenfromemailverificationtokeninput.GetAuthTokenFromEmailVerificationTokenInput,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "verifyEmailAndGetLoginToken", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_availableworkspacesandaccesstokensdto.AvailableWorkspacesAndAccessTokensDTO),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _getauthtokenfromemailverificationtokeninput.GetAuthTokenFromEmailVerificationTokenInput === "undefined" ? Object : _getauthtokenfromemailverificationtokeninput.GetAuthTokenFromEmailVerificationTokenInput,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "verifyEmailAndGetWorkspaceAgnosticToken", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_authtokensdto.AuthTokens),
    (0, _common.UseGuards)(_captchaguard.CaptchaGuard, _publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Args)('origin')),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twofactorauthenticationverificationinput.TwoFactorAuthenticationVerificationInput === "undefined" ? Object : _twofactorauthenticationverificationinput.TwoFactorAuthenticationVerificationInput,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "getAuthTokensFromOTP", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_availableworkspacesandaccesstokensdto.AvailableWorkspacesAndAccessTokensDTO),
    (0, _common.UseGuards)(_captchaguard.CaptchaGuard, _publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usercredentialsinput.UserCredentialsInput === "undefined" ? Object : _usercredentialsinput.UserCredentialsInput,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "signUp", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_signupdto.SignUpDTO),
    (0, _common.UseGuards)(_captchaguard.CaptchaGuard, _publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _signupinput.SignUpInput === "undefined" ? Object : _signupinput.SignUpInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "signUpInWorkspace", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_subdomainavailabilitydto.SubdomainAvailabilityDTO),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)('subdomain')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "checkWorkspaceSubdomainAvailability", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_workspacecreationdefaultsdto.WorkspaceCreationDefaultsDTO),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authcontexttype.AuthContextUser === "undefined" ? Object : _authcontexttype.AuthContextUser
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "getWorkspaceCreationDefaults", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_signupdto.SignUpDTO),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authproviderdecorator.AuthProvider)()),
    _ts_param(2, (0, _graphql.Args)('input', {
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authcontexttype.AuthContextUser === "undefined" ? Object : _authcontexttype.AuthContextUser,
        typeof _workspacetype.AuthProviderEnum === "undefined" ? Object : _workspacetype.AuthProviderEnum,
        typeof _signupinnewworkspaceinput.SignUpInNewWorkspaceInput === "undefined" ? Object : _signupinnewworkspaceinput.SignUpInNewWorkspaceInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "signUpInNewWorkspace", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_filewithsignurldto.FileWithSignedUrlDTO),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _graphql.Args)('workspaceId')),
    _ts_param(2, (0, _graphql.Args)({
        name: 'file',
        type: ()=>_GraphQLUpload.default
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authcontexttype.AuthContextUser === "undefined" ? Object : _authcontexttype.AuthContextUser,
        String,
        typeof FileUpload === "undefined" ? Object : FileUpload
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "uploadNewWorkspaceLogo", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_transienttokendto.TransientTokenDTO),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authcontexttype.AuthContextUser === "undefined" ? Object : _authcontexttype.AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "generateTransientToken", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_authtokensdto.AuthTokens),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Args)('origin')),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _getauthtokensfromlogintokeninput.GetAuthTokensFromLoginTokenInput === "undefined" ? Object : _getauthtokensfromlogintokeninput.GetAuthTokensFromLoginTokenInput,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "getAuthTokensFromLoginToken", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_authtokensdto.AuthTokens),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _getauthtokensfromssoexchangetokeninput.GetAuthTokensFromSSOExchangeTokenInput === "undefined" ? Object : _getauthtokensfromssoexchangetokeninput.GetAuthTokensFromSSOExchangeTokenInput,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "getAuthTokensFromSSOExchangeToken", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_authorizeappdto.AuthorizeAppDTO),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authuserdecorator.AuthUser)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(3, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authorizeappinput.AuthorizeAppInput === "undefined" ? Object : _authorizeappinput.AuthorizeAppInput,
        typeof _authcontexttype.AuthContextUser === "undefined" ? Object : _authcontexttype.AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "authorizeApp", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_authtokensdto.AuthTokens),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _apptokeninput.AppTokenInput === "undefined" ? Object : _apptokeninput.AppTokenInput,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "renewToken", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Context)()),
    _ts_param(1, (0, _graphql.Args)('refreshToken', {
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "signOut", null);
_ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _requireaccesstokenguard.RequireAccessTokenGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.API_KEYS_AND_WEBHOOKS)),
    (0, _graphql.Mutation)(()=>_apikeytokendto.ApiKeyToken),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _apikeytokeninput.ApiKeyTokenInput === "undefined" ? Object : _apikeytokeninput.ApiKeyTokenInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "generateApiKeyToken", null);
_ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _requireaccesstokenguard.RequireAccessTokenGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.API_KEYS_AND_WEBHOOKS)),
    (0, _graphql.Mutation)(()=>_authtokendto.AuthToken),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authproviderdecorator.AuthProvider)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userentity.UserEntity === "undefined" ? Object : _userentity.UserEntity,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _workspacetype.AuthProviderEnum === "undefined" ? Object : _workspacetype.AuthProviderEnum
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "generatePlaygroundToken", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_emailpasswordresetlinkdto.EmailPasswordResetLinkDTO),
    (0, _common.UseGuards)(_captchaguard.CaptchaGuard, _publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _emailpasswordresetlinkinput.EmailPasswordResetLinkInput === "undefined" ? Object : _emailpasswordresetlinkinput.EmailPasswordResetLinkInput,
        typeof _i18ncontexttype.I18nContext === "undefined" ? Object : _i18ncontexttype.I18nContext
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "emailPasswordResetLink", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_invalidatepassworddto.InvalidatePasswordDTO),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updatepasswordviaresettokeninput.UpdatePasswordViaResetTokenInput === "undefined" ? Object : _updatepasswordviaresettokeninput.UpdatePasswordViaResetTokenInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "updatePasswordViaResetToken", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_validatepasswordresettokendto.ValidatePasswordResetTokenDTO),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _validatepasswordresettokeninput.ValidatePasswordResetTokenInput === "undefined" ? Object : _validatepasswordresettokeninput.ValidatePasswordResetTokenInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "validatePasswordResetToken", null);
AuthResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseFilters)(_captchagraphqlapiexceptionfilter.CaptchaGraphqlApiExceptionFilter, _authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter, _permissionsgraphqlapiexceptionfilter.PermissionsGraphqlApiExceptionFilter, _emailverificationexceptionfilterutil.EmailVerificationExceptionFilter, _twofactorauthenticationexceptionfilter.TwoFactorAuthenticationExceptionFilter, _workspacegraphqlapiexceptionfilter.WorkspaceGraphqlApiExceptionFilter, _throttlergraphqlapiexceptionfilter.ThrottlerGraphqlApiExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_apptokenentity.AppTokenEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _throttlerservice.ThrottlerService === "undefined" ? Object : _throttlerservice.ThrottlerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _twofactorauthenticationservice.TwoFactorAuthenticationService === "undefined" ? Object : _twofactorauthenticationservice.TwoFactorAuthenticationService,
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService,
        typeof _renewtokenservice.RenewTokenService === "undefined" ? Object : _renewtokenservice.RenewTokenService,
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService,
        typeof _apikeyservice.ApiKeyService === "undefined" ? Object : _apikeyservice.ApiKeyService,
        typeof _accesstokenservice.AccessTokenService === "undefined" ? Object : _accesstokenservice.AccessTokenService,
        typeof _resetpasswordservice.ResetPasswordService === "undefined" ? Object : _resetpasswordservice.ResetPasswordService,
        typeof _logintokenservice.LoginTokenService === "undefined" ? Object : _logintokenservice.LoginTokenService,
        typeof _workspaceagnostictokenservice.WorkspaceAgnosticTokenService === "undefined" ? Object : _workspaceagnostictokenservice.WorkspaceAgnosticTokenService,
        typeof _ssoexchangetokenservice.SSOExchangeTokenService === "undefined" ? Object : _ssoexchangetokenservice.SSOExchangeTokenService,
        typeof _refreshtokenservice.RefreshTokenService === "undefined" ? Object : _refreshtokenservice.RefreshTokenService,
        typeof _signinupservice.SignInUpService === "undefined" ? Object : _signinupservice.SignInUpService,
        typeof _transienttokenservice.TransientTokenService === "undefined" ? Object : _transienttokenservice.TransientTokenService,
        typeof _emailverificationservice.EmailVerificationService === "undefined" ? Object : _emailverificationservice.EmailVerificationService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _userworkspaceservice.UserWorkspaceService === "undefined" ? Object : _userworkspaceservice.UserWorkspaceService,
        typeof _emailverificationtokenservice.EmailVerificationTokenService === "undefined" ? Object : _emailverificationtokenservice.EmailVerificationTokenService,
        typeof _ssoservice.SSOService === "undefined" ? Object : _ssoservice.SSOService,
        typeof _eventlogemitterservice.EventLogEmitterService === "undefined" ? Object : _eventlogemitterservice.EventLogEmitterService,
        typeof _impersonationauthorizationservice.ImpersonationAuthorizationService === "undefined" ? Object : _impersonationauthorizationservice.ImpersonationAuthorizationService,
        typeof _subdomainmanagerservice.SubdomainManagerService === "undefined" ? Object : _subdomainmanagerservice.SubdomainManagerService,
        typeof _filecorepictureservice.FileCorePictureService === "undefined" ? Object : _filecorepictureservice.FileCorePictureService,
        typeof _usersessionservice.UserSessionService === "undefined" ? Object : _usersessionservice.UserSessionService,
        typeof _usersessioncookieservice.UserSessionCookieService === "undefined" ? Object : _usersessioncookieservice.UserSessionCookieService
    ])
], AuthResolver);

//# sourceMappingURL=auth.resolver.js.map