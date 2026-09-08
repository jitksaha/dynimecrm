"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BlocklistItemDeleteCalendarEventsJob", {
    enumerable: true,
    get: function() {
        return BlocklistItemDeleteCalendarEventsJob;
    }
});
const _common = require("@nestjs/common");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _calendareventcleanerservice = require("../../calendar-event-cleaner/services/calendar-event-cleaner.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BlocklistItemDeleteCalendarEventsJob = class BlocklistItemDeleteCalendarEventsJob {
    async handle(data) {
        // Blocking a handle deletes their messages but deliberately leaves calendar
        // events alone: an event the blocked handle merely attended is still the
        // workspace's own meeting, so it is not swept up with them. We only clean up
        // events that were orphaned by other means.
        await this.calendarEventCleanerService.cleanWorkspaceCalendarEvents(data.workspaceId);
    }
    constructor(calendarEventCleanerService){
        this.calendarEventCleanerService = calendarEventCleanerService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(BlocklistItemDeleteCalendarEventsJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof BlocklistItemDeleteCalendarEventsJobData === "undefined" ? Object : BlocklistItemDeleteCalendarEventsJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], BlocklistItemDeleteCalendarEventsJob.prototype, "handle", null);
BlocklistItemDeleteCalendarEventsJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.calendarQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _calendareventcleanerservice.CalendarEventCleanerService === "undefined" ? Object : _calendareventcleanerservice.CalendarEventCleanerService
    ])
], BlocklistItemDeleteCalendarEventsJob);

//# sourceMappingURL=blocklist-item-delete-calendar-events.job.js.map