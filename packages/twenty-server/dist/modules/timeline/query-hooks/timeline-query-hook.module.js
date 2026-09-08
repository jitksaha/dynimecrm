"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineQueryHookModule", {
    enumerable: true,
    get: function() {
        return TimelineQueryHookModule;
    }
});
const _common = require("@nestjs/common");
const _timelineactivitycreatemanyprequeryhook = require("./timeline-activity-create-many.pre-query-hook");
const _timelineactivitycreateoneprequeryhook = require("./timeline-activity-create-one.pre-query-hook");
const _timelineactivitymutationqueryhookservice = require("./timeline-activity-mutation-query-hook.service");
const _timelineactivityupdatemanyprequeryhook = require("./timeline-activity-update-many.pre-query-hook");
const _timelineactivityupdateoneprequeryhook = require("./timeline-activity-update-one.pre-query-hook");
const _timelineactivitymodule = require("../timeline-activity.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TimelineQueryHookModule = class TimelineQueryHookModule {
};
TimelineQueryHookModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _timelineactivitymodule.TimelineActivityModule
        ],
        providers: [
            _timelineactivitymutationqueryhookservice.TimelineActivityMutationQueryHookService,
            _timelineactivitycreateoneprequeryhook.TimelineActivityCreateOnePreQueryHook,
            _timelineactivitycreatemanyprequeryhook.TimelineActivityCreateManyPreQueryHook,
            _timelineactivityupdateoneprequeryhook.TimelineActivityUpdateOnePreQueryHook,
            _timelineactivityupdatemanyprequeryhook.TimelineActivityUpdateManyPreQueryHook
        ]
    })
], TimelineQueryHookModule);

//# sourceMappingURL=timeline-query-hook.module.js.map