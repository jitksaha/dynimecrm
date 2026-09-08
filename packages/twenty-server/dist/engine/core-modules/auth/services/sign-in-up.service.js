"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SignInUpService", {
    enumerable: true,
    get: function() {
        return SignInUpService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _postgreserrorcodesconstants = require("../../../api/graphql/workspace-query-runner/constants/postgres-error-codes.constants");
const _usersignupeventnameconstants = require("../../../api/graphql/workspace-query-runner/constants/user-signup-event-name.constants");
const _eventlogemitterservice = require("../../event-logs/emit/event-log-emitter.service");
const _usersignup = require("../../event-logs/emit/events/workspace-event/user/user-signup");
const _workspacecreated = require("../../event-logs/emit/events/workspace-event/workspace/workspace-created");
const _apptokenentity = require("../../app-token/app-token.entity");
const _applicationservice = require("../../application/application.service");
const _billingcreditgranttypeenum = require("../../billing/enums/billing-credit-grant-type.enum");
const _billingcreditservice = require("../../billing/services/billing-credit.service");
const _billingservice = require("../../billing/services/billing.service");
const _authexception = require("../auth.exception");
const _authutil = require("../auth.util");
const _maxworkspaceswithoutenterprisekeyconstants = require("../constants/max-workspaces-without-enterprise-key.constants");
const _getsignupwithoutworkspacedecisionutil = require("../utils/get-sign-up-without-workspace-decision.util");
const _hasprovisionedsignupdestinationutil = require("../utils/has-provisioned-sign-up-destination.util");
const _dparegionconfigconstant = require("../../dpa/config/dpa-region-config.constant");
const _dpaagreemententity = require("../../dpa/entities/dpa-agreement.entity");
const _dpaagreementtypeenum = require("../../dpa/enums/dpa-agreement-type.enum");
const _builddpaagreementrecordutil = require("../../dpa/utils/build-dpa-agreement-record.util");
const _subdomainmanagerservice = require("../../domain/subdomain-manager/services/subdomain-manager.service");
const _enterpriseplanservice = require("../../enterprise/services/enterprise-plan.service");
const _exceptionhandlerservice = require("../../exception-handler/exception-handler.service");
const _filecorepictureservice = require("../../file/file-core-picture/services/file-core-picture.service");
const _metricsservice = require("../../metrics/metrics.service");
const _metricskeystype = require("../../metrics/types/metrics-keys.type");
const _onboardingservice = require("../../onboarding/onboarding.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _userworkspaceservice = require("../../user-workspace/user-workspace.service");
const _userservice = require("../../user/services/user.service");
const _userentity = require("../../user/user.entity");
const _workspaceinvitationservice = require("../../workspace-invitation/services/workspace-invitation.service");
const _workspacetype = require("../../workspace/types/workspace.type");
const _workspaceentity = require("../../workspace/workspace.entity");
const _workspaceexception = require("../../workspace/workspace.exception");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _workspaceeventemitter = require("../../../workspace-event-emitter/workspace-event-emitter");
const _getdomainfromemailorthrow = require("../../../../utils/get-domain-from-email-or-throw");
const _isworkemail = require("../../../../utils/is-work-email");
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
let SignInUpService = class SignInUpService {
    async computePartialUserFromUserPayload(newUserPayload, authParams) {
        if (!newUserPayload?.email) {
            throw new _authexception.AuthException('Email is required', _authexception.AuthExceptionCode.INVALID_INPUT, {
                userFriendlyMessage: /*i18n*/ {
                    id: "ZsZeV2",
                    message: "Email is required"
                }
            });
        }
        const partialNewUser = {
            email: newUserPayload.email,
            firstName: newUserPayload.firstName ?? '',
            lastName: newUserPayload.lastName ?? '',
            picture: newUserPayload.picture ?? '',
            locale: newUserPayload.locale ?? 'en',
            isEmailVerified: newUserPayload.isEmailAlreadyVerified
        };
        if (authParams.provider === _workspacetype.AuthProviderEnum.Password) {
            partialNewUser.passwordHash = await this.generateHash(authParams.password);
        }
        return partialNewUser;
    }
    async signInUp(params) {
        if (params.workspace && params.invitation) {
            return {
                workspace: params.workspace,
                user: await this.signInUpWithPersonalInvitation({
                    invitation: params.invitation,
                    userData: params.userData
                })
            };
        }
        if (params.workspace) {
            const updatedUser = await this.signInUpOnExistingWorkspace({
                workspace: params.workspace,
                userData: params.userData
            });
            return {
                user: updatedUser,
                workspace: params.workspace
            };
        }
        return await this.signUpOnNewWorkspace(params.userData);
    }
    async generateHash(password) {
        const isPasswordValid = _authutil.PASSWORD_REGEX.test(password);
        if (!isPasswordValid) {
            throw new _authexception.AuthException('Password too weak', _authexception.AuthExceptionCode.INVALID_INPUT, {
                userFriendlyMessage: /*i18n*/ {
                    id: "wT0H4O",
                    message: "Password too weak"
                }
            });
        }
        return await (0, _authutil.hashPassword)(password);
    }
    async validatePassword({ password, passwordHash }) {
        const isValid = await (0, _authutil.compareHash)(password, passwordHash);
        if (!isValid) {
            throw new _authexception.AuthException('Wrong password', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION, {
                userFriendlyMessage: /*i18n*/ {
                    id: "fV2Bu6",
                    message: "Wrong password"
                }
            });
        }
    }
    async signInUpWithPersonalInvitation(params) {
        if (!params.invitation) {
            throw new _authexception.AuthException('Invitation not found', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        const email = params.userData.type === 'newUserWithPicture' ? params.userData.newUserWithPicture.email : params.userData.existingUser.email;
        if (!email) {
            throw new _authexception.AuthException('Email is required', _authexception.AuthExceptionCode.INVALID_INPUT, {
                userFriendlyMessage: /*i18n*/ {
                    id: "ZsZeV2",
                    message: "Email is required"
                }
            });
        }
        const invitationValidation = await this.workspaceInvitationService.validatePersonalInvitation({
            workspacePersonalInviteToken: params.invitation.value,
            email
        });
        if (!invitationValidation?.isValid) {
            throw new _authexception.AuthException('Invitation not found', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        const updatedUser = await this.signInUpOnExistingWorkspace({
            workspace: invitationValidation.workspace,
            userData: params.userData,
            roleId: params.invitation.context?.roleId
        });
        if (params.invitation.type === _apptokenentity.AppTokenType.OnboardingInvitationToken && params.userData.type === 'newUserWithPicture') {
            try {
                await this.billingCreditService.grantCredits({
                    workspaceId: invitationValidation.workspace.id,
                    amountMicro: this.twentyConfigService.get('ONBOARDING_INVITE_TEAM_CREDITS_REWARD_PER_USER'),
                    type: _billingcreditgranttypeenum.BillingCreditGrantType.ONBOARDING_REWARD,
                    reason: 'Onboarding reward: invited teammate signed up',
                    idempotencyKey: `onboarding-invite-team:${invitationValidation.workspace.id}:${updatedUser.id}`
                });
            } catch (error) {
                this.logger.error(`Failed to credit onboarding invite reward for workspace ${invitationValidation.workspace.id}`, error);
            }
        }
        await this.workspaceInvitationService.invalidateWorkspaceInvitation(invitationValidation.workspace.id, email);
        await this.userService.markEmailAsVerified(updatedUser.id);
        return updatedUser;
    }
    async throwIfWorkspaceIsNotReadyForSignInUp(workspace, user) {
        if (workspace.activationStatus === _workspace.WorkspaceActivationStatus.ACTIVE || workspace.activationStatus === _workspace.WorkspaceActivationStatus.CREATED) {
            return;
        }
        if (user.userData.type !== 'existingUser') {
            throw new _authexception.AuthException('Workspace is not ready to welcome new members', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION, {
                userFriendlyMessage: /*i18n*/ {
                    id: "rklt6M",
                    message: "Workspace is not ready to welcome new members"
                }
            });
        }
        const userWorkspaceExists = await this.userWorkspaceService.checkUserWorkspaceExists(user.userData.existingUser.id, workspace.id);
        if (!userWorkspaceExists) {
            throw new _authexception.AuthException('Workspace is not ready to welcome new members', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION, {
                userFriendlyMessage: /*i18n*/ {
                    id: "rklt6M",
                    message: "Workspace is not ready to welcome new members"
                }
            });
        }
    }
    async signInUpOnExistingWorkspace(params) {
        await this.throwIfWorkspaceIsNotReadyForSignInUp(params.workspace, params);
        const isNewUser = params.userData.type === 'newUserWithPicture';
        if (isNewUser) {
            const userData = params.userData;
            const user = await this.saveNewUser(userData.newUserWithPicture, {
                canAccessFullAdminPanel: false,
                canImpersonate: false
            });
            await this.activateOnboardingForUser({
                user,
                workspace: params.workspace,
                shouldShowConnectAccountStep: true,
                shouldShowInstallAppsStep: false
            });
            await this.userWorkspaceService.addUserToWorkspaceIfUserNotInWorkspace(user, params.workspace, params.roleId);
            return user;
        }
        const userData = params.userData;
        const user = userData.existingUser;
        await this.userWorkspaceService.addUserToWorkspaceIfUserNotInWorkspace(user, params.workspace, params.roleId);
        return user;
    }
    async activateOnboardingForUser({ user, workspace, shouldShowConnectAccountStep, shouldShowInstallAppsStep }, queryRunner) {
        if (shouldShowConnectAccountStep) {
            await this.onboardingService.setOnboardingConnectAccountPending({
                userId: user.id,
                workspaceId: workspace.id,
                value: true
            }, queryRunner);
        }
        await this.onboardingService.setOnboardingCreateProfilePending({
            userId: user.id,
            workspaceId: workspace.id,
            value: true
        }, queryRunner);
        if (shouldShowInstallAppsStep) {
            await this.onboardingService.setOnboardingInstallAppsPending({
                userId: user.id,
                workspaceId: workspace.id,
                value: true
            }, queryRunner);
        }
    }
    async saveNewUser(newUserWithPicture, { canImpersonate, canAccessFullAdminPanel }, queryRunner) {
        const userCreated = this.userRepository.create({
            ...newUserWithPicture,
            canImpersonate,
            canAccessFullAdminPanel
        });
        const savedUser = queryRunner ? await queryRunner.manager.save(_userentity.UserEntity, userCreated) : await this.userRepository.save(userCreated);
        this.workspaceEventEmitter.emitCustomBatchEvent(_usersignupeventnameconstants.USER_SIGNUP_EVENT_NAME, [
            {
                workspaceId: savedUser.currentWorkspace?.id,
                userWorkspaceId: savedUser.currentUserWorkspace?.id,
                userId: savedUser.id,
                userEmail: newUserWithPicture.email,
                userFirstName: newUserWithPicture.firstName,
                userLastName: newUserWithPicture.lastName,
                locale: newUserWithPicture.locale,
                serverUrl: this.twentyConfigService.get('SERVER_URL'),
                serverId: this.twentyConfigService.get('SERVER_ID')
            }
        ], undefined);
        void this.eventLogEmitterService.createContext({
            workspaceId: savedUser.currentWorkspace?.id,
            userId: savedUser.id
        }).insertWorkspaceEvent(_usersignup.USER_SIGNUP_EVENT, {});
        void this.metricsService.incrementCounterForEvent({
            key: _metricskeystype.MetricsKeys.SignUpSuccess,
            shouldStoreInCache: false
        });
        return savedUser;
    }
    async isSignUpEnabled() {
        const workspaceCount = await this.workspaceRepository.count();
        return this.twentyConfigService.get('IS_MULTIWORKSPACE_ENABLED') || workspaceCount === 0;
    }
    async assertSignUpEnabled() {
        if (!await this.isSignUpEnabled()) {
            throw new _authexception.AuthException('New workspace setup is disabled', _authexception.AuthExceptionCode.SIGNUP_DISABLED);
        }
    }
    // Enforced here rather than at workspace creation so a restricted instance
    // stops accumulating verified users that can never reach a workspace.
    async assertSignUpWithoutWorkspaceAllowed(email) {
        const decision = (0, _getsignupwithoutworkspacedecisionutil.getSignUpWithoutWorkspaceDecision)({
            isMultiWorkspaceEnabled: this.twentyConfigService.get('IS_MULTIWORKSPACE_ENABLED'),
            isWorkspaceCreationLimitedToServerAdmins: this.twentyConfigService.get('IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS'),
            workspaceCount: await this.workspaceRepository.count()
        });
        if (decision === 'allowed') {
            return;
        }
        if (decision === 'requiresDestination' && await this.hasProvisionedDestination(email)) {
            return;
        }
        throw new _authexception.AuthException('New workspace setup is disabled', _authexception.AuthExceptionCode.SIGNUP_DISABLED);
    }
    async hasProvisionedDestination(email) {
        // Invitations are read directly instead of through the sign-in picker,
        // which hides HIDDEN workspaces: that is a listing rule, not a statement
        // that the invitee has nowhere to land.
        const invitations = await this.workspaceInvitationService.findInvitationsByEmail(email);
        if ((0, _hasprovisionedsignupdestinationutil.hasProvisionedSignUpDestination)(invitations)) {
            return true;
        }
        const { availableWorkspacesForSignUp } = await this.userWorkspaceService.findAvailableWorkspacesByEmail(email);
        return (0, _hasprovisionedsignupdestinationutil.hasProvisionedSignUpDestination)(availableWorkspacesForSignUp);
    }
    async hasServerAdmin() {
        const adminCount = await this.userRepository.count({
            where: {
                canAccessFullAdminPanel: true
            }
        });
        return adminCount > 0;
    }
    async assertWorkspaceCreationAllowed(userData) {
        await this.assertSignUpEnabled();
        const workspaceCount = await this.workspaceRepository.count();
        if (workspaceCount === 0) {
            return;
        }
        await this.assertWorkspaceCountWithinLimit(workspaceCount);
        if (!this.twentyConfigService.get('IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS')) {
            return;
        }
        const isExistingAdmin = userData.type === 'existingUser' && userData.existingUser.canAccessFullAdminPanel;
        if (isExistingAdmin) {
            return;
        }
        throw new _authexception.AuthException('Workspace creation is restricted to admins', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION, {
            userFriendlyMessage: /*i18n*/ {
                id: "XsSVrR",
                message: "Workspace creation is restricted to admins"
            }
        });
    }
    async assertWorkspaceCountWithinLimit(workspaceCount) {
        if (this.enterprisePlanService.isValid()) {
            return;
        }
        if (workspaceCount < _maxworkspaceswithoutenterprisekeyconstants.MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY) {
            return;
        }
        throw new _authexception.AuthException(`Cannot create more than ${_maxworkspaceswithoutenterprisekeyconstants.MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY} workspaces without a valid enterprise key`, _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION, {
            userFriendlyMessage: /*i18n*/ {
                id: "iN7doz",
                message: "Workspace limit reached. A valid enterprise key is required to create more workspaces."
            }
        });
    }
    async deleteInferredWorkspaceLogo({ fileId, workspaceId }) {
        try {
            await this.fileCorePictureService.deleteCorePicture({
                fileId,
                workspaceId
            });
        } catch (error) {
            this.logger.error(`Failed to clean up inferred logo for workspace ${workspaceId}`, error);
            this.exceptionHandlerService.captureExceptions([
                error
            ], {
                workspace: {
                    id: workspaceId
                },
                additionalData: {
                    source: 'inferred-workspace-logo-cleanup'
                }
            });
        }
    }
    async uploadInferredWorkspaceLogo({ email, workspaceId, applicationUniversalIdentifier }) {
        let uploadedLogoFileId;
        try {
            const logoUrl = `${_constants.TWENTY_ICONS_BASE_URL}/${(0, _getdomainfromemailorthrow.getDomainFromEmailOrThrow)(email)}`;
            const logoFile = await this.fileCorePictureService.uploadWorkspaceLogoFromUrl({
                imageUrl: logoUrl,
                workspaceId,
                applicationUniversalIdentifier
            });
            if (!(0, _utils.isDefined)(logoFile)) {
                return;
            }
            uploadedLogoFileId = logoFile.id;
            const updateResult = await this.workspaceRepository.update({
                id: workspaceId,
                logoFileId: (0, _typeorm1.IsNull)()
            }, {
                logoFileId: logoFile.id
            });
            if ((updateResult.affected ?? 0) === 0) {
                await this.deleteInferredWorkspaceLogo({
                    fileId: logoFile.id,
                    workspaceId
                });
                return;
            }
            return logoFile.id;
        } catch (error) {
            this.logger.error(`Failed to upload inferred logo for workspace ${workspaceId}`, error);
            this.exceptionHandlerService.captureExceptions([
                error
            ], {
                workspace: {
                    id: workspaceId
                },
                additionalData: {
                    source: 'inferred-workspace-logo'
                }
            });
            if ((0, _utils.isDefined)(uploadedLogoFileId)) {
                await this.deleteInferredWorkspaceLogo({
                    fileId: uploadedLogoFileId,
                    workspaceId
                });
            }
            return;
        }
    }
    async signUpOnNewWorkspace(userData, options) {
        const email = userData.type === 'newUserWithPicture' ? userData.newUserWithPicture.email : userData.existingUser.email;
        if (!email) {
            throw new _authexception.AuthException('Email is required', _authexception.AuthExceptionCode.INVALID_INPUT, {
                userFriendlyMessage: /*i18n*/ {
                    id: "ZsZeV2",
                    message: "Email is required"
                }
            });
        }
        await this.assertWorkspaceCreationAllowed(userData);
        const displayName = options?.displayName?.trim();
        if (!displayName) {
            throw new _authexception.AuthException('Workspace name is required', _authexception.AuthExceptionCode.INVALID_INPUT, {
                userFriendlyMessage: /*i18n*/ {
                    id: "bcIybO",
                    message: "Workspace name is required"
                }
            });
        }
        const requestedSubdomain = options?.subdomain;
        if ((0, _utils.isDefined)(requestedSubdomain)) {
            await this.subdomainManagerService.validateSubdomainOrThrow(requestedSubdomain);
        }
        const shouldGrantServerAdmin = !await this.hasServerAdmin();
        const isWorkEmailFound = (0, _isworkemail.isWorkEmail)(email);
        const workspaceId = (0, _uuid.v4)();
        const workspaceCustomApplicationId = (0, _uuid.v4)();
        try {
            const { user, workspace, customApplicationUniversalIdentifier } = await this.dataSource.transaction(async (entityManager)=>{
                const queryRunner = entityManager.queryRunner;
                const workspaceToCreate = this.workspaceRepository.create({
                    id: workspaceId,
                    subdomain: (0, _utils.isDefined)(requestedSubdomain) ? requestedSubdomain : await this.subdomainManagerService.generateSubdomain(isWorkEmailFound ? {
                        userEmail: email
                    } : {}),
                    workspaceCustomApplicationId,
                    displayName,
                    inviteHash: (0, _uuid.v4)(),
                    activationStatus: _workspace.WorkspaceActivationStatus.PENDING_CREATION
                });
                const workspace = await queryRunner.manager.save(_workspaceentity.WorkspaceEntity, workspaceToCreate);
                const customApplication = await this.applicationService.createWorkspaceCustomApplication({
                    workspaceId,
                    applicationId: workspaceCustomApplicationId
                }, queryRunner);
                const isExistingUser = userData.type === 'existingUser';
                const user = isExistingUser ? userData.existingUser : await this.saveNewUser(userData.newUserWithPicture, {
                    canImpersonate: shouldGrantServerAdmin,
                    canAccessFullAdminPanel: shouldGrantServerAdmin
                }, queryRunner);
                await this.userWorkspaceService.create({
                    userId: user.id,
                    workspaceId: workspace.id,
                    isExistingUser,
                    pictureUrl: isExistingUser ? undefined : userData.newUserWithPicture.picture,
                    applicationUniversalIdentifier: customApplication.universalIdentifier,
                    locale: user.locale
                }, queryRunner);
                await this.activateOnboardingForUser({
                    user,
                    workspace,
                    shouldShowConnectAccountStep: true,
                    shouldShowInstallAppsStep: true
                }, queryRunner);
                await this.onboardingService.setOnboardingInviteTeamPending({
                    workspaceId: workspace.id,
                    value: true
                }, queryRunner);
                // Click-through DPA: the DPA is incorporated by reference into the
                // ToS/signup, so acceptance = execution. Only relevant on Twenty's
                // managed cloud (multi-workspace), where Twenty is the Processor
                // hosting the data; on self-hosted deployments Twenty is not the
                // Processor, so there is nothing to record. Done atomically with
                // workspace creation so we can later prove what was agreed. (Billing
                // is an independent feature flag and must not be used to detect cloud.)
                if (this.twentyConfigService.get('IS_MULTIWORKSPACE_ENABLED') === true) {
                    await queryRunner.manager.save(_dpaagreemententity.DpaAgreementEntity, (0, _builddpaagreementrecordutil.buildDpaAgreementRecord)({
                        workspaceId: workspace.id,
                        type: _dpaagreementtypeenum.DpaAgreementType.CLICK_THROUGH,
                        region: this.twentyConfigService.get('DPA_DEPLOYMENT_REGION') ?? _dparegionconfigconstant.DEFAULT_DPA_REGION,
                        acceptedAt: new Date(),
                        acceptedByUserId: user.id,
                        acceptedByEmail: email
                    }));
                }
                return {
                    user,
                    workspace,
                    customApplicationUniversalIdentifier: customApplication.universalIdentifier
                };
            });
            if (isWorkEmailFound) {
                const inferredLogoFileId = await this.uploadInferredWorkspaceLogo({
                    email,
                    workspaceId,
                    applicationUniversalIdentifier: customApplicationUniversalIdentifier
                });
                if ((0, _utils.isDefined)(inferredLogoFileId)) {
                    workspace.logoFileId = inferredLogoFileId;
                }
            }
            void this.eventLogEmitterService.createContext({
                workspaceId
            }).insertWorkspaceEvent(_workspacecreated.WORKSPACE_CREATED_EVENT, {});
            if (this.billingService.isBillingEnabled()) {
                await this.billingService.ensureBillingCustomer({
                    userEmail: email,
                    workspaceId: workspace.id,
                    workspaceDisplayName: workspace.displayName
                });
            }
            return {
                user,
                workspace
            };
        } catch (error) {
            const isSubdomainConflict = error instanceof _typeorm1.QueryFailedError && error.code === _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.UNIQUE_VIOLATION;
            if ((0, _utils.isDefined)(requestedSubdomain) && isSubdomainConflict) {
                throw new _workspaceexception.WorkspaceException('Subdomain already taken', _workspaceexception.WorkspaceExceptionCode.SUBDOMAIN_ALREADY_TAKEN);
            }
            throw error;
        } finally{
            await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
                'flatApplicationMaps'
            ]);
        }
    }
    async signUpWithoutWorkspace(newUserParams, authParams) {
        const userExists = await this.userService.findUserByEmail(newUserParams.email);
        if (userExists) {
            throw new _authexception.AuthException('User already exists', _authexception.AuthExceptionCode.USER_ALREADY_EXISTS, {
                userFriendlyMessage: /*i18n*/ {
                    id: "GkcfmO",
                    message: "User already exists"
                }
            });
        }
        await this.assertSignUpWithoutWorkspaceAllowed(newUserParams.email);
        const shouldGrantServerAdmin = !await this.hasServerAdmin();
        return this.saveNewUser(await this.computePartialUserFromUserPayload(newUserParams, authParams), {
            canImpersonate: shouldGrantServerAdmin,
            canAccessFullAdminPanel: shouldGrantServerAdmin
        });
    }
    constructor(userRepository, workspaceRepository, workspaceInvitationService, userWorkspaceService, onboardingService, workspaceEventEmitter, twentyConfigService, subdomainManagerService, userService, metricsService, workspaceCacheService, applicationService, fileCorePictureService, exceptionHandlerService, enterprisePlanService, eventLogEmitterService, billingCreditService, billingService, dataSource){
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.workspaceInvitationService = workspaceInvitationService;
        this.userWorkspaceService = userWorkspaceService;
        this.onboardingService = onboardingService;
        this.workspaceEventEmitter = workspaceEventEmitter;
        this.twentyConfigService = twentyConfigService;
        this.subdomainManagerService = subdomainManagerService;
        this.userService = userService;
        this.metricsService = metricsService;
        this.workspaceCacheService = workspaceCacheService;
        this.applicationService = applicationService;
        this.fileCorePictureService = fileCorePictureService;
        this.exceptionHandlerService = exceptionHandlerService;
        this.enterprisePlanService = enterprisePlanService;
        this.eventLogEmitterService = eventLogEmitterService;
        this.billingCreditService = billingCreditService;
        this.billingService = billingService;
        this.dataSource = dataSource;
        this.logger = new _common.Logger(SignInUpService.name);
    }
};
SignInUpService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userentity.UserEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(18, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspaceinvitationservice.WorkspaceInvitationService === "undefined" ? Object : _workspaceinvitationservice.WorkspaceInvitationService,
        typeof _userworkspaceservice.UserWorkspaceService === "undefined" ? Object : _userworkspaceservice.UserWorkspaceService,
        typeof _onboardingservice.OnboardingService === "undefined" ? Object : _onboardingservice.OnboardingService,
        typeof _workspaceeventemitter.WorkspaceEventEmitter === "undefined" ? Object : _workspaceeventemitter.WorkspaceEventEmitter,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _subdomainmanagerservice.SubdomainManagerService === "undefined" ? Object : _subdomainmanagerservice.SubdomainManagerService,
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _filecorepictureservice.FileCorePictureService === "undefined" ? Object : _filecorepictureservice.FileCorePictureService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _enterpriseplanservice.EnterprisePlanService === "undefined" ? Object : _enterpriseplanservice.EnterprisePlanService,
        typeof _eventlogemitterservice.EventLogEmitterService === "undefined" ? Object : _eventlogemitterservice.EventLogEmitterService,
        typeof _billingcreditservice.BillingCreditService === "undefined" ? Object : _billingcreditservice.BillingCreditService,
        typeof _billingservice.BillingService === "undefined" ? Object : _billingservice.BillingService,
        typeof DataSource === "undefined" ? Object : DataSource
    ])
], SignInUpService);

//# sourceMappingURL=sign-in-up.service.js.map