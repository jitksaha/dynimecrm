"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceEventSinkService", {
    enumerable: true,
    get: function() {
        return WorkspaceEventSinkService;
    }
});
const _common = require("@nestjs/common");
const _eventsink = require("./event-sink");
const _eventlogliveservice = require("../live/event-log-live.service");
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
let WorkspaceEventSinkService = class WorkspaceEventSinkService {
    isEnabled() {
        return this.sinks.length > 0;
    }
    async ingest(events) {
        await this.persist(events);
        await this.workspaceEventLiveService.publishWatched(events);
    }
    async persist(events) {
        await Promise.all(this.sinks.map((sink)=>sink.write(events)));
    }
    constructor(sinks, workspaceEventLiveService){
        this.sinks = sinks;
        this.workspaceEventLiveService = workspaceEventLiveService;
    }
};
WorkspaceEventSinkService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_eventsink.EVENT_SINKS)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        typeof _eventlogliveservice.EventLogLiveService === "undefined" ? Object : _eventlogliveservice.EventLogLiveService
    ])
], WorkspaceEventSinkService);

//# sourceMappingURL=workspace-event-sink.service.js.map