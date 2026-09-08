/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageEventListener", {
    enumerable: true,
    get: function() {
        return UsageEventListener;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _oncustombatcheventdecorator = require("../../../api/graphql/graphql-query-runner/decorators/on-custom-batch-event.decorator");
const _eventlogemitterservice = require("../../event-logs/emit/event-log-emitter.service");
const _usagerecordedconstant = require("../constants/usage-recorded.constant");
const _buildusageeventenvelopes = require("../utils/build-usage-event-envelopes");
const _customworkspacebatcheventtype = require("../../../workspace-event-emitter/types/custom-workspace-batch-event.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UsageEventListener = class UsageEventListener {
    async handleUsageRecordedEvent(payload) {
        if (!(0, _utils.isDefined)(payload.workspaceId) || !this.eventLogEmitterService.isEnabled()) {
            return;
        }
        try {
            await this.eventLogEmitterService.dispatch((0, _buildusageeventenvelopes.buildUsageEventEnvelopes)(payload.workspaceId, payload.events));
        } catch (error) {
            // Usage analytics is best-effort; never fail the emitting flow.
            this.logger.error('Failed to record usage events', error);
        }
    }
    constructor(eventLogEmitterService){
        this.eventLogEmitterService = eventLogEmitterService;
        this.logger = new _common.Logger(UsageEventListener.name);
    }
};
_ts_decorate([
    (0, _oncustombatcheventdecorator.OnCustomBatchEvent)(_usagerecordedconstant.USAGE_RECORDED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _customworkspacebatcheventtype.CustomWorkspaceEventBatch === "undefined" ? Object : _customworkspacebatcheventtype.CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], UsageEventListener.prototype, "handleUsageRecordedEvent", null);
UsageEventListener = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _eventlogemitterservice.EventLogEmitterService === "undefined" ? Object : _eventlogemitterservice.EventLogEmitterService
    ])
], UsageEventListener);

//# sourceMappingURL=usage-event.listener.js.map