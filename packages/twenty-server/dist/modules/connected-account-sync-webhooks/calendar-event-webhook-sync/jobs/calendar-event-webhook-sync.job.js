"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarEventWebhookSyncJob", {
    enumerable: true,
    get: function() {
        return CalendarEventWebhookSyncJob;
    }
});
const _common = require("@nestjs/common");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _calendareventwebhooksyncservice = require("../services/calendar-event-webhook-sync.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalendarEventWebhookSyncJob = class CalendarEventWebhookSyncJob {
    async handle(data) {
        await this.calendarEventWebhookSyncService.processCalendarEventWebhookSync(data);
    }
    constructor(calendarEventWebhookSyncService){
        this.calendarEventWebhookSyncService = calendarEventWebhookSyncService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(CalendarEventWebhookSyncJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CalendarEventWebhookSyncJobData === "undefined" ? Object : CalendarEventWebhookSyncJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], CalendarEventWebhookSyncJob.prototype, "handle", null);
CalendarEventWebhookSyncJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.connectedAccountSyncWebhookQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _calendareventwebhooksyncservice.CalendarEventWebhookSyncService === "undefined" ? Object : _calendareventwebhooksyncservice.CalendarEventWebhookSyncService
    ])
], CalendarEventWebhookSyncJob);

//# sourceMappingURL=calendar-event-webhook-sync.job.js.map