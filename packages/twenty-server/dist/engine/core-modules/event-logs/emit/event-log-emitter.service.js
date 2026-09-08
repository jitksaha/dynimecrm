"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventLogEmitterService", {
    enumerable: true,
    get: function() {
        return EventLogEmitterService;
    }
});
const _common = require("@nestjs/common");
const _buildeventenvelope = require("./build-event-envelope");
const _workspaceeventsinkservice = require("../ingest/workspace-event-sink.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EventLogEmitterService = class EventLogEmitterService {
    isEnabled() {
        return this.workspaceEventSinkService.isEnabled();
    }
    async dispatch(events) {
        if (events.length === 0 || !this.isEnabled()) {
            return;
        }
        await this.workspaceEventSinkService.ingest(events);
    }
    createContext(context) {
        const contextFields = (0, _buildeventenvelope.computeEventContextFields)(context);
        return {
            insertWorkspaceEvent: (event, properties)=>this.emit(()=>(0, _buildeventenvelope.buildWorkspaceEventEnvelope)(contextFields, event, properties)),
            createObjectEvent: (event, properties)=>this.emit(()=>(0, _buildeventenvelope.buildObjectEventEnvelope)(contextFields, event, properties)),
            createPageviewEvent: (name, properties)=>this.emit(()=>(0, _buildeventenvelope.buildPageviewEnvelope)(contextFields, name, properties))
        };
    }
    async emit(buildEnvelope) {
        try {
            await this.dispatch([
                buildEnvelope()
            ]);
            return {
                success: true
            };
        } catch (error) {
            this.logger.error('Failed to emit workspace event', error);
            return {
                success: false
            };
        }
    }
    constructor(workspaceEventSinkService){
        this.workspaceEventSinkService = workspaceEventSinkService;
        this.logger = new _common.Logger(EventLogEmitterService.name);
    }
};
EventLogEmitterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventsinkservice.WorkspaceEventSinkService === "undefined" ? Object : _workspaceeventsinkservice.WorkspaceEventSinkService
    ])
], EventLogEmitterService);

//# sourceMappingURL=event-log-emitter.service.js.map