"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowCommonWorkspaceService", {
    enumerable: true,
    get: function() {
        return WorkflowCommonWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _workflowversioncoresyncservice = require("../../../../engine/core-modules/workflow/services/workflow-version-core-sync.service");
const _commandmenuitemservice = require("../../../../engine/metadata-modules/command-menu-item/command-menu-item.service");
const _logicfunctionexception = require("../../../../engine/metadata-modules/logic-function/logic-function.exception");
const _logicfunctionfromsourceservice = require("../../../../engine/metadata-modules/logic-function/services/logic-function-from-source.service");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workflowmetadatareadworkspaceservice = require("./workflow-metadata-read.workspace-service");
const _workflowversionworkspaceentity = require("../standard-objects/workflow-version.workspace-entity");
const _workflowworkspaceentity = require("../standard-objects/workflow.workspace-entity");
const _workflowtriggerexception = require("../../workflow-trigger/exceptions/workflow-trigger.exception");
const _getworkflowcommandmenuitemlabelutil = require("../../workflow-trigger/utils/get-workflow-command-menu-item-label.util");
const _workflow = require("twenty-shared/workflow");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkflowCommonWorkspaceService = class WorkflowCommonWorkspaceService {
    async getWorkflowVersionOrFail({ workspaceId, workflowVersionId }) {
        if (!workflowVersionId) {
            throw new _workflowtriggerexception.WorkflowTriggerException('Workflow version ID is required', _workflowtriggerexception.WorkflowTriggerExceptionCode.INVALID_INPUT);
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const workflowVersion = await workflowVersionRepository.findOne({
                where: {
                    id: workflowVersionId
                }
            });
            const validWorkflowVersion = await this.getValidWorkflowVersionOrFail(workflowVersion);
            return this.overlayCoreWorkflowVersionContent(workspaceId, validWorkflowVersion);
        }, authContext);
    }
    async overlayCoreWorkflowVersionContent(workspaceId, workflowVersion) {
        if (!(0, _utils.isDefined)(workflowVersion.coreWorkflowVersionId)) {
            return workflowVersion;
        }
        const coreWorkflowVersion = await this.workflowVersionCoreSyncService.findCoreVersionById(workspaceId, workflowVersion.coreWorkflowVersionId);
        if (!(0, _utils.isDefined)(coreWorkflowVersion)) {
            return workflowVersion;
        }
        return {
            ...workflowVersion,
            trigger: coreWorkflowVersion.triggers?.[0] ?? null,
            steps: coreWorkflowVersion.steps,
            status: coreWorkflowVersion.status
        };
    }
    async getValidWorkflowVersionOrFail(workflowVersion) {
        if (!workflowVersion) {
            throw new _workflowtriggerexception.WorkflowTriggerException('Workflow version not found', _workflowtriggerexception.WorkflowTriggerExceptionCode.INVALID_INPUT);
        }
        return {
            ...workflowVersion,
            trigger: workflowVersion.trigger
        };
    }
    async syncCommandMenuItemLabelForWorkflows(workflowIds, authContext) {
        const workspaceId = authContext.workspace?.id;
        if (!(0, _utils.isDefined)(workspaceId) || workflowIds.length === 0) {
            return;
        }
        const workflows = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowRepository = this.workspaceOrmManager.getRepository('workflow', {
                shouldBypassPermissionChecks: true
            });
            return workflowRepository.find({
                where: {
                    id: (0, _typeorm.In)(workflowIds)
                }
            });
        }, authContext);
        await Promise.all(workflows.map((workflow)=>this.syncCommandMenuItemLabelForWorkflow(workflow, workspaceId)));
    }
    async syncCommandMenuItemLabelForWorkflow(workflow, workspaceId) {
        if (!(0, _utils.isDefined)(workflow.lastPublishedVersionId)) {
            return;
        }
        const existingCommandMenuItem = await this.commandMenuItemService.findByWorkflowVersionId(workflow.lastPublishedVersionId, workspaceId);
        if (!(0, _utils.isDefined)(existingCommandMenuItem)) {
            return;
        }
        const label = (0, _getworkflowcommandmenuitemlabelutil.getWorkflowCommandMenuItemLabel)(workflow);
        if (existingCommandMenuItem.label === label && existingCommandMenuItem.shortLabel === label) {
            return;
        }
        await this.commandMenuItemService.update({
            id: existingCommandMenuItem.id,
            label,
            shortLabel: label
        }, workspaceId);
    }
    async getFlatEntityMaps(workspaceId) {
        return this.workflowMetadataReadService.getFlatEntityMaps(workspaceId);
    }
    async getLogicFunctionById({ logicFunctionId, workspaceId }) {
        return this.workflowMetadataReadService.getLogicFunctionById({
            logicFunctionId,
            workspaceId
        });
    }
    async getObjectMetadataInfo(objectNameSingular, workspaceId) {
        return this.workflowMetadataReadService.getObjectMetadataInfo(objectNameSingular, workspaceId);
    }
    async handleWorkflowSubEntities({ workflowIds, workspaceId, operation }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const workflowRunRepository = this.workspaceOrmManager.getRepository('workflowRun', {
                shouldBypassPermissionChecks: true
            });
            const workflowAutomatedTriggerRepository = this.workspaceOrmManager.getRepository('workflowAutomatedTrigger', {
                shouldBypassPermissionChecks: true
            });
            for (const workflowId of workflowIds){
                switch(operation){
                    case 'delete':
                        await workflowAutomatedTriggerRepository.softDelete({
                            workflowId
                        });
                        await workflowRunRepository.softDelete({
                            workflowId
                        });
                        await workflowVersionRepository.softDelete({
                            workflowId
                        });
                        await this.workflowVersionCoreSyncService.deleteCoreVersionsByWorkflowIds(workspaceId, [
                            workflowId
                        ]);
                        break;
                    case 'restore':
                        await workflowAutomatedTriggerRepository.restore({
                            workflowId
                        });
                        await workflowRunRepository.restore({
                            workflowId
                        });
                        await workflowVersionRepository.restore({
                            workflowId
                        });
                        await this.workflowVersionCoreSyncService.recreateCoreVersionsByWorkflowId(workspaceId, workflowId);
                        break;
                }
                await this.deactivateVersionOnDelete({
                    workflowVersionRepository,
                    workflowId,
                    workspaceId,
                    operation
                });
                await this.handleLogicFunctionSubEntities({
                    workflowVersionRepository,
                    workflowId,
                    workspaceId,
                    operation
                });
            }
        }, authContext);
    }
    async deactivateVersionOnDelete({ workflowVersionRepository, workflowId, workspaceId, operation }) {
        if (operation !== 'delete') {
            return;
        }
        const workflowVersions = await workflowVersionRepository.find({
            where: {
                workflowId
            },
            withDeleted: true
        });
        await this.workspaceOrmManager.runInWorkspaceTransaction(async ({ getRepository })=>{
            const workflowRepository = getRepository('workflow', {
                shouldBypassPermissionChecks: true
            });
            const transactionalWorkflowVersionRepository = getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const workflow = await workflowRepository.findOne({
                where: {
                    id: workflowId
                },
                withDeleted: true
            });
            if (workflow?.statuses?.includes(_workflowworkspaceentity.WorkflowStatus.ACTIVE)) {
                const newStatuses = [
                    ...workflow.statuses.filter((status)=>status !== _workflowworkspaceentity.WorkflowStatus.ACTIVE),
                    _workflowworkspaceentity.WorkflowStatus.DEACTIVATED
                ];
                await workflowRepository.update(workflowId, {
                    statuses: newStatuses
                });
            }
            for (const workflowVersion of workflowVersions){
                if (workflowVersion.status === _workflowversionworkspaceentity.WorkflowVersionStatus.ACTIVE) {
                    await transactionalWorkflowVersionRepository.update(workflowVersion.id, {
                        status: _workflowversionworkspaceentity.WorkflowVersionStatus.DEACTIVATED
                    });
                }
            }
        });
        for (const workflowVersion of workflowVersions){
            if (workflowVersion.status === _workflowversionworkspaceentity.WorkflowVersionStatus.ACTIVE) {
                await this.cleanupCommandMenuItemForVersion(workflowVersion.id, workspaceId);
            }
        }
        await this.workflowVersionCoreSyncService.invalidateAutomatedTriggerMaps(workspaceId);
    }
    async cleanupCommandMenuItemForVersion(workflowVersionId, workspaceId) {
        const existingCommandMenuItem = await this.commandMenuItemService.findByWorkflowVersionId(workflowVersionId, workspaceId);
        if ((0, _utils.isDefined)(existingCommandMenuItem)) {
            await this.commandMenuItemService.delete(existingCommandMenuItem.id, workspaceId);
        }
    }
    async handleLogicFunctionSubEntities({ workflowVersionRepository, workflowId, workspaceId, operation }) {
        // Only handle destroy operation - soft delete/restore is no longer supported
        if (operation !== 'destroy') {
            return;
        }
        const workflowVersions = await workflowVersionRepository.find({
            where: {
                workflowId
            },
            withDeleted: true
        });
        for (const workflowVersion of workflowVersions){
            for (const step of workflowVersion.steps ?? []){
                if (step.type === _workflow.WorkflowActionType.CODE) {
                    const logicFunctionId = step.settings.input.logicFunctionId;
                    if (!(0, _utils.isValidUuid)(logicFunctionId)) {
                        this.logger.warn(`Skipping destroy for CODE step with undefined logicFunctionId in workflow ${workflowId}`);
                        continue;
                    }
                    await this.logicFunctionFromSourceService.deleteOneWithSource({
                        id: logicFunctionId,
                        workspaceId
                    }).catch((error)=>{
                        if (error instanceof _logicfunctionexception.LogicFunctionException && error.code === _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_NOT_FOUND) {
                            return;
                        }
                        throw error;
                    });
                }
            }
        }
    }
    constructor(workspaceOrmManager, logicFunctionFromSourceService, workflowMetadataReadService, commandMenuItemService, workflowVersionCoreSyncService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.logicFunctionFromSourceService = logicFunctionFromSourceService;
        this.workflowMetadataReadService = workflowMetadataReadService;
        this.commandMenuItemService = commandMenuItemService;
        this.workflowVersionCoreSyncService = workflowVersionCoreSyncService;
        this.logger = new _common.Logger(WorkflowCommonWorkspaceService.name);
    }
};
WorkflowCommonWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _logicfunctionfromsourceservice.LogicFunctionFromSourceService === "undefined" ? Object : _logicfunctionfromsourceservice.LogicFunctionFromSourceService,
        typeof _workflowmetadatareadworkspaceservice.WorkflowMetadataReadService === "undefined" ? Object : _workflowmetadatareadworkspaceservice.WorkflowMetadataReadService,
        typeof _commandmenuitemservice.CommandMenuItemService === "undefined" ? Object : _commandmenuitemservice.CommandMenuItemService,
        typeof _workflowversioncoresyncservice.WorkflowVersionCoreSyncService === "undefined" ? Object : _workflowversioncoresyncservice.WorkflowVersionCoreSyncService
    ])
], WorkflowCommonWorkspaceService);

//# sourceMappingURL=workflow-common.workspace-service.js.map