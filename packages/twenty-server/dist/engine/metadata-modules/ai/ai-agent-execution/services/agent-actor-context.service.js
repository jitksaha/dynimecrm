"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentActorContextService", {
    enumerable: true,
    get: function() {
        return AgentActorContextService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _buildcreatedbyfromfullnamemetadatautil = require("../../../../core-modules/actor/utils/build-created-by-from-full-name-metadata.util");
const _builduserauthcontextutil = require("../../../../core-modules/auth/utils/build-user-auth-context.util");
const _fromuserentitytoflatutil = require("../../../../core-modules/user/utils/from-user-entity-to-flat.util");
const _userworkspaceservice = require("../../../../core-modules/user-workspace/user-workspace.service");
const _fromworkspaceentitytoflatutil = require("../../../../core-modules/workspace/utils/from-workspace-entity-to-flat.util");
const _aiexception = require("../../ai.exception");
const _permissionsexception = require("../../../permissions/permissions.exception");
const _userroleservice = require("../../../user-role/user-role.service");
const _workspaceormmanager = require("../../../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AgentActorContextService = class AgentActorContextService {
    async buildUserAndAgentActorContext(userWorkspaceId, workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        const userWorkspace = await this.userWorkspaceService.findById(userWorkspaceId);
        if (!userWorkspace) {
            throw new _aiexception.AiException('User workspace not found', _aiexception.AiExceptionCode.AGENT_EXECUTION_FAILED);
        }
        const workspaceMember = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceMemberRepository = this.workspaceOrmManager.getRepository('workspaceMember', {
                shouldBypassPermissionChecks: true
            });
            return workspaceMemberRepository.findOne({
                where: {
                    userId: userWorkspace.userId
                }
            });
        }, authContext);
        if (!workspaceMember) {
            throw new _aiexception.AiException('Workspace member not found for user', _aiexception.AiExceptionCode.AGENT_EXECUTION_FAILED);
        }
        const roleId = await this.userRoleService.getRoleIdForUserWorkspace({
            userWorkspaceId,
            workspaceId
        });
        if (!roleId) {
            throw new _aiexception.AiException('User role not found', _aiexception.AiExceptionCode.AGENT_EXECUTION_FAILED);
        }
        const actorContext = (0, _buildcreatedbyfromfullnamemetadatautil.buildCreatedByFromFullNameMetadata)({
            fullNameMetadata: workspaceMember.name,
            workspaceMemberId: workspaceMember.id,
            source: _types.FieldActorSource.AGENT
        });
        const userContext = {
            firstName: workspaceMember.name?.firstName ?? '',
            lastName: workspaceMember.name?.lastName ?? '',
            jobTitle: workspaceMember.jobTitle,
            locale: userWorkspace.locale,
            timezone: workspaceMember.timeZone ?? null
        };
        return {
            actorContext,
            roleId,
            userId: userWorkspace.userId,
            userWorkspaceId,
            userContext
        };
    }
    async buildRunAsWorkspaceMemberContext({ workspaceMemberId, workspaceId, viaApplication }) {
        const workspaceMember = await this.userWorkspaceService.getWorkspaceMember({
            workspaceMemberId,
            workspaceId
        });
        if (!(0, _utils.isDefined)(workspaceMember)) {
            throw new _aiexception.AiException(`Workspace member ${workspaceMemberId} not found`, _aiexception.AiExceptionCode.RUN_AS_WORKSPACE_MEMBER_NOT_FOUND);
        }
        const userWorkspace = await this.userWorkspaceService.getUserWorkspaceForUser({
            userId: workspaceMember.userId,
            workspaceId,
            relations: [
                'workspace',
                'user'
            ]
        });
        if (!(0, _utils.isDefined)(userWorkspace)) {
            throw new _aiexception.AiException(`Workspace member ${workspaceMemberId} has no user workspace`, _aiexception.AiExceptionCode.RUN_AS_WORKSPACE_MEMBER_NOT_FOUND);
        }
        const roleId = await this.resolveRoleIdOrThrow({
            userWorkspaceId: userWorkspace.id,
            workspaceId,
            workspaceMemberId
        });
        return {
            actorContext: (0, _buildcreatedbyfromfullnamemetadatautil.buildCreatedByFromFullNameMetadata)({
                fullNameMetadata: workspaceMember.name,
                workspaceMemberId: workspaceMember.id,
                source: _types.FieldActorSource.AGENT
            }),
            authContext: (0, _builduserauthcontextutil.buildUserAuthContext)({
                workspace: (0, _fromworkspaceentitytoflatutil.fromWorkspaceEntityToFlat)(userWorkspace.workspace),
                userWorkspaceId: userWorkspace.id,
                user: (0, _fromuserentitytoflatutil.fromUserEntityToFlat)(userWorkspace.user),
                workspaceMemberId: workspaceMember.id,
                workspaceMember,
                viaApplication
            }),
            roleId
        };
    }
    async resolveRoleIdOrThrow({ userWorkspaceId, workspaceId, workspaceMemberId }) {
        try {
            return await this.userRoleService.getRoleIdForUserWorkspace({
                userWorkspaceId,
                workspaceId
            });
        } catch (error) {
            if (error instanceof _permissionsexception.PermissionsException && error.code === _permissionsexception.PermissionsExceptionCode.NO_ROLE_FOUND_FOR_USER_WORKSPACE) {
                throw new _aiexception.AiException(`Workspace member ${workspaceMemberId} has no role assigned`, _aiexception.AiExceptionCode.RUN_AS_WORKSPACE_MEMBER_NOT_FOUND);
            }
            throw error;
        }
    }
    constructor(userWorkspaceService, userRoleService, workspaceOrmManager){
        this.userWorkspaceService = userWorkspaceService;
        this.userRoleService = userRoleService;
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
AgentActorContextService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userworkspaceservice.UserWorkspaceService === "undefined" ? Object : _userworkspaceservice.UserWorkspaceService,
        typeof _userroleservice.UserRoleService === "undefined" ? Object : _userroleservice.UserRoleService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], AgentActorContextService);

//# sourceMappingURL=agent-actor-context.service.js.map