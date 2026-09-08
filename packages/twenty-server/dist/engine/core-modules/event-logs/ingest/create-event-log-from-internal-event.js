"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateEventLogFromInternalEvent", {
    enumerable: true,
    get: function() {
        return CreateEventLogFromInternalEvent;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _istransientclickhousenetworkerrorutil = require("../../../../database/clickhouse/utils/is-transient-clickhouse-network-error.util");
const _workspaceeventsinkservice = require("./workspace-event-sink.service");
const _buildeventenvelope = require("../emit/build-event-envelope");
const _objectrecordcreated = require("../emit/events/object-event/object-record-created");
const _objectrecorddelete = require("../emit/events/object-event/object-record-delete");
const _objectrecordupdated = require("../emit/events/object-event/object-record-updated");
const _objectrecordupserted = require("../emit/events/object-event/object-record-upserted");
const _messagequeuedecorator = require("../../message-queue/decorators/message-queue.decorator");
const _processdecorator = require("../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _messagequeueservice = require("../../message-queue/services/message-queue.service");
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
const MAX_TRANSIENT_ERROR_RETRIES = 1;
const OBJECT_EVENT_BY_SUFFIX = {
    '.created': _objectrecordcreated.OBJECT_RECORD_CREATED_EVENT,
    '.updated': _objectrecordupdated.OBJECT_RECORD_UPDATED_EVENT,
    '.deleted': _objectrecorddelete.OBJECT_RECORD_DELETED_EVENT,
    '.upserted': _objectrecordupserted.OBJECT_RECORD_UPSERTED_EVENT
};
let CreateEventLogFromInternalEvent = class CreateEventLogFromInternalEvent {
    async handle(batch) {
        if (!this.workspaceEventSinkService.isEnabled()) {
            return;
        }
        const envelopes = this.toEnvelopes(batch);
        if (envelopes.length === 0) {
            return;
        }
        try {
            await this.workspaceEventSinkService.ingest(envelopes);
        } catch (error) {
            if (!(0, _istransientclickhousenetworkerrorutil.isTransientClickHouseNetworkError)(error)) {
                throw error;
            }
            await this.handleTransientError(batch, envelopes.length, error);
        }
    }
    async handleTransientError(batch, envelopeCount, error) {
        const transientErrorRetryCount = batch.transientErrorRetryCount ?? 0;
        if (transientErrorRetryCount >= MAX_TRANSIENT_ERROR_RETRIES) {
            this.logger.warn(`Dropping ${envelopeCount} event log envelope(s) for workspace ${batch.workspaceId} after ${transientErrorRetryCount + 1} transient ClickHouse network errors: ${error.message}`);
            return;
        }
        this.logger.warn(`Requeuing ${envelopeCount} event log envelope(s) for workspace ${batch.workspaceId} after a transient ClickHouse network error: ${error.message}`);
        await this.messageQueueService.add(CreateEventLogFromInternalEvent.name, {
            ...batch,
            transientErrorRetryCount: transientErrorRetryCount + 1
        });
    }
    toEnvelopes(batch) {
        const suffix = Object.keys(OBJECT_EVENT_BY_SUFFIX).find((candidate)=>batch.name.endsWith(candidate));
        if (!(0, _utils.isDefined)(suffix)) {
            return [];
        }
        const event = OBJECT_EVENT_BY_SUFFIX[suffix];
        return batch.events.map((eventData)=>(0, _buildeventenvelope.buildObjectEventEnvelope)((0, _buildeventenvelope.computeEventContextFields)({
                workspaceId: batch.workspaceId,
                userId: eventData.userId
            }), event, this.objectProperties(batch, eventData)));
    }
    objectProperties(batch, eventData) {
        return {
            ...eventData.properties,
            recordId: eventData.recordId,
            objectMetadataId: batch.objectMetadata.id
        };
    }
    constructor(workspaceEventSinkService, messageQueueService){
        this.workspaceEventSinkService = workspaceEventSinkService;
        this.messageQueueService = messageQueueService;
        this.logger = new _common.Logger(CreateEventLogFromInternalEvent.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(CreateEventLogFromInternalEvent.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreateEventLogFromInternalEventData === "undefined" ? Object : CreateEventLogFromInternalEventData
    ]),
    _ts_metadata("design:returntype", Promise)
], CreateEventLogFromInternalEvent.prototype, "handle", null);
CreateEventLogFromInternalEvent = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.entityEventsToDbQueue),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.entityEventsToDbQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventsinkservice.WorkspaceEventSinkService === "undefined" ? Object : _workspaceeventsinkservice.WorkspaceEventSinkService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], CreateEventLogFromInternalEvent);

//# sourceMappingURL=create-event-log-from-internal-event.js.map