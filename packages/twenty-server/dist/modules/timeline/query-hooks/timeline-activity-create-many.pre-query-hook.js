"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityCreateManyPreQueryHook", {
    enumerable: true,
    get: function() {
        return TimelineActivityCreateManyPreQueryHook;
    }
});
const _workspacequeryhookdecorator = require("../../../engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator");
const _timelineactivitymutationqueryhookservice = require("./timeline-activity-mutation-query-hook.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TimelineActivityCreateManyPreQueryHook = class TimelineActivityCreateManyPreQueryHook {
    async execute(authContext, _objectName, payload) {
        return {
            ...payload,
            data: await this.timelineActivityMutationQueryHookService.stampTimelineActivityTypeSnapshot({
                workspaceId: authContext.workspace.id,
                applicationId: authContext.type === 'application' ? authContext.application.id : undefined,
                records: payload.data,
                upsert: payload.upsert
            })
        };
    }
    constructor(timelineActivityMutationQueryHookService){
        this.timelineActivityMutationQueryHookService = timelineActivityMutationQueryHookService;
    }
};
TimelineActivityCreateManyPreQueryHook = _ts_decorate([
    (0, _workspacequeryhookdecorator.WorkspaceQueryHook)('timelineActivity.createMany'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _timelineactivitymutationqueryhookservice.TimelineActivityMutationQueryHookService === "undefined" ? Object : _timelineactivitymutationqueryhookservice.TimelineActivityMutationQueryHookService
    ])
], TimelineActivityCreateManyPreQueryHook);

//# sourceMappingURL=timeline-activity-create-many.pre-query-hook.js.map