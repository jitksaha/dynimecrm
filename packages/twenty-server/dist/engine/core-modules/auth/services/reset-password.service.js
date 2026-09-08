"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResetPasswordService", {
    enumerable: true,
    get: function() {
        return ResetPasswordService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
const _datefns = require("date-fns");
const _ms = /*#__PURE__*/ _interop_require_default(require("ms"));
const _twentyemails = require("twenty-emails");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _apptokenentity = require("../../app-token/app-token.entity");
const _authexception = require("../auth.exception");
const _workspacedomainsservice = require("../../domain/workspace-domains/services/workspace-domains.service");
const _emailservice = require("../../email/email.service");
const _i18nservice = require("../../i18n/i18n.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _userservice = require("../../user/services/user.service");
const _workspaceentity = require("../../workspace/workspace.entity");
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
let ResetPasswordService = class ResetPasswordService {
    async generateAndSendPasswordResetLink({ email, workspaceId, locale }) {
        const generationResult = await this.generatePasswordResetToken(email, workspaceId);
        if (generationResult.status !== 'TOKEN_GENERATED') {
            this.logger.warn(`Password reset request silently ignored: ${generationResult.status}`);
            return;
        }
        await this.rotatePasswordResetToken({
            userId: generationResult.user.id,
            resetToken: generationResult.resetToken
        });
        await this.sendEmailPasswordResetLink({
            resetToken: generationResult.resetToken,
            user: generationResult.user,
            workspace: generationResult.workspace,
            locale
        });
    }
    async generatePasswordResetToken(email, workspaceId) {
        const user = await this.userService.findUserByEmail(email);
        if (!(0, _utils.isDefined)(user)) {
            return {
                status: 'USER_NOT_FOUND'
            };
        }
        const targetWorkspace = await this.resolveTargetWorkspace(user.id, workspaceId);
        if (!(0, _utils.isDefined)(targetWorkspace)) {
            return {
                status: 'NO_PASSWORD_AUTH_ENABLED_WORKSPACE_FOUND'
            };
        }
        const expiresIn = this.twentyConfigService.get('PASSWORD_RESET_TOKEN_EXPIRES_IN');
        if (!expiresIn) {
            throw new _authexception.AuthException('PASSWORD_RESET_TOKEN_EXPIRES_IN constant value not found', _authexception.AuthExceptionCode.INTERNAL_SERVER_ERROR);
        }
        const expiresAt = (0, _datefns.addMilliseconds)(new Date().getTime(), (0, _ms.default)(expiresIn));
        const plainResetToken = _crypto.default.randomBytes(32).toString('hex');
        return {
            status: 'TOKEN_GENERATED',
            resetToken: {
                workspaceId: targetWorkspace.id,
                passwordResetToken: plainResetToken,
                passwordResetTokenExpiresAt: expiresAt
            },
            user,
            workspace: targetWorkspace
        };
    }
    async rotatePasswordResetToken({ userId, resetToken }) {
        const hashedResetToken = _crypto.default.createHash('sha256').update(resetToken.passwordResetToken).digest('hex');
        await this.appTokenRepository.manager.transaction(async (entityManager)=>{
            const appTokenRepository = entityManager.getRepository(_apptokenentity.AppTokenEntity);
            await appTokenRepository.update({
                userId,
                type: _apptokenentity.AppTokenType.PasswordResetToken
            }, {
                revokedAt: new Date()
            });
            await appTokenRepository.save({
                userId,
                workspaceId: resetToken.workspaceId,
                value: hashedResetToken,
                expiresAt: resetToken.passwordResetTokenExpiresAt,
                type: _apptokenentity.AppTokenType.PasswordResetToken
            });
        });
    }
    async resolveTargetWorkspace(userId, workspaceId) {
        if (!(0, _utils.isDefined)(workspaceId)) {
            return this.findFirstPasswordAuthEnabledWorkspace(userId);
        }
        const requestedWorkspace = await this.workspaceRepository.findOne({
            where: {
                id: workspaceId,
                isPasswordAuthEnabled: true,
                workspaceUsers: {
                    user: {
                        id: userId
                    }
                }
            }
        });
        return (0, _utils.isDefined)(requestedWorkspace) ? requestedWorkspace : this.findFirstPasswordAuthEnabledWorkspace(userId);
    }
    async sendEmailPasswordResetLink({ resetToken, user, workspace, locale }) {
        const hasPassword = (0, _utils.isDefined)(user.passwordHash);
        const resetPasswordPath = (0, _utils.getAppPath)(_types.AppPath.ResetPassword, {
            passwordResetToken: resetToken.passwordResetToken
        });
        const link = this.workspaceDomainsService.buildWorkspaceURL({
            workspace,
            pathname: resetPasswordPath
        });
        const emailData = {
            link: link.toString(),
            duration: (0, _ms.default)((0, _datefns.differenceInMilliseconds)(resetToken.passwordResetTokenExpiresAt, new Date()), {
                long: true
            }),
            hasPassword,
            locale
        };
        const emailTemplate = (0, _twentyemails.PasswordResetLinkEmail)(emailData);
        const html = await (0, _twentyemails.renderEmail)(emailTemplate, {
            pretty: true
        });
        const text = await (0, _twentyemails.renderEmail)(emailTemplate, {
            plainText: true
        });
        const i18n = this.i18nService.getI18nInstance(locale);
        const subjectTemplate = hasPassword ? /*i18n*/ {
            id: "j0DfGR",
            message: "Action Needed to Reset Password"
        } : /*i18n*/ {
            id: "8Q5bRY",
            message: "Action Needed to Set Password"
        };
        const subject = i18n._(subjectTemplate);
        await this.emailService.send({
            from: `${this.twentyConfigService.get('EMAIL_FROM_NAME')} <${this.twentyConfigService.get('EMAIL_FROM_ADDRESS')}>`,
            to: user.email,
            subject,
            text,
            html
        });
        return {
            success: true
        };
    }
    async validatePasswordResetToken(resetToken) {
        const hashedResetToken = _crypto.default.createHash('sha256').update(resetToken).digest('hex');
        const token = await this.appTokenRepository.findOne({
            where: {
                value: hashedResetToken,
                type: _apptokenentity.AppTokenType.PasswordResetToken,
                expiresAt: (0, _typeorm1.MoreThan)(new Date()),
                revokedAt: (0, _typeorm1.IsNull)()
            }
        });
        if (!token || !token.userId) {
            throw new _authexception.AuthException('Token is invalid', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        const user = await this.userService.findUserByIdOrThrow(token.userId, new _authexception.AuthException('User not found', _authexception.AuthExceptionCode.INVALID_INPUT));
        return {
            id: user.id,
            email: user.email,
            hasPassword: (0, _utils.isDefined)(user.passwordHash)
        };
    }
    async invalidatePasswordResetToken(userId) {
        const user = await this.userService.findUserByIdOrThrow(userId, new _authexception.AuthException('User not found', _authexception.AuthExceptionCode.INVALID_INPUT));
        await this.appTokenRepository.update({
            userId: user.id,
            type: _apptokenentity.AppTokenType.PasswordResetToken
        }, {
            revokedAt: new Date()
        });
        return {
            success: true
        };
    }
    async findFirstPasswordAuthEnabledWorkspace(userId) {
        return await this.workspaceRepository.findOne({
            where: {
                workspaceUsers: {
                    user: {
                        id: userId
                    }
                },
                isPasswordAuthEnabled: true
            },
            order: {
                createdAt: 'ASC'
            }
        });
    }
    constructor(twentyConfigService, workspaceDomainsService, workspaceRepository, appTokenRepository, emailService, i18nService, userService){
        this.twentyConfigService = twentyConfigService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.workspaceRepository = workspaceRepository;
        this.appTokenRepository = appTokenRepository;
        this.emailService = emailService;
        this.i18nService = i18nService;
        this.userService = userService;
        this.logger = new _common.Logger(ResetPasswordService.name);
    }
};
ResetPasswordService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_apptokenentity.AppTokenEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService,
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService,
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService
    ])
], ResetPasswordService);

//# sourceMappingURL=reset-password.service.js.map