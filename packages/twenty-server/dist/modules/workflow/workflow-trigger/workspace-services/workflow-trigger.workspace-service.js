"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowTriggerWorkspaceService", {
    enumerable: true,
    get: function() {
        return WorkflowTriggerWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _cachestoragedecorator = require("../../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _buildcoredispatchidsutil = require("../../../../engine/core-modules/workflow/utils/build-core-dispatch-ids.util");
const _workflowversioncoresyncservice = require("../../../../engine/core-modules/workflow/services/workflow-version-core-sync.service");
const _commandmenuitemservice = require("../../../../engine/metadata-modules/command-menu-item/command-menu-item.service");
const _enginecomponentkeyenum = require("../../../../engine/metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workspaceeventemitter = require("../../../../engine/workspace-event-emitter/workspace-event-emitter");
const _workflowautomatedtriggerworkspaceentity = require("../../common/standard-objects/workflow-automated-trigger.workspace-entity");
const _workflowversionworkspaceentity = require("../../common/standard-objects/workflow-version.workspace-entity");
const _assertworkflowversiontriggerisdefinedutil = require("../../common/utils/assert-workflow-version-trigger-is-defined.util");
const _workflowcommonworkspaceservice = require("../../common/workspace-services/workflow-common.workspace-service");
const _getpickrecordloadbalanceconfigerrorutil = require("../../workflow-builder/workflow-validation/utils/get-pick-record-load-balance-config-error.util");
const _codestepbuildservice = require("../../workflow-builder/workflow-version-step/code-step/services/code-step-build.service");
const _workflowrunnerworkspaceservice = require("../../workflow-runner/workspace-services/workflow-runner.workspace-service");
const _workflowversionstatusupdatedconstants = require("../../workflow-status/constants/workflow-version-status-updated.constants");
const _automatedtriggerworkspaceservice = require("../automated-trigger/automated-trigger.workspace-service");
const _workflowcrontriggercachekeyconstant = require("../automated-trigger/crons/constants/workflow-cron-trigger-cache-key.constant");
const _workflowtriggerexception = require("../exceptions/workflow-trigger.exception");
const _workflowtriggertype = require("../types/workflow-trigger.type");
const _assertversioncanbeactivatedutil = require("../utils/assert-version-can-be-activated.util");
const _computecronpatternfromschedule = require("../utils/compute-cron-pattern-from-schedule");
const _getworkflowcommandmenuitemlabelutil = require("../utils/get-workflow-command-menu-item-label.util");
const _assert = require("../../../../utils/assert");
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
let WorkflowTriggerWorkspaceService = class WorkflowTriggerWorkspaceService {
    async runWorkflowVersion({ workflowVersionId, payload, createdBy, workflowRunId, workspaceId }) {
        await this.workflowCommonWorkspaceService.getWorkflowVersionOrFail({
            workflowVersionId,
            workspaceId
        });
        return this.workflowRunnerWorkspaceService.run({
            workspaceId,
            workflowRunId,
            workflowVersionId,
            payload,
            source: createdBy
        });
    }
    async activateWorkflowVersion(workflowVersionId, workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const workflowVersionNullable = await workflowVersionRepository.findOne({
                where: {
                    id: workflowVersionId
                }
            });
            const workflowVersion = await this.workflowCommonWorkspaceService.getValidWorkflowVersionOrFail(workflowVersionNullable);
            const workflowRepository = this.workspaceOrmManager.getRepository('workflow', {
                shouldBypassPermissionChecks: true
            });
            const workflow = await workflowRepository.findOne({
                where: {
                    id: workflowVersion.workflowId
                }
            });
            if (!workflow) {
                throw new _workflowtriggerexception.WorkflowTriggerException('No workflow found', _workflowtriggerexception.WorkflowTriggerExceptionCode.INVALID_WORKFLOW_VERSION);
            }
            (0, _assertversioncanbeactivatedutil.assertVersionCanBeActivated)(workflowVersion, workflow);
            await this.assertPickRecordLoadBalanceConfigIsValid({
                steps: workflowVersion.steps ?? [],
                workspaceId
            });
            await this.codeStepBuildService.buildCodeStepsFromSourceForSteps({
                workspaceId,
                steps: workflowVersion.steps ?? []
            });
            await this.codeStepBuildService.switchCodeStepLogicFunctionsToPrebuilt({
                workspaceId,
                steps: workflowVersion.steps ?? []
            });
            await this.performActivationSteps(workflow, workflowVersion, workflowVersionRepository, workspaceId);
            return true;
        }, authContext);
    }
    async assertPickRecordLoadBalanceConfigIsValid({ steps, workspaceId }) {
        const pickRecordSteps = steps.filter((step)=>step.type === _workflow.WorkflowActionType.PICK_RECORD);
        if (pickRecordSteps.length === 0) {
            return;
        }
        const { objectIdByNameSingular, flatFieldMetadataMaps } = await this.workflowCommonWorkspaceService.getFlatEntityMaps(workspaceId);
        for (const step of pickRecordSteps){
            const loadBalanceError = (0, _getpickrecordloadbalanceconfigerrorutil.getPickRecordLoadBalanceConfigError)({
                step,
                objectIdByNameSingular,
                flatFieldMetadataMaps
            });
            if ((0, _utils.isDefined)(loadBalanceError)) {
                throw new _workflowtriggerexception.WorkflowTriggerException(loadBalanceError, _workflowtriggerexception.WorkflowTriggerExceptionCode.INVALID_WORKFLOW_VERSION);
            }
        }
    }
    async deactivateWorkflowVersion(workflowVersionId, workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            await this.performDeactivationSteps(workflowVersionId, workflowVersionRepository, workspaceId);
            return true;
        }, authContext);
    }
    async stopWorkflowRun(workflowRunId, workspaceId) {
        return this.workflowRunnerWorkspaceService.stopWorkflowRun(workspaceId, workflowRunId);
    }
    async retryWorkflowRun(workflowRunId, workspaceId) {
        return this.workflowRunnerWorkspaceService.retryWorkflowRun(workspaceId, workflowRunId);
    }
    async mirrorVersionStatusChangeInTransaction(workflowVersionId, workspaceId, transactionScope) {
        const workflowVersion = await transactionScope.getRepository('workflowVersion', {
            shouldBypassPermissionChecks: true
        }).findOne({
            where: {
                id: workflowVersionId
            }
        });
        if (!(0, _utils.isDefined)(workflowVersion)) {
            return null;
        }
        const mirrorResult = await this.workflowVersionCoreSyncService.mirrorWorkflowVersionWrite({
            workspaceId,
            transactionScope,
            workflowVersion
        });
        return mirrorResult?.coreWorkflowVersionId ?? workflowVersion.coreWorkflowVersionId ?? null;
    }
    async performActivationSteps(workflow, workflowVersion, workflowVersionRepository, workspaceId) {
        const previousPublishedVersionId = workflow.lastPublishedVersionId;
        if (previousPublishedVersionId && workflowVersion.id !== previousPublishedVersionId) {
            await this.performDeactivationSteps(previousPublishedVersionId, workflowVersionRepository, workspaceId);
        }
        await this.createOrUpdateCommandMenuItem(workflow, workflowVersion, workspaceId);
        await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
            const transactionalWorkflowRepository = transactionScope.getRepository('workflow', {
                shouldBypassPermissionChecks: true
            });
            const transactionalWorkflowVersionRepository = transactionScope.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            if (workflow.lastPublishedVersionId !== workflowVersion.id) {
                if (workflow.lastPublishedVersionId) {
                    await transactionalWorkflowVersionRepository.update({
                        id: workflow.lastPublishedVersionId
                    }, {
                        status: _workflowversionworkspaceentity.WorkflowVersionStatus.ARCHIVED
                    });
                    await this.mirrorVersionStatusChangeInTransaction(workflow.lastPublishedVersionId, workspaceId, transactionScope);
                }
                await transactionalWorkflowRepository.update({
                    id: workflow.id
                }, {
                    lastPublishedVersionId: workflowVersion.id
                });
            }
            const activeWorkflowVersions = await transactionalWorkflowVersionRepository.find({
                where: {
                    workflowId: workflowVersion.workflowId,
                    status: _workflowversionworkspaceentity.WorkflowVersionStatus.ACTIVE
                }
            });
            if (activeWorkflowVersions.length > 0) {
                throw new _workflowtriggerexception.WorkflowTriggerException('Cannot have more than one active workflow version', _workflowtriggerexception.WorkflowTriggerExceptionCode.FORBIDDEN, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "IDMgr/",
                        message: "Cannot have more than one active workflow version"
                    }
                });
            }
            await transactionalWorkflowVersionRepository.update({
                id: workflowVersion.id
            }, {
                status: _workflowversionworkspaceentity.WorkflowVersionStatus.ACTIVE
            });
            const mirroredCoreWorkflowVersionId = await this.mirrorVersionStatusChangeInTransaction(workflowVersion.id, workspaceId, transactionScope);
            await this.enableAutomatedTrigger(workflowVersion, workspaceId, {
                transactionScope,
                coreWorkflowVersionId: mirroredCoreWorkflowVersionId
            });
        });
        await this.workflowVersionCoreSyncService.invalidateAutomatedTriggerMaps(workspaceId);
        await this.emitStatusUpdateEvents(workflowVersion, _workflowversionworkspaceentity.WorkflowVersionStatus.ACTIVE, workspaceId);
    }
    async performDeactivationSteps(workflowVersionId, workflowVersionRepository, workspaceId) {
        const workflowVersionNullable = await workflowVersionRepository.findOne({
            where: {
                id: workflowVersionId
            }
        });
        const workflowVersion = await this.workflowCommonWorkspaceService.getValidWorkflowVersionOrFail(workflowVersionNullable);
        if (workflowVersion.status !== _workflowversionworkspaceentity.WorkflowVersionStatus.ACTIVE) {
            return;
        }
        await this.deleteCommandMenuItem(workflowVersion, workspaceId);
        await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
            await transactionScope.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            }).update({
                id: workflowVersion.id
            }, {
                status: _workflowversionworkspaceentity.WorkflowVersionStatus.DEACTIVATED
            });
            await this.mirrorVersionStatusChangeInTransaction(workflowVersion.id, workspaceId, transactionScope);
            await this.disableAutomatedTrigger(workflowVersion, workspaceId, {
                transactionScope
            });
        });
        await this.workflowVersionCoreSyncService.invalidateAutomatedTriggerMaps(workspaceId);
        await this.emitStatusUpdateEvents(workflowVersion, _workflowversionworkspaceentity.WorkflowVersionStatus.DEACTIVATED, workspaceId);
    }
    async resolveManualTriggerAvailability(trigger, workspaceId) {
        const availability = trigger.settings.availability;
        let availabilityType = _types.CommandMenuItemAvailabilityType.GLOBAL;
        let availabilityObjectMetadataId;
        if (availability) {
            switch(availability.type){
                case 'GLOBAL':
                    availabilityType = _types.CommandMenuItemAvailabilityType.GLOBAL;
                    break;
                case 'SINGLE_RECORD':
                case 'BULK_RECORDS':
                    {
                        availabilityType = _types.CommandMenuItemAvailabilityType.RECORD_SELECTION;
                        const { objectIdByNameSingular } = await this.workflowCommonWorkspaceService.getFlatEntityMaps(workspaceId);
                        const objectId = objectIdByNameSingular[availability.objectNameSingular];
                        if (!objectId) {
                            throw new _workflowtriggerexception.WorkflowTriggerException(`Object metadata not found for object: ${availability.objectNameSingular}`, _workflowtriggerexception.WorkflowTriggerExceptionCode.INVALID_WORKFLOW_VERSION);
                        }
                        availabilityObjectMetadataId = objectId;
                        break;
                    }
            }
        }
        return {
            availabilityType,
            availabilityObjectMetadataId
        };
    }
    async createOrUpdateCommandMenuItem(workflow, workflowVersion, workspaceId) {
        (0, _assertworkflowversiontriggerisdefinedutil.assertWorkflowVersionTriggerIsDefined)(workflowVersion);
        if (workflowVersion.trigger.type !== _workflowtriggertype.WorkflowTriggerType.MANUAL) {
            return;
        }
        const trigger = workflowVersion.trigger;
        const { availabilityType, availabilityObjectMetadataId } = await this.resolveManualTriggerAvailability(trigger, workspaceId);
        const label = (0, _getworkflowcommandmenuitemlabelutil.getWorkflowCommandMenuItemLabel)(workflow);
        const existingCommandMenuItem = await this.commandMenuItemService.findByWorkflowVersionId(workflowVersion.id, workspaceId);
        if (existingCommandMenuItem) {
            await this.commandMenuItemService.update({
                id: existingCommandMenuItem.id,
                label,
                shortLabel: label,
                icon: trigger.settings.icon,
                isPinned: trigger.settings.isPinned,
                availabilityType,
                availabilityObjectMetadataId
            }, workspaceId);
        } else {
            await this.commandMenuItemService.create({
                workflowVersionId: workflowVersion.id,
                engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
                label,
                shortLabel: label,
                icon: trigger.settings.icon,
                isPinned: trigger.settings.isPinned,
                availabilityType,
                availabilityObjectMetadataId
            }, workspaceId);
        }
    }
    async deleteCommandMenuItem(workflowVersion, workspaceId) {
        (0, _assertworkflowversiontriggerisdefinedutil.assertWorkflowVersionTriggerIsDefined)(workflowVersion);
        if (workflowVersion.trigger.type !== _workflowtriggertype.WorkflowTriggerType.MANUAL) {
            return;
        }
        const existingCommandMenuItem = await this.commandMenuItemService.findByWorkflowVersionId(workflowVersion.id, workspaceId);
        if (existingCommandMenuItem) {
            await this.commandMenuItemService.delete(existingCommandMenuItem.id, workspaceId);
        }
    }
    async enableAutomatedTrigger(workflowVersion, workspaceId, transactionContext) {
        (0, _assertworkflowversiontriggerisdefinedutil.assertWorkflowVersionTriggerIsDefined)(workflowVersion);
        switch(workflowVersion.trigger.type){
            case _workflowtriggertype.WorkflowTriggerType.MANUAL:
            case _workflowtriggertype.WorkflowTriggerType.WEBHOOK:
                return;
            case _workflowtriggertype.WorkflowTriggerType.DATABASE_EVENT:
                {
                    const settings = workflowVersion.trigger.settings;
                    await this.automatedTriggerWorkspaceService.addAutomatedTrigger({
                        workflowId: workflowVersion.workflowId,
                        type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT,
                        settings,
                        workspaceId,
                        transactionScope: transactionContext?.transactionScope
                    });
                    return;
                }
            case _workflowtriggertype.WorkflowTriggerType.CRON:
                {
                    const pattern = (0, _computecronpatternfromschedule.computeCronPatternFromSchedule)(workflowVersion.trigger);
                    await this.automatedTriggerWorkspaceService.addAutomatedTrigger({
                        workflowId: workflowVersion.workflowId,
                        type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.CRON,
                        settings: {
                            pattern
                        },
                        workspaceId,
                        transactionScope: transactionContext?.transactionScope
                    });
                    const cachedTrigger = {
                        workspaceId,
                        workflowId: workflowVersion.workflowId,
                        pattern,
                        ...(0, _buildcoredispatchidsutil.buildCoreDispatchIds)({
                            coreWorkflowVersionId: transactionContext?.coreWorkflowVersionId ?? workflowVersion.coreWorkflowVersionId,
                            workspaceWorkflowVersionId: workflowVersion.id
                        })
                    };
                    await this.cacheStorageService.hashSetIfExists({
                        key: _workflowcrontriggercachekeyconstant.WORKFLOW_CRON_TRIGGER_CACHE_KEY,
                        field: workflowVersion.workflowId,
                        value: JSON.stringify(cachedTrigger)
                    });
                    return;
                }
            default:
                (0, _assert.assertNever)(workflowVersion.trigger);
        }
    }
    async disableAutomatedTrigger(workflowVersion, workspaceId, transactionContext) {
        (0, _assertworkflowversiontriggerisdefinedutil.assertWorkflowVersionTriggerIsDefined)(workflowVersion);
        switch(workflowVersion.trigger.type){
            case _workflowtriggertype.WorkflowTriggerType.DATABASE_EVENT:
                await this.automatedTriggerWorkspaceService.deleteAutomatedTrigger({
                    workflowId: workflowVersion.workflowId,
                    workspaceId,
                    transactionScope: transactionContext?.transactionScope
                });
                return;
            case _workflowtriggertype.WorkflowTriggerType.CRON:
                await this.automatedTriggerWorkspaceService.deleteAutomatedTrigger({
                    workflowId: workflowVersion.workflowId,
                    workspaceId,
                    transactionScope: transactionContext?.transactionScope
                });
                await this.cacheStorageService.hashDelete({
                    key: _workflowcrontriggercachekeyconstant.WORKFLOW_CRON_TRIGGER_CACHE_KEY,
                    field: workflowVersion.workflowId
                });
                return;
            case _workflowtriggertype.WorkflowTriggerType.MANUAL:
            case _workflowtriggertype.WorkflowTriggerType.WEBHOOK:
                return;
            default:
                (0, _assert.assertNever)(workflowVersion.trigger);
        }
    }
    async emitStatusUpdateEvents(workflowVersion, newStatus, workspaceId) {
        this.workspaceEventEmitter.emitCustomBatchEvent(_workflowversionstatusupdatedconstants.WORKFLOW_VERSION_STATUS_UPDATED, [
            {
                workflowId: workflowVersion.workflowId,
                workflowVersionId: workflowVersion.id,
                previousStatus: workflowVersion.status,
                newStatus
            }
        ], workspaceId);
    }
    constructor(workspaceOrmManager, workflowCommonWorkspaceService, codeStepBuildService, workflowRunnerWorkspaceService, automatedTriggerWorkspaceService, workspaceEventEmitter, commandMenuItemService, workflowVersionCoreSyncService, cacheStorageService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.workflowCommonWorkspaceService = workflowCommonWorkspaceService;
        this.codeStepBuildService = codeStepBuildService;
        this.workflowRunnerWorkspaceService = workflowRunnerWorkspaceService;
        this.automatedTriggerWorkspaceService = automatedTriggerWorkspaceService;
        this.workspaceEventEmitter = workspaceEventEmitter;
        this.commandMenuItemService = commandMenuItemService;
        this.workflowVersionCoreSyncService = workflowVersionCoreSyncService;
        this.cacheStorageService = cacheStorageService;
        this.logger = new _common.Logger(WorkflowTriggerWorkspaceService.name);
    }
};
WorkflowTriggerWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(8, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleWorkflow)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
        typeof _codestepbuildservice.CodeStepBuildService === "undefined" ? Object : _codestepbuildservice.CodeStepBuildService,
        typeof _workflowrunnerworkspaceservice.WorkflowRunnerWorkspaceService === "undefined" ? Object : _workflowrunnerworkspaceservice.WorkflowRunnerWorkspaceService,
        typeof _automatedtriggerworkspaceservice.AutomatedTriggerWorkspaceService === "undefined" ? Object : _automatedtriggerworkspaceservice.AutomatedTriggerWorkspaceService,
        typeof _workspaceeventemitter.WorkspaceEventEmitter === "undefined" ? Object : _workspaceeventemitter.WorkspaceEventEmitter,
        typeof _commandmenuitemservice.CommandMenuItemService === "undefined" ? Object : _commandmenuitemservice.CommandMenuItemService,
        typeof _workflowversioncoresyncservice.WorkflowVersionCoreSyncService === "undefined" ? Object : _workflowversioncoresyncservice.WorkflowVersionCoreSyncService,
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService
    ])
], WorkflowTriggerWorkspaceService);

//# sourceMappingURL=workflow-trigger.workspace-service.js.map