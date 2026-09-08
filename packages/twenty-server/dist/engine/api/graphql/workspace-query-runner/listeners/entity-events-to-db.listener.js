"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EntityEventsToDbListener", {
    enumerable: true,
    get: function() {
        return EntityEventsToDbListener;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _ondatabasebatcheventdecorator = require("../../graphql-query-runner/decorators/on-database-batch-event.decorator");
const _databaseeventaction = require("../../graphql-query-runner/enums/database-event-action");
const _createeventlogfrominternalevent = require("../../../../core-modules/event-logs/ingest/create-event-log-from-internal-event");
const _messagequeuedecorator = require("../../../../core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../core-modules/message-queue/services/message-queue.service");
const _callwebhookjobsjob = require("../../../../metadata-modules/webhook/jobs/call-webhook-jobs.job");
const _calldatabaseeventtriggerjobsjob = require("../../../../core-modules/logic-function/logic-function-trigger/triggers/database-event/call-database-event-trigger-jobs.job");
const _workspaceeventbatchtype = require("../../../../workspace-event-emitter/types/workspace-event-batch.type");
const _objectrecordeventpublisher = require("../../../../subscriptions/object-record-event/object-record-event-publisher");
const _upserttimelineactivityfrominternaleventjob = require("../../../../../modules/timeline/jobs/upsert-timeline-activity-from-internal-event.job");
const _timelineactivityroutingplanservice = require("../../../../../modules/timeline/services/timeline-activity-routing-plan.service");
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
let EntityEventsToDbListener = class EntityEventsToDbListener {
    async handleCreate(batchEvent) {
        return this.handleEvent(batchEvent, _databaseeventaction.DatabaseEventAction.CREATED);
    }
    async handleUpdate(batchEvent) {
        return this.handleEvent(batchEvent, _databaseeventaction.DatabaseEventAction.UPDATED);
    }
    async handleDelete(batchEvent) {
        return this.handleEvent(batchEvent, _databaseeventaction.DatabaseEventAction.DELETED);
    }
    async handleRestore(batchEvent) {
        return this.handleEvent(batchEvent, _databaseeventaction.DatabaseEventAction.RESTORED);
    }
    async handleDestroy(batchEvent) {
        return this.handleEvent(batchEvent, _databaseeventaction.DatabaseEventAction.DESTROYED);
    }
    async handleEvent(batchEvent, action) {
        if (batchEvent.objectMetadata.universalIdentifier === _metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier) {
            await this.objectRecordEventPublisher.publish(batchEvent);
            return;
        }
        const isAuditLogBatchEvent = batchEvent.objectMetadata?.isAuditLogged;
        const shouldCreateTimelineActivity = action !== _databaseeventaction.DatabaseEventAction.DESTROYED && await this.timelineActivityRoutingPlanService.shouldProcessEvent({
            flatObjectMetadata: batchEvent.objectMetadata,
            workspaceId: batchEvent.workspaceId
        });
        const batchEventForWebhook = {
            ...batchEvent,
            objectMetadata: {
                id: batchEvent.objectMetadata.id,
                nameSingular: batchEvent.objectMetadata.nameSingular
            }
        };
        const promises = [
            this.objectRecordEventPublisher.publish(batchEvent),
            this.webhookQueueService.add(_callwebhookjobsjob.CallWebhookJobsJob.name, batchEventForWebhook, {
                retryLimit: 3
            })
        ];
        promises.push(this.triggerQueueService.add(_calldatabaseeventtriggerjobsjob.CallDatabaseEventTriggerJobsJob.name, batchEvent, {
            retryLimit: 3
        }));
        if (shouldCreateTimelineActivity) {
            promises.push(this.entityEventsToDbQueueService.add(_upserttimelineactivityfrominternaleventjob.UpsertTimelineActivityFromInternalEvent.name, batchEvent, {
                retryLimit: 1
            }));
        }
        if (isAuditLogBatchEvent && action !== _databaseeventaction.DatabaseEventAction.DESTROYED) {
            promises.push(this.entityEventsToDbQueueService.add(_createeventlogfrominternalevent.CreateEventLogFromInternalEvent.name, batchEvent, {
                retryLimit: 1
            }));
        }
        await Promise.all(promises);
    }
    constructor(entityEventsToDbQueueService, webhookQueueService, triggerQueueService, objectRecordEventPublisher, timelineActivityRoutingPlanService){
        this.entityEventsToDbQueueService = entityEventsToDbQueueService;
        this.webhookQueueService = webhookQueueService;
        this.triggerQueueService = triggerQueueService;
        this.objectRecordEventPublisher = objectRecordEventPublisher;
        this.timelineActivityRoutingPlanService = timelineActivityRoutingPlanService;
    }
};
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.CREATED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventbatchtype.WorkspaceEventBatch === "undefined" ? Object : _workspaceeventbatchtype.WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], EntityEventsToDbListener.prototype, "handleCreate", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.UPDATED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventbatchtype.WorkspaceEventBatch === "undefined" ? Object : _workspaceeventbatchtype.WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], EntityEventsToDbListener.prototype, "handleUpdate", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.DELETED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventbatchtype.WorkspaceEventBatch === "undefined" ? Object : _workspaceeventbatchtype.WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], EntityEventsToDbListener.prototype, "handleDelete", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.RESTORED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventbatchtype.WorkspaceEventBatch === "undefined" ? Object : _workspaceeventbatchtype.WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], EntityEventsToDbListener.prototype, "handleRestore", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('*', _databaseeventaction.DatabaseEventAction.DESTROYED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventbatchtype.WorkspaceEventBatch === "undefined" ? Object : _workspaceeventbatchtype.WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], EntityEventsToDbListener.prototype, "handleDestroy", null);
EntityEventsToDbListener = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.entityEventsToDbQueue)),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.webhookQueue)),
    _ts_param(2, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.triggerQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _objectrecordeventpublisher.ObjectRecordEventPublisher === "undefined" ? Object : _objectrecordeventpublisher.ObjectRecordEventPublisher,
        typeof _timelineactivityroutingplanservice.TimelineActivityRoutingPlanService === "undefined" ? Object : _timelineactivityroutingplanservice.TimelineActivityRoutingPlanService
    ])
], EntityEventsToDbListener);

//# sourceMappingURL=entity-events-to-db.listener.js.map