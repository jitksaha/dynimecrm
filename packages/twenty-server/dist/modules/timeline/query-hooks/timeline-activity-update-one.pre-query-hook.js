"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityUpdateOnePreQueryHook", {
    enumerable: true,
    get: function() {
        return TimelineActivityUpdateOnePreQueryHook;
    }
});
const _workspacequeryhookdecorator = require("../../../engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator");
const _timelineactivitymutationinpututil = require("./utils/timeline-activity-mutation-input.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TimelineActivityUpdateOnePreQueryHook = class TimelineActivityUpdateOnePreQueryHook {
    async execute(authContext, _objectName, payload) {
        const data = authContext.type === 'application' ? (0, _timelineactivitymutationinpututil.sanitizeApplicationTimelineActivityInput)({
            record: payload.data
        }) : payload.data;
        (0, _timelineactivitymutationinpututil.assertTimelineActivityTypeIsNotUpdated)([
            data
        ]);
        return {
            ...payload,
            data
        };
    }
};
TimelineActivityUpdateOnePreQueryHook = _ts_decorate([
    (0, _workspacequeryhookdecorator.WorkspaceQueryHook)('timelineActivity.updateOne')
], TimelineActivityUpdateOnePreQueryHook);

//# sourceMappingURL=timeline-activity-update-one.pre-query-hook.js.map