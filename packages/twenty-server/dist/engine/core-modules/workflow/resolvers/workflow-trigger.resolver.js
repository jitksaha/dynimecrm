"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowTriggerResolver", {
    enumerable: true,
    get: function() {
        return WorkflowTriggerResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _workflow = require("twenty-shared/workflow");
const _coreresolverdecorator = require("../../../api/graphql/graphql-config/decorators/core-resolver.decorator");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _buildcreatedbyfromfullnamemetadatautil = require("../../actor/utils/build-created-by-from-full-name-metadata.util");
const _preventnesttoautologgraphqlerrorsfilter = require("../../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../../graphql/pipes/resolver-validation.pipe");
const _runworkflowversioninput = require("../dtos/run-workflow-version.input");
const _runworkflowversiondto = require("../dtos/run-workflow-version.dto");
const _workflowrundto = require("../dtos/workflow-run.dto");
const _workflowtriggergraphqlapiexceptionfilter = require("../filters/workflow-trigger-graphql-api-exception.filter");
const _workspaceentity = require("../../workspace/workspace.entity");
const _authuserdecorator = require("../../../decorators/auth/auth-user.decorator");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _userauthguard = require("../../../guards/user-auth.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _permissionsgraphqlapiexceptionfilter = require("../../../metadata-modules/permissions/utils/permissions-graphql-api-exception.filter");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
const _workflowtriggerworkspaceservice = require("../../../../modules/workflow/workflow-trigger/workspace-services/workflow-trigger.workspace-service");
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
let WorkflowTriggerResolver = class WorkflowTriggerResolver {
    async activateWorkflowVersion(workspace, workflowVersionId) {
        return this.workflowTriggerWorkspaceService.activateWorkflowVersion(workflowVersionId, workspace.id);
    }
    async deactivateWorkflowVersion(workspace, workflowVersionId) {
        return this.workflowTriggerWorkspaceService.deactivateWorkflowVersion(workflowVersionId, workspace.id);
    }
    async runWorkflowVersion(user, workspace, { workflowVersionId, workflowRunId, payload }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspace.id);
        const workspaceMember = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceMemberRepository = this.workspaceOrmManager.getRepository('workspaceMember', {
                shouldBypassPermissionChecks: true
            });
            return workspaceMemberRepository.findOneOrFail({
                where: {
                    userId: user.id
                }
            });
        }, authContext);
        return this.workflowTriggerWorkspaceService.runWorkflowVersion({
            workflowVersionId,
            workflowRunId: workflowRunId ?? undefined,
            payload: {
                ...payload ?? {},
                [_workflow.WORKFLOW_TRIGGER_PAYLOAD_KEY]: {
                    ...payload ?? {}
                },
                [_workflow.WORKFLOW_TRIGGER_METADATA_KEY]: {
                    [_workflow.WORKFLOW_TRIGGER_METADATA_WORKSPACE_MEMBER_ID_KEY]: workspaceMember.id
                }
            },
            createdBy: (0, _buildcreatedbyfromfullnamemetadatautil.buildCreatedByFromFullNameMetadata)({
                fullNameMetadata: {
                    firstName: workspaceMember.name.firstName,
                    lastName: workspaceMember.name.lastName
                },
                workspaceMemberId: workspaceMember.id
            }),
            workspaceId: workspace.id
        });
    }
    async stopWorkflowRun(workspace, workflowRunId) {
        return this.workflowTriggerWorkspaceService.stopWorkflowRun(workflowRunId, workspace.id);
    }
    async retryWorkflowRun(workspace, workflowRunId) {
        return this.workflowTriggerWorkspaceService.retryWorkflowRun(workflowRunId, workspace.id);
    }
    constructor(workspaceOrmManager, workflowTriggerWorkspaceService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.workflowTriggerWorkspaceService = workflowTriggerWorkspaceService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('workflowVersionId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowTriggerResolver.prototype, "activateWorkflowVersion", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('workflowVersionId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowTriggerResolver.prototype, "deactivateWorkflowVersion", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_runworkflowversiondto.RunWorkflowVersionDTO),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _runworkflowversioninput.RunWorkflowVersionInput === "undefined" ? Object : _runworkflowversioninput.RunWorkflowVersionInput
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowTriggerResolver.prototype, "runWorkflowVersion", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_workflowrundto.WorkflowRunDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('workflowRunId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowTriggerResolver.prototype, "stopWorkflowRun", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_workflowrundto.WorkflowRunDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('workflowRunId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowTriggerResolver.prototype, "retryWorkflowRun", null);
WorkflowTriggerResolver = _ts_decorate([
    (0, _coreresolverdecorator.CoreResolver)(),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.WORKFLOWS)),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_workflowtriggergraphqlapiexceptionfilter.WorkflowTriggerGraphqlApiExceptionFilter, _permissionsgraphqlapiexceptionfilter.PermissionsGraphqlApiExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workflowtriggerworkspaceservice.WorkflowTriggerWorkspaceService === "undefined" ? Object : _workflowtriggerworkspaceservice.WorkflowTriggerWorkspaceService
    ])
], WorkflowTriggerResolver);

//# sourceMappingURL=workflow-trigger.resolver.js.map