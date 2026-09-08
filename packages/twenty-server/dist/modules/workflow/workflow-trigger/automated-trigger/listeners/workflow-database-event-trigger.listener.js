"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowDatabaseEventTriggerListener", {
    enumerable: true,
    get: function() {
        return WorkflowDatabaseEventTriggerListener;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _typeorm = require("typeorm");
const _ondatabasebatcheventdecorator = require("../../../../../engine/api/graphql/graphql-query-runner/decorators/on-database-batch-event.decorator");
const _databaseeventaction = require("../../../../../engine/api/graphql/graphql-query-runner/enums/database-event-action");
const _messagequeuedecorator = require("../../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../../engine/core-modules/message-queue/services/message-queue.service");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../../../engine/metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _workspaceormmanager = require("../../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _cachedworkflowautomatedtriggerutil = require("../../../../../engine/core-modules/workflow/utils/cached-workflow-automated-trigger.util");
const _workspacecacheservice = require("../../../../../engine/workspace-cache/services/workspace-cache.service");
const _workflowcommonworkspaceservice = require("../../../common/workspace-services/workflow-common.workspace-service");
const _evaluatestepfiltersutil = require("../../../workflow-executor/workflow-actions/filter/utils/evaluate-step-filters.util");
const _workflowtriggerjob = require("../../jobs/workflow-trigger.job");
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
let WorkflowDatabaseEventTriggerListener = class WorkflowDatabaseEventTriggerListener {
    async handleObjectRecordCreateEvent(payload) {
        if (await this.shouldIgnoreEvent(payload)) {
            return;
        }
        const clonedPayload = structuredClone(payload);
        await this.enrichCreatedEvent(clonedPayload);
        await this.handleEvent({
            payload: clonedPayload,
            action: _databaseeventaction.DatabaseEventAction.CREATED
        });
    }
    async handleObjectRecordUpdateEvent(payload) {
        if (await this.shouldIgnoreEvent(payload)) {
            return;
        }
        const clonedPayload = structuredClone(payload);
        await this.enrichUpdatedEvent(clonedPayload);
        await this.handleEvent({
            payload: clonedPayload,
            action: _databaseeventaction.DatabaseEventAction.UPDATED
        });
    }
    async handleObjectRecordDeleteEvent(payload) {
        if (await this.shouldIgnoreEvent(payload)) {
            return;
        }
        const clonedPayload = structuredClone(payload);
        await this.enrichDeletedEvent(clonedPayload);
        await this.handleEvent({
            payload: clonedPayload,
            action: _databaseeventaction.DatabaseEventAction.DELETED
        });
    }
    async handleObjectRecordDestroyEvent(payload) {
        if (await this.shouldIgnoreEvent(payload)) {
            return;
        }
        const clonedPayload = structuredClone(payload);
        await this.enrichDestroyedEvent(clonedPayload);
        await this.handleEvent({
            payload: clonedPayload,
            action: _databaseeventaction.DatabaseEventAction.DESTROYED
        });
    }
    async handleObjectRecordUpsertEvent(payload) {
        if (await this.shouldIgnoreEvent(payload)) {
            return;
        }
        const clonedPayload = structuredClone(payload);
        await this.handleEvent({
            payload: clonedPayload,
            action: _databaseeventaction.DatabaseEventAction.UPSERTED
        });
    }
    async enrichCreatedEvent(payload) {
        const workspaceId = payload.workspaceId;
        const { flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(payload.objectMetadata.nameSingular, workspaceId);
        await this.enrichRecordsWithRelations({
            records: payload.events.map((event)=>event.properties.after),
            workspaceId,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
    }
    async enrichUpdatedEvent(payload) {
        const workspaceId = payload.workspaceId;
        const { flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(payload.objectMetadata.nameSingular, workspaceId);
        await this.enrichRecordsWithRelations({
            records: payload.events.map((event)=>event.properties.before),
            workspaceId,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
        await this.enrichRecordsWithRelations({
            records: payload.events.map((event)=>event.properties.after),
            workspaceId,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
    }
    async enrichDeletedEvent(payload) {
        const workspaceId = payload.workspaceId;
        const { flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(payload.objectMetadata.nameSingular, workspaceId);
        await this.enrichRecordsWithRelations({
            records: payload.events.map((event)=>event.properties.before),
            workspaceId,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
    }
    async enrichDestroyedEvent(payload) {
        const workspaceId = payload.workspaceId;
        const { flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(payload.objectMetadata.nameSingular, workspaceId);
        await this.enrichRecordsWithRelations({
            records: payload.events.map((event)=>event.properties.before),
            workspaceId,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
    }
    async enrichRecordsWithRelations({ records, workspaceId, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const { fieldIdByJoinColumnName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, flatObjectMetadata);
            for (const [joinColumnName, joinFieldId] of Object.entries(fieldIdByJoinColumnName)){
                const joinField = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                    flatEntityMaps: flatFieldMetadataMaps,
                    flatEntityId: joinFieldId
                });
                const joinRecordIds = records.map((record)=>record[joinColumnName]).filter(_utils.isDefined);
                if (joinRecordIds.length === 0) {
                    continue;
                }
                const relatedObjectMetadataId = joinField.relationTargetObjectMetadataId;
                if (!(0, _utils.isDefined)(relatedObjectMetadataId)) {
                    continue;
                }
                const relatedObjectMetadataNameSingular = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                    flatEntityId: relatedObjectMetadataId,
                    flatEntityMaps: flatObjectMetadataMaps
                })?.nameSingular;
                if (!(0, _utils.isDefined)(relatedObjectMetadataNameSingular)) {
                    continue;
                }
                const relatedObjectRepository = this.workspaceOrmManager.getRepository(relatedObjectMetadataNameSingular, {
                    shouldBypassPermissionChecks: true
                });
                const relatedRecords = await relatedObjectRepository.find({
                    where: {
                        id: (0, _typeorm.In)(joinRecordIds)
                    }
                });
                for (const record of records){
                    record[joinField.name] = relatedRecords.find((relatedRecord)=>relatedRecord.id === record[joinColumnName]);
                }
            }
        }, authContext);
    }
    async shouldIgnoreEvent(payload) {
        const workspaceId = payload.workspaceId;
        const databaseEventName = payload.name;
        if (!workspaceId || !databaseEventName) {
            this.logger.error(`Missing workspaceId or eventName in payload ${JSON.stringify(payload)}`);
            return true;
        }
        return false;
    }
    async handleEvent({ payload, action }) {
        const workspaceId = payload.workspaceId;
        const databaseEventName = payload.name;
        const eventListeners = await this.getDatabaseEventListeners(workspaceId, databaseEventName);
        for (const eventListener of eventListeners){
            for (const eventPayload of payload.events){
                const shouldTriggerJob = this.shouldTriggerJob({
                    eventPayload,
                    eventListener,
                    action
                });
                if (shouldTriggerJob) {
                    await this.messageQueueService.add(_workflowtriggerjob.WorkflowTriggerJob.name, {
                        workspaceId,
                        workflowId: eventListener.workflowId,
                        coreWorkflowVersionId: eventListener.coreWorkflowVersionId,
                        workspaceWorkflowVersionId: eventListener.workspaceWorkflowVersionId,
                        payload: eventPayload
                    }, {
                        retryLimit: 3
                    });
                }
            }
        }
    }
    async getDatabaseEventListeners(workspaceId, databaseEventName) {
        const { workflowAutomatedTriggerMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'workflowAutomatedTriggerMaps'
        ]);
        return Object.values(workflowAutomatedTriggerMaps.byWorkflowId).filter((trigger)=>(0, _cachedworkflowautomatedtriggerutil.isCachedDatabaseEventTrigger)(trigger) && trigger.settings.eventName === databaseEventName);
    }
    shouldTriggerJob({ eventPayload, eventListener, action }) {
        return this.eventMatchesWatchedFields({
            eventPayload,
            eventListener,
            action
        }) && this.eventMatchesRecordFilter({
            eventPayload,
            eventListener
        });
    }
    eventMatchesWatchedFields({ eventPayload, eventListener, action }) {
        if (action === _databaseeventaction.DatabaseEventAction.UPDATED || action === _databaseeventaction.DatabaseEventAction.UPSERTED) {
            const settings = eventListener.settings;
            const updatedFields = eventPayload?.properties?.updatedFields ?? [];
            return !settings.fields || settings.fields.length === 0 || settings.fields.some((field)=>updatedFields.includes(field));
        }
        return true;
    }
    eventMatchesRecordFilter({ eventPayload, eventListener }) {
        const { filter } = eventListener.settings;
        if (!(0, _utils.isDefined)(filter) || !(0, _utils.isNonEmptyArray)(filter.stepFilters)) {
            return true;
        }
        try {
            return (0, _evaluatestepfiltersutil.evaluateStepFilters)({
                stepFilters: filter.stepFilters,
                stepFilterGroups: filter.stepFilterGroups,
                context: {
                    [_workflow.TRIGGER_STEP_ID]: eventPayload
                }
            });
        } catch (error) {
            this.logger.error(`Failed to evaluate database-event trigger filter for workflow ${eventListener.workflowId}: ${error instanceof Error ? error.message : String(error)}`);
            return false;
        }
    }
    constructor(workspaceOrmManager, messageQueueService, workflowCommonWorkspaceService, workspaceCacheService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageQueueService = messageQueueService;
        this.workflowCommonWorkspaceService = workflowCommonWorkspaceService;
        this.workspaceCacheService = workspaceCacheService;
        this.logger = new _common.Logger(WorkflowDatabaseEventTriggerListener.name);
    }
};
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.CREATED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEventBatch === "undefined" ? Object : WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowDatabaseEventTriggerListener.prototype, "handleObjectRecordCreateEvent", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.UPDATED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEventBatch === "undefined" ? Object : WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowDatabaseEventTriggerListener.prototype, "handleObjectRecordUpdateEvent", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.DELETED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEventBatch === "undefined" ? Object : WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowDatabaseEventTriggerListener.prototype, "handleObjectRecordDeleteEvent", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.DESTROYED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEventBatch === "undefined" ? Object : WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowDatabaseEventTriggerListener.prototype, "handleObjectRecordDestroyEvent", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.UPSERTED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEventBatch === "undefined" ? Object : WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowDatabaseEventTriggerListener.prototype, "handleObjectRecordUpsertEvent", null);
WorkflowDatabaseEventTriggerListener = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workflowQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], WorkflowDatabaseEventTriggerListener);

//# sourceMappingURL=workflow-database-event-trigger.listener.js.map