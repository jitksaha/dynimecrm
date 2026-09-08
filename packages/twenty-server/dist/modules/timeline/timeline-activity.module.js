"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityModule", {
    enumerable: true,
    get: function() {
        return TimelineActivityModule;
    }
});
const _common = require("@nestjs/common");
const _workspacemanyorallflatentitymapscachemodule = require("../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _timelineactivityroutingplanservice = require("./services/timeline-activity-routing-plan.service");
const _timelineactivitytargetqueryservice = require("./services/timeline-activity-target-query.service");
const _timelineactivitytypecacheservice = require("./services/timeline-activity-type-cache.service");
const _timelineactivityservice = require("./services/timeline-activity.service");
const _timelineactivityrepository = require("./repositories/timeline-activity.repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TimelineActivityModule = class TimelineActivityModule {
};
TimelineActivityModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule
        ],
        providers: [
            _timelineactivityrepository.TimelineActivityRepository,
            _timelineactivityservice.TimelineActivityService,
            _timelineactivityroutingplanservice.TimelineActivityRoutingPlanService,
            _timelineactivitytargetqueryservice.TimelineActivityTargetQueryService,
            _timelineactivitytypecacheservice.TimelineActivityTypeCacheService
        ],
        exports: [
            _timelineactivityservice.TimelineActivityService,
            _timelineactivitytypecacheservice.TimelineActivityTypeCacheService,
            _timelineactivityroutingplanservice.TimelineActivityRoutingPlanService
        ]
    })
], TimelineActivityModule);

//# sourceMappingURL=timeline-activity.module.js.map