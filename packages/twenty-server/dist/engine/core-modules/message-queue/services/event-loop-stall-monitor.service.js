"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventLoopStallMonitorService", {
    enumerable: true,
    get: function() {
        return EventLoopStallMonitorService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const TICK_INTERVAL_MS = 500;
const STALL_THRESHOLD_MS = 5_000;
const LOG_MIN_INTERVAL_MS = 30_000;
let EventLoopStallMonitorService = class EventLoopStallMonitorService {
    onModuleInit() {
        this.lastTickAt = Date.now();
        this.tickHandle = setInterval(()=>this.tick(), TICK_INTERVAL_MS);
        this.tickHandle.unref();
    }
    onModuleDestroy() {
        if ((0, _utils.isDefined)(this.tickHandle)) {
            clearInterval(this.tickHandle);
        }
    }
    registerJobStart({ queueName, jobName, workspaceId }) {
        const token = Symbol(jobName);
        this.jobs.set(token, {
            queueName,
            jobName,
            workspaceId,
            startedAt: Date.now()
        });
        return token;
    }
    // Jobs are kept until the next tick instead of being removed: after a long
    // synchronous block, the job's finally runs in a microtask before the
    // overdue timer fires, so removing it here would hide the stalling job from
    // the very log line meant to name it.
    registerJobEnd(token) {
        const job = this.jobs.get(token);
        if ((0, _utils.isDefined)(job)) {
            job.endedAt = Date.now();
        }
    }
    tick() {
        const now = Date.now();
        const previousTickAt = this.lastTickAt;
        const stallMs = now - previousTickAt - TICK_INTERVAL_MS;
        this.lastTickAt = now;
        if (stallMs >= STALL_THRESHOLD_MS) {
            if (now - this.lastLogAt >= LOG_MIN_INTERVAL_MS) {
                this.logStall({
                    stallMs,
                    now,
                    previousTickAt
                });
                this.lastLogAt = now;
                this.suppressedStallCount = 0;
            } else {
                this.suppressedStallCount += 1;
            }
        }
        for (const [token, job] of this.jobs){
            if ((0, _utils.isDefined)(job.endedAt) && job.endedAt < previousTickAt) {
                this.jobs.delete(token);
            }
        }
    }
    logStall({ stallMs, now, previousTickAt }) {
        const inFlight = [
            ...this.jobs.values()
        ].filter((job)=>!(0, _utils.isDefined)(job.endedAt) || job.endedAt >= previousTickAt);
        const jobs = inFlight.map((job)=>`${job.queueName}/${job.jobName}` + ((0, _guards.isNonEmptyString)(job.workspaceId) ? ` workspace=${job.workspaceId}` : '') + ` elapsedMs=${(job.endedAt ?? now) - job.startedAt}` + ((0, _utils.isDefined)(job.endedAt) ? ' (just finished)' : '')).join('; ');
        const suppressedSuffix = this.suppressedStallCount > 0 ? ` (${this.suppressedStallCount} earlier stall(s) not logged)` : '';
        this.logger.warn(`Event loop stalled for ${stallMs}ms with ${inFlight.length} job(s) in flight${suppressedSuffix}: ${(0, _guards.isNonEmptyString)(jobs) ? jobs : 'none'}`);
    }
    constructor(){
        this.logger = new _common.Logger(EventLoopStallMonitorService.name);
        this.jobs = new Map();
        this.lastTickAt = 0;
        this.lastLogAt = 0;
        this.suppressedStallCount = 0;
    }
};
EventLoopStallMonitorService = _ts_decorate([
    (0, _common.Injectable)()
], EventLoopStallMonitorService);

//# sourceMappingURL=event-loop-stall-monitor.service.js.map