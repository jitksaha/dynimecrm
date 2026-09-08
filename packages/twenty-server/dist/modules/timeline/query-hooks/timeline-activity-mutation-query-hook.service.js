"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityMutationQueryHookService", {
    enumerable: true,
    get: function() {
        return TimelineActivityMutationQueryHookService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _timelineactivitytypecacheservice = require("../services/timeline-activity-type-cache.service");
const _timelineactivitymutationinpututil = require("./utils/timeline-activity-mutation-input.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TimelineActivityMutationQueryHookService = class TimelineActivityMutationQueryHookService {
    async stampTimelineActivityTypeSnapshot({ workspaceId, applicationId, records, upsert }) {
        (0, _timelineactivitymutationinpututil.assertTimelineActivityCreationInputIsValid)({
            records,
            upsert
        });
        const resolvedTimelineActivityTypeById = new Map(await Promise.all([
            ...new Set(records.map(({ timelineActivityTypeId })=>timelineActivityTypeId).filter(_utils.isDefined))
        ].map(async (timelineActivityTypeId)=>[
                timelineActivityTypeId,
                await this.timelineActivityTypeCacheService.getTimelineActivityTypeByIdOrThrow({
                    workspaceId,
                    timelineActivityTypeId
                })
            ])));
        return (0, _timelineactivitymutationinpututil.stampTimelineActivityTypeSnapshots)({
            applicationId,
            records,
            resolvedTimelineActivityTypeById
        });
    }
    constructor(timelineActivityTypeCacheService){
        this.timelineActivityTypeCacheService = timelineActivityTypeCacheService;
    }
};
TimelineActivityMutationQueryHookService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _timelineactivitytypecacheservice.TimelineActivityTypeCacheService === "undefined" ? Object : _timelineactivitytypecacheservice.TimelineActivityTypeCacheService
    ])
], TimelineActivityMutationQueryHookService);

//# sourceMappingURL=timeline-activity-mutation-query-hook.service.js.map