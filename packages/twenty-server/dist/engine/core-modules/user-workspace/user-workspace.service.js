"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserWorkspaceService", {
    enumerable: true,
    get: function() {
        return UserWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _translations = require("twenty-shared/translations");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _coreentitycacheservice = require("../../core-entity-cache/services/core-entity-cache.service");
const _filestorageexception = require("../file-storage/interfaces/file-storage-exception");
const _approvedaccessdomainservice = require("../approved-access-domain/services/approved-access-domain.service");
const _getjoinableworkspacesfromapprovedaccessdomainsutil = require("../approved-access-domain/utils/get-joinable-workspaces-from-approved-access-domains.util");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
const _authexception = require("../auth/auth.exception");
const _logintokenservice = require("../auth/token/services/login-token.service");
const _workspacedomainsservice = require("../domain/workspace-domains/services/workspace-domains.service");
const _filecorepictureservice = require("../file/file-core-picture/services/file-core-picture.service");
const _fileurlservice = require("../file/file-url/file-url.service");
const _extractfileidfromurlutil = require("../file/files-field/utils/extract-file-id-from-url.util");
const _onboardingservice = require("../onboarding/onboarding.service");
const _userworkspaceentity = require("./user-workspace.entity");
const _userentity = require("../user/user.entity");
const _workspaceinvitationservice = require("../workspace-invitation/services/workspace-invitation.service");
const _workspacediscoverabilitytype = require("../workspace/types/workspace-discoverability.type");
const _workspacetype = require("../workspace/types/workspace.type");
const _workspacevalidate = require("../workspace/workspace.validate");
const _permissionsexception = require("../../metadata-modules/permissions/permissions.exception");
const _roletargetentity = require("../../metadata-modules/role-target/role-target.entity");
const _injectworkspacescopedrepositorydecorator = require("../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _rolevalidationservice = require("../../metadata-modules/role-validation/services/role-validation.service");
const _userroleservice = require("../../metadata-modules/user-role/user-role.service");
const _workspaceormmanager = require("../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../twenty-orm/utils/build-system-auth-context.util");
const _assert = require("../../../utils/assert");
const _getdomainfromemailorthrow = require("../../../utils/get-domain-from-email-or-throw");
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
let UserWorkspaceService = class UserWorkspaceService {
    async findById(id) {
        return this.userWorkspaceRepository.findOne({
            where: {
                id
            }
        });
    }
    async isWorkspaceCreator({ userId, workspaceId }) {
        const earliestUserWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                workspaceId
            },
            order: {
                createdAt: 'ASC'
            },
            withDeleted: true
        });
        return earliestUserWorkspace?.userId === userId;
    }
    async updateUserWorkspaceLocaleForUserWorkspace({ locale, userWorkspaceId }) {
        const userWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                id: userWorkspaceId
            }
        });
        if (!(0, _utils.isDefined)(userWorkspace)) {
            return;
        }
        userWorkspace.locale = locale;
        await this.userWorkspaceRepository.save(userWorkspace);
        await this.coreEntityCacheService.invalidate('userWorkspaceEntity', userWorkspaceId);
    }
    async create({ userId, workspaceId, isExistingUser, pictureUrl, applicationUniversalIdentifier, locale }, queryRunner) {
        const defaultAvatarUrl = await this.computeDefaultAvatarUrl(userId, workspaceId, isExistingUser, pictureUrl, applicationUniversalIdentifier, queryRunner);
        const userWorkspace = this.userWorkspaceRepository.create({
            userId,
            workspaceId,
            defaultAvatarUrl,
            locale: locale ?? _translations.SOURCE_LOCALE
        });
        return queryRunner ? queryRunner.manager.save(_userworkspaceentity.UserWorkspaceEntity, userWorkspace) : this.userWorkspaceRepository.save(userWorkspace);
    }
    async createWorkspaceMember(workspaceId, user) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceMemberRepository = this.workspaceOrmManager.getRepository('workspaceMember', {
                shouldBypassPermissionChecks: true
            });
            const existingWorkspaceMembers = await workspaceMemberRepository.find({
                where: {
                    userId: user.id
                }
            });
            if (existingWorkspaceMembers.length > 0) {
                return;
            }
            const userWorkspace = await this.userWorkspaceRepository.findOneOrFail({
                where: {
                    userId: user.id,
                    workspaceId
                }
            });
            await workspaceMemberRepository.insert({
                name: {
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                colorScheme: 'System',
                uiScale: 'Default',
                openRecordIn: _types.OpenRecordIn.SIDE_PANEL,
                userId: user.id,
                userEmail: user.email,
                avatarUrl: userWorkspace.defaultAvatarUrl ?? null,
                locale: user.locale ?? _translations.SOURCE_LOCALE
            });
            const workspaceMember = await workspaceMemberRepository.find({
                where: {
                    userId: user.id
                }
            });
            (0, _assert.assert)(workspaceMember?.length === 1, `Error while creating workspace member ${user.email} on workspace ${workspaceId}`);
        }, authContext);
    }
    async addUserToWorkspaceIfUserNotInWorkspace(user, workspace, roleId) {
        const existingUserWorkspace = await this.checkUserWorkspaceExists(user.id, workspace.id);
        if (existingUserWorkspace) {
            return;
        }
        const resolvedRoleId = await this.resolveRoleIdForNewMember(roleId, workspace);
        const userWorkspace = await this.create({
            userId: user.id,
            workspaceId: workspace.id,
            isExistingUser: true,
            locale: user.locale
        });
        await this.createWorkspaceMember(workspace.id, user);
        await this.userRoleService.assignRoleToManyUserWorkspace({
            workspaceId: workspace.id,
            userWorkspaceIds: [
                userWorkspace.id
            ],
            roleId: resolvedRoleId
        });
        await this.workspaceInvitationService.invalidateWorkspaceInvitation(workspace.id, user.email);
        await this.onboardingService.setOnboardingCreateProfilePending({
            userId: user.id,
            workspaceId: workspace.id,
            value: true
        });
    }
    async resolveRoleIdForNewMember(roleId, workspace) {
        if ((0, _utils.isDefined)(roleId)) {
            await this.roleValidationService.validateRoleAssignableToUsersOrThrow(roleId, workspace.id);
            return roleId;
        }
        const defaultRoleId = workspace.defaultRoleId;
        if (!(0, _utils.isDefined)(defaultRoleId)) {
            throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.DEFAULT_ROLE_NOT_FOUND, _permissionsexception.PermissionsExceptionCode.DEFAULT_ROLE_NOT_FOUND);
        }
        return defaultRoleId;
    }
    async getUserCount(workspaceId) {
        return await this.userWorkspaceRepository.countBy({
            workspaceId
        });
    }
    async checkUserWorkspaceExists(userId, workspaceId) {
        return this.userWorkspaceRepository.findOneBy({
            userId,
            workspaceId
        });
    }
    async checkUserWorkspaceExistsByEmail(email, workspaceId) {
        return this.userWorkspaceRepository.exists({
            where: {
                workspaceId,
                user: {
                    email
                }
            },
            relations: {
                user: true
            }
        });
    }
    async findFirstWorkspaceByUserId(userId) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations: {
                userWorkspaces: {
                    workspace: true
                }
            },
            order: {
                userWorkspaces: {
                    workspace: {
                        createdAt: 'ASC'
                    }
                }
            }
        });
        const workspace = user?.userWorkspaces?.[0]?.workspace;
        (0, _utils.assertIsDefinedOrThrow)(workspace, new _authexception.AuthException('Workspace not found', _authexception.AuthExceptionCode.WORKSPACE_NOT_FOUND));
        return workspace;
    }
    async countUserWorkspaces(userId) {
        return await this.userWorkspaceRepository.count({
            where: {
                userId
            }
        });
    }
    async deleteUserWorkspace({ userWorkspaceId, workspaceId, softDelete = false }) {
        if (softDelete) {
            // roleTarget has no deletedAt column, so its rows cannot be soft deleted.
            // Access stays gated by the soft-deleted userWorkspace.
            await this.userWorkspaceRepository.softDelete({
                id: userWorkspaceId
            });
        } else {
            await this.roleTargetRepository.delete(workspaceId, {
                userWorkspaceId
            }); // TODO remove once userWorkspace foreign key is added on roleTarget
            await this.userWorkspaceRepository.delete({
                id: userWorkspaceId
            });
        }
    }
    async findAvailableWorkspacesByEmail(email) {
        const user = await this.userRepository.findOne({
            where: {
                email
            },
            relations: {
                userWorkspaces: {
                    workspace: {
                        workspaceSSOIdentityProviders: true,
                        approvedAccessDomains: true
                    }
                }
            }
        });
        // HIDDEN workspaces are never advertised in the root-domain picker, even to
        // their own members — they must sign in from the workspace URL directly.
        const alreadyMemberWorkspaces = user ? user.userWorkspaces.map(({ workspace })=>({
                workspace
            })).filter(({ workspace })=>workspace.workspaceDiscoverability !== _workspacediscoverabilitytype.WorkspaceDiscoverability.HIDDEN) : [];
        const alreadyMemberWorkspacesIds = alreadyMemberWorkspaces.map(({ workspace })=>workspace.id);
        // Email-domain discovery is the only "listing" source: PUBLIC only.
        const workspacesFromApprovedAccessDomain = this.twentyConfigService.get('IS_EMAIL_VERIFICATION_REQUIRED') ? (0, _getjoinableworkspacesfromapprovedaccessdomainsutil.getJoinableWorkspacesFromApprovedAccessDomains)({
            approvedAccessDomains: await this.approvedAccessDomainService.findValidatedApprovedAccessDomainWithWorkspacesAndSSOIdentityProvidersDomain((0, _getdomainfromemailorthrow.getDomainFromEmailOrThrow)(email)),
            alreadyMemberWorkspaceIds: alreadyMemberWorkspacesIds
        }) : [];
        const workspacesFromApprovedAccessDomainIds = workspacesFromApprovedAccessDomain.map(({ workspace })=>workspace.id);
        // HIDDEN removes the picker convenience only; invited users can still join
        // through the direct invitation link, which carries its own token.
        const workspacesFromInvitations = (await this.workspaceInvitationService.findInvitationsByEmail(email)).filter(({ workspace })=>![
                ...alreadyMemberWorkspacesIds,
                ...workspacesFromApprovedAccessDomainIds
            ].includes(workspace.id) && workspace.workspaceDiscoverability !== _workspacediscoverabilitytype.WorkspaceDiscoverability.HIDDEN).map((appToken)=>({
                workspace: appToken.workspace,
                appToken
            }));
        return {
            availableWorkspacesForSignIn: alreadyMemberWorkspaces,
            availableWorkspacesForSignUp: [
                ...workspacesFromApprovedAccessDomain,
                ...workspacesFromInvitations
            ]
        };
    }
    async getUserWorkspaceForUser({ userId, workspaceId, relations = [
        'twoFactorAuthenticationMethods'
    ] }) {
        return this.userWorkspaceRepository.findOne({
            where: {
                userId,
                workspaceId
            },
            relations
        });
    }
    async getUserWorkspaceForUserOrThrow({ userId, workspaceId, relations = [
        'twoFactorAuthenticationMethods'
    ] }) {
        const userWorkspace = await this.getUserWorkspaceForUser({
            userId,
            workspaceId,
            relations
        });
        if (!(0, _utils.isDefined)(userWorkspace)) {
            throw new Error('User workspace not found');
        }
        return userWorkspace;
    }
    async getWorkspaceMember({ workspaceMemberId, workspaceId }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceMemberRepository = this.workspaceOrmManager.getRepository('workspaceMember', {
                shouldBypassPermissionChecks: true
            });
            return workspaceMemberRepository.findOne({
                where: {
                    id: workspaceMemberId
                }
            });
        }, authContext);
    }
    async getWorkspaceMemberOrThrow({ workspaceMemberId, workspaceId }) {
        const workspaceMember = await this.getWorkspaceMember({
            workspaceMemberId,
            workspaceId
        });
        if (!(0, _utils.isDefined)(workspaceMember)) {
            throw new Error('Workspace member not found');
        }
        return workspaceMember;
    }
    async computeDefaultAvatarUrl(userId, workspaceId, isExistingUser, pictureUrl, applicationUniversalIdentifier, queryRunner) {
        return this.computeDefaultAvatarUrlMigrated(userId, workspaceId, isExistingUser, pictureUrl, applicationUniversalIdentifier, queryRunner);
    }
    async computeDefaultAvatarUrlMigrated(userId, workspaceId, isExistingUser, pictureUrl, applicationUniversalIdentifier, queryRunner) {
        if (isExistingUser) {
            const userWorkspace = await this.userWorkspaceRepository.findOne({
                where: {
                    userId,
                    defaultAvatarUrl: (0, _typeorm1.Not)((0, _typeorm1.IsNull)())
                },
                order: {
                    createdAt: 'ASC'
                }
            });
            if (!(0, _utils.isDefined)(userWorkspace?.defaultAvatarUrl)) return;
            const sourceFileId = (0, _extractfileidfromurlutil.extractFileIdFromUrl)(userWorkspace.defaultAvatarUrl, _types.FileFolder.CorePicture);
            if (!(0, _utils.isDefined)(sourceFileId)) return;
            try {
                const savedFile = await this.fileCorePictureService.copyWorkspaceMemberProfilePicture({
                    sourceWorkspaceId: userWorkspace.workspaceId,
                    sourceFileId,
                    targetWorkspaceId: workspaceId,
                    targetApplicationUniversalIdentifier: applicationUniversalIdentifier,
                    queryRunner
                });
                return this.fileUrlService.getLegacyWorkspaceMemberAvatarUrl({
                    fileId: savedFile.id,
                    fileFolder: _types.FileFolder.CorePicture
                });
            } catch (error) {
                if (error.code === _filestorageexception.FileStorageExceptionCode.FILE_NOT_FOUND) {
                    return;
                }
                throw error;
            }
        }
        if (!(0, _utils.isDefined)(pictureUrl) || pictureUrl === '') return;
        const savedFile = await this.fileCorePictureService.uploadWorkspaceMemberProfilePictureFromUrl({
            imageUrl: pictureUrl,
            workspaceId,
            applicationUniversalIdentifier,
            queryRunner
        });
        if (!(0, _utils.isDefined)(savedFile)) {
            return;
        }
        return this.fileUrlService.getLegacyWorkspaceMemberAvatarUrl({
            fileId: savedFile.id,
            fileFolder: _types.FileFolder.CorePicture
        });
    }
    async castWorkspaceToAvailableWorkspace(workspace) {
        return {
            id: workspace.id,
            displayName: workspace.displayName,
            workspaceUrls: this.workspaceDomainsService.getWorkspaceUrls(workspace),
            logo: (0, _utils.isDefined)(workspace.logoFileId) ? await this.fileUrlService.signFileByIdUrl({
                fileId: workspace.logoFileId,
                workspaceId: workspace.id,
                fileFolder: _types.FileFolder.CorePicture
            }) : '',
            sso: workspace.workspaceSSOIdentityProviders?.reduce((acc, identityProvider)=>acc.concat(identityProvider.status === 'Inactive' ? [] : [
                    {
                        id: identityProvider.id,
                        name: identityProvider.name,
                        issuer: identityProvider.issuer,
                        type: identityProvider.type,
                        status: identityProvider.status
                    }
                ]), []) ?? []
        };
    }
    async setLoginTokenToAvailableWorkspacesWhenAuthProviderMatch(availableWorkspaces, user, authProvider, canAutoLoginIntoWorkspaces = true) {
        const [availableWorkspacesForSignUp, availableWorkspacesForSignIn] = await Promise.all([
            Promise.all(availableWorkspaces.availableWorkspacesForSignUp.map(async ({ workspace, appToken })=>{
                return {
                    ...await this.castWorkspaceToAvailableWorkspace(workspace),
                    ...appToken ? {
                        personalInviteToken: appToken.value
                    } : {}
                };
            })),
            Promise.all(availableWorkspaces.availableWorkspacesForSignIn.map(async ({ workspace })=>{
                return {
                    ...await this.castWorkspaceToAvailableWorkspace(workspace),
                    loginToken: canAutoLoginIntoWorkspaces && _workspacevalidate.workspaceValidator.isAuthEnabled(authProvider, workspace) ? (await this.loginTokenService.generateLoginToken(user.email, workspace.id, _workspacetype.AuthProviderEnum.Password)).token : undefined
                };
            }))
        ]);
        return {
            availableWorkspacesForSignUp,
            availableWorkspacesForSignIn
        };
    }
    async getActiveUserWorkspaceCountTotal() {
        const count = await this.userWorkspaceRepository.count({
            where: {
                deletedAt: (0, _typeorm1.IsNull)()
            }
        });
        return Math.max(1, count);
    }
    constructor(userWorkspaceRepository, userRepository, roleTargetRepository, roleValidationService, workspaceInvitationService, workspaceDomainsService, loginTokenService, approvedAccessDomainService, workspaceOrmManager, userRoleService, fileCorePictureService, fileUrlService, onboardingService, coreEntityCacheService, twentyConfigService){
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.userRepository = userRepository;
        this.roleTargetRepository = roleTargetRepository;
        this.roleValidationService = roleValidationService;
        this.workspaceInvitationService = workspaceInvitationService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.loginTokenService = loginTokenService;
        this.approvedAccessDomainService = approvedAccessDomainService;
        this.workspaceOrmManager = workspaceOrmManager;
        this.userRoleService = userRoleService;
        this.fileCorePictureService = fileCorePictureService;
        this.fileUrlService = fileUrlService;
        this.onboardingService = onboardingService;
        this.coreEntityCacheService = coreEntityCacheService;
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(UserWorkspaceService.name);
    }
};
UserWorkspaceService = _ts_decorate([
    _ts_param(0, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userentity.UserEntity)),
    _ts_param(2, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_roletargetentity.RoleTargetEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _rolevalidationservice.RoleValidationService === "undefined" ? Object : _rolevalidationservice.RoleValidationService,
        typeof _workspaceinvitationservice.WorkspaceInvitationService === "undefined" ? Object : _workspaceinvitationservice.WorkspaceInvitationService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _logintokenservice.LoginTokenService === "undefined" ? Object : _logintokenservice.LoginTokenService,
        typeof _approvedaccessdomainservice.ApprovedAccessDomainService === "undefined" ? Object : _approvedaccessdomainservice.ApprovedAccessDomainService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _userroleservice.UserRoleService === "undefined" ? Object : _userroleservice.UserRoleService,
        typeof _filecorepictureservice.FileCorePictureService === "undefined" ? Object : _filecorepictureservice.FileCorePictureService,
        typeof _fileurlservice.FileUrlService === "undefined" ? Object : _fileurlservice.FileUrlService,
        typeof _onboardingservice.OnboardingService === "undefined" ? Object : _onboardingservice.OnboardingService,
        typeof _coreentitycacheservice.CoreEntityCacheService === "undefined" ? Object : _coreentitycacheservice.CoreEntityCacheService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], UserWorkspaceService);

//# sourceMappingURL=user-workspace.service.js.map