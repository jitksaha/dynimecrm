"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarEventCleanerConnectedAccountListener", {
    enumerable: true,
    get: function() {
        return CalendarEventCleanerConnectedAccountListener;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _oncustombatcheventdecorator = require("../../../../engine/api/graphql/graphql-query-runner/decorators/on-custom-batch-event.decorator");
const _messagequeuedecorator = require("../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../engine/core-modules/message-queue/services/message-queue.service");
const _connectedaccountdeletedconstant = require("../../../../engine/metadata-modules/connected-account/constants/connected-account-deleted.constant");
const _customworkspacebatcheventtype = require("../../../../engine/workspace-event-emitter/types/custom-workspace-batch-event.type");
const _deleteconnectedaccountassociatedcalendardatajob = require("../jobs/delete-connected-account-associated-calendar-data.job");
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
let CalendarEventCleanerConnectedAccountListener = class CalendarEventCleanerConnectedAccountListener {
    async handleDeletedEvent(batchEvent) {
        const { workspaceId } = batchEvent;
        if (!(0, _utils.isDefined)(workspaceId)) {
            return;
        }
        await Promise.all(batchEvent.events.map((event)=>this.calendarQueueService.add(_deleteconnectedaccountassociatedcalendardatajob.DeleteConnectedAccountAssociatedCalendarDataJob.name, {
                workspaceId,
                connectedAccountId: event.connectedAccountId
            })));
    }
    constructor(calendarQueueService){
        this.calendarQueueService = calendarQueueService;
    }
};
_ts_decorate([
    (0, _oncustombatcheventdecorator.OnCustomBatchEvent)(_connectedaccountdeletedconstant.CONNECTED_ACCOUNT_DELETED_EVENT),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _customworkspacebatcheventtype.CustomWorkspaceEventBatch === "undefined" ? Object : _customworkspacebatcheventtype.CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], CalendarEventCleanerConnectedAccountListener.prototype, "handleDeletedEvent", null);
CalendarEventCleanerConnectedAccountListener = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.calendarQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], CalendarEventCleanerConnectedAccountListener);

//# sourceMappingURL=calendar-event-cleaner-connected-account.listener.js.map