/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageRecorderService", {
    enumerable: true,
    get: function() {
        return UsageRecorderService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _nobillingsubscriptionconstant = require("../../billing/constants/no-billing-subscription.constant");
const _eventlogemitterservice = require("../../event-logs/emit/event-log-emitter.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _usagerecordedconstant = require("../constants/usage-recorded.constant");
const _buildusageeventenvelopes = require("../utils/build-usage-event-envelopes");
const _usagerollupbuffer = require("../utils/usage-rollup-buffer");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _workspaceeventemitter = require("../../../workspace-event-emitter/workspace-event-emitter");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const MAX_BUFFERED_ROLLUPS = 10_000;
let UsageRecorderService = class UsageRecorderService {
    onModuleInit() {
        this.flushTimer = setInterval(()=>void this.flush(), this.twentyConfigService.get('USAGE_ROLLUP_FLUSH_INTERVAL_MS'));
        this.flushTimer.unref();
    }
    async onModuleDestroy() {
        await this.flushAndStop();
    }
    async flushAndStop() {
        if ((0, _utils.isDefined)(this.flushTimer)) {
            clearInterval(this.flushTimer);
            this.flushTimer = null;
        }
        await this.flush();
    }
    async record(workspaceId, inputs) {
        if (!this.eventLogEmitterService.isEnabled() || inputs.length === 0) {
            return;
        }
        const periodStart = await this.resolvePeriodStart(workspaceId);
        this.workspaceEventEmitter.emitCustomBatchEvent(_usagerecordedconstant.USAGE_RECORDED, inputs.map((input)=>({
                ...this.withDefaults(input),
                periodStart
            })), workspaceId);
    }
    accumulate(workspaceId, input) {
        if (!this.eventLogEmitterService.isEnabled()) {
            return;
        }
        this.buffer.increment(workspaceId, this.withDefaults(input));
        if (this.buffer.isFull) {
            void this.flush();
        }
    }
    flush() {
        this.pendingFlush = this.pendingFlush.then(()=>this.drainAndDispatch()).catch((error)=>this.logger.error('Failed to flush usage rollups', error));
        return this.pendingFlush;
    }
    async drainAndDispatch() {
        const entries = [
            ...this.buffer.drain().entries()
        ];
        if (entries.length === 0) {
            return;
        }
        const results = await Promise.allSettled(entries.map(([workspaceId, usageEvents])=>this.dispatchRollups(workspaceId, usageEvents)));
        const failedEntries = entries.filter((_, index)=>results[index].status === 'rejected');
        if (failedEntries.length === 0) {
            return;
        }
        failedEntries.forEach(([workspaceId, usageEvents])=>usageEvents.forEach((usageEvent)=>this.buffer.increment(workspaceId, usageEvent)));
        this.logger.warn(`Failed to flush usage rollups for ${failedEntries.length}/${entries.length} workspace(s); re-buffered for next flush`);
    }
    async dispatchRollups(workspaceId, usageEvents) {
        const periodStart = await this.resolvePeriodStart(workspaceId);
        return this.eventLogEmitterService.dispatch((0, _buildusageeventenvelopes.buildUsageEventEnvelopes)(workspaceId, usageEvents.map((usageEvent)=>({
                ...usageEvent,
                periodStart: usageEvent.periodStart ?? periodStart
            }))));
    }
    withDefaults(input) {
        return {
            ...input,
            creditsUsedMicro: input.creditsUsedMicro ?? 0
        };
    }
    async resolvePeriodStart(workspaceId) {
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return undefined;
        }
        const { currentBillingSubscription } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'currentBillingSubscription'
        ]);
        return currentBillingSubscription === _nobillingsubscriptionconstant.NO_BILLING_SUBSCRIPTION ? undefined : currentBillingSubscription.currentPeriodStart;
    }
    constructor(workspaceEventEmitter, eventLogEmitterService, workspaceCacheService, twentyConfigService){
        this.workspaceEventEmitter = workspaceEventEmitter;
        this.eventLogEmitterService = eventLogEmitterService;
        this.workspaceCacheService = workspaceCacheService;
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(UsageRecorderService.name);
        this.buffer = new _usagerollupbuffer.UsageRollupBuffer(MAX_BUFFERED_ROLLUPS);
        this.flushTimer = null;
        this.pendingFlush = Promise.resolve();
    }
};
UsageRecorderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventemitter.WorkspaceEventEmitter === "undefined" ? Object : _workspaceeventemitter.WorkspaceEventEmitter,
        typeof _eventlogemitterservice.EventLogEmitterService === "undefined" ? Object : _eventlogemitterservice.EventLogEmitterService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], UsageRecorderService);

//# sourceMappingURL=usage-recorder.service.js.map