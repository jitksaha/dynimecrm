"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowVersionValidationWorkspaceService", {
    enumerable: true,
    get: function() {
        return WorkflowVersionValidationWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _typeorm = require("typeorm");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workflowqueryvalidationexception = require("../exceptions/workflow-query-validation.exception");
const _workflowversionworkspaceentity = require("../standard-objects/workflow-version.workspace-entity");
const _assertworkflowversionisdraftutil = require("../utils/assert-workflow-version-is-draft.util");
const _workflowcommonworkspaceservice = require("./workflow-common.workspace-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkflowVersionValidationWorkspaceService = class WorkflowVersionValidationWorkspaceService {
    async validateWorkflowVersionForCreateOne(workspaceId, payload) {
        if (payload.data.status && payload.data.status !== _workflowversionworkspaceentity.WorkflowVersionStatus.DRAFT) {
            throw new _workflowqueryvalidationexception.WorkflowQueryValidationException('Cannot create workflow version with status other than draft', _workflowqueryvalidationexception.WorkflowQueryValidationExceptionCode.FORBIDDEN, {
                userFriendlyMessage: /*i18n*/ {
                    id: "RggZr4",
                    message: "Cannot create workflow version with status other than draft"
                }
            });
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const workflowAlreadyHasDraftVersion = await workflowVersionRepository.exists({
                where: {
                    workflowId: payload.data.workflowId,
                    status: _workflowversionworkspaceentity.WorkflowVersionStatus.DRAFT,
                    deletedAt: (0, _typeorm.IsNull)()
                }
            });
            if (workflowAlreadyHasDraftVersion) {
                throw new _workflowqueryvalidationexception.WorkflowQueryValidationException('Cannot create multiple draft versions for the same workflow', _workflowqueryvalidationexception.WorkflowQueryValidationExceptionCode.FORBIDDEN, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "LIPsWu",
                        message: "Cannot create multiple draft versions for the same workflow"
                    }
                });
            }
        }, authContext);
    }
    async validateWorkflowVersionForUpdateOne({ workspaceId, payload }) {
        await this.workflowCommonWorkspaceService.getWorkflowVersionOrFail({
            workspaceId,
            workflowVersionId: payload.id
        });
        const protectedFieldNames = [
            'steps',
            'trigger',
            'status',
            'position',
            'workflowId',
            'coreWorkflowVersionId'
        ];
        const setsProtectedField = protectedFieldNames.some((fieldName)=>fieldName in payload.data);
        const clearsName = 'name' in payload.data && !(0, _guards.isNonEmptyString)(payload.data.name);
        if (setsProtectedField || clearsName) {
            throw new _workflowqueryvalidationexception.WorkflowQueryValidationException('Updating a workflowVersion through the generic mutation is restricted. ' + 'steps, trigger, status, position, workflowId and coreWorkflowVersionId cannot be changed, and the name cannot be cleared. ' + 'Use the dedicated workflowVersion mutations (createWorkflowVersionStep, updateWorkflowVersionStep, ' + 'deleteWorkflowVersionStep, updateWorkflowVersionTrigger, activateWorkflowVersion, ...) instead.', _workflowqueryvalidationexception.WorkflowQueryValidationExceptionCode.FORBIDDEN, {
                userFriendlyMessage: /*i18n*/ {
                    id: "dxfM0y",
                    message: "This field cannot be updated directly on a workflow version"
                }
            });
        }
    }
    async validateWorkflowVersionForDeleteOne(workspaceId, payload) {
        const workflowVersion = await this.workflowCommonWorkspaceService.getWorkflowVersionOrFail({
            workspaceId,
            workflowVersionId: payload.id
        });
        (0, _assertworkflowversionisdraftutil.assertWorkflowVersionIsDraft)(workflowVersion);
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const otherWorkflowVersionsExist = await workflowVersionRepository.exists({
                where: {
                    workflowId: workflowVersion.workflowId,
                    deletedAt: (0, _typeorm.IsNull)(),
                    id: (0, _typeorm.Not)(workflowVersion.id)
                }
            });
            if (!otherWorkflowVersionsExist) {
                throw new _workflowqueryvalidationexception.WorkflowQueryValidationException('The initial version of a workflow can not be deleted', _workflowqueryvalidationexception.WorkflowQueryValidationExceptionCode.FORBIDDEN, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "EJUSll",
                        message: "The initial version of a workflow can not be deleted"
                    }
                });
            }
        }, authContext);
    }
    constructor(workflowCommonWorkspaceService, workspaceOrmManager){
        this.workflowCommonWorkspaceService = workflowCommonWorkspaceService;
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
WorkflowVersionValidationWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], WorkflowVersionValidationWorkspaceService);

//# sourceMappingURL=workflow-version-validation.workspace-service.js.map