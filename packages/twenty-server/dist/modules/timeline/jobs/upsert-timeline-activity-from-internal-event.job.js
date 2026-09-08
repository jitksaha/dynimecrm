"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpsertTimelineActivityFromInternalEvent", {
    enumerable: true,
    get: function() {
        return UpsertTimelineActivityFromInternalEvent;
    }
});
const _processdecorator = require("../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workspaceeventbatchtype = require("../../../engine/workspace-event-emitter/types/workspace-event-batch.type");
const _timelineactivityservice = require("../services/timeline-activity.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpsertTimelineActivityFromInternalEvent = class UpsertTimelineActivityFromInternalEvent {
    async handle(workspaceEventBatch) {
        if (workspaceEventBatch.events.length === 0) {
            return;
        }
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>await this.timelineActivityService.upsertEvents(workspaceEventBatch), (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceEventBatch.workspaceId));
    }
    constructor(timelineActivityService, workspaceOrmManager){
        this.timelineActivityService = timelineActivityService;
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(UpsertTimelineActivityFromInternalEvent.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventbatchtype.WorkspaceEventBatch === "undefined" ? Object : _workspaceeventbatchtype.WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], UpsertTimelineActivityFromInternalEvent.prototype, "handle", null);
UpsertTimelineActivityFromInternalEvent = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.entityEventsToDbQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _timelineactivityservice.TimelineActivityService === "undefined" ? Object : _timelineactivityservice.TimelineActivityService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], UpsertTimelineActivityFromInternalEvent);

//# sourceMappingURL=upsert-timeline-activity-from-internal-event.job.js.map