"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventLoopMetricsService", {
    enumerable: true,
    get: function() {
        return EventLoopMetricsService;
    }
});
const _common = require("@nestjs/common");
const _perf_hooks = require("perf_hooks");
const _metricsservice = require("./metrics.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const SAMPLE_INTERVAL_MS = 1_000;
const MILLISECONDS_PER_SECOND = 1_000;
const DELAY_BUCKETS_SECONDS = [
    0.001,
    0.0025,
    0.005,
    0.01,
    0.025,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2.5,
    5
];
let EventLoopMetricsService = class EventLoopMetricsService {
    onModuleInit() {
        this.lastSampleAt = _perf_hooks.performance.now();
        this.sampler = setInterval(()=>{
            const now = _perf_hooks.performance.now();
            const lagMs = Math.max(0, now - this.lastSampleAt - SAMPLE_INTERVAL_MS);
            this.lastSampleAt = now;
            this.delayHistogram.record(lagMs / MILLISECONDS_PER_SECOND);
        }, SAMPLE_INTERVAL_MS);
        this.sampler.unref();
        this.metricsService.createObservableGauge({
            metricName: 'twenty_nodejs_eventloop_utilization',
            options: {
                description: 'Fraction of time the Node.js event loop was busy since the previous scrape',
                unit: '1'
            },
            callback: async ()=>{
                const current = _perf_hooks.performance.eventLoopUtilization();
                const delta = _perf_hooks.performance.eventLoopUtilization(current, this.lastEventLoopUtilization);
                this.lastEventLoopUtilization = current;
                return delta.utilization;
            }
        });
    }
    onModuleDestroy() {
        if (this.sampler) {
            clearInterval(this.sampler);
        }
    }
    constructor(metricsService){
        this.metricsService = metricsService;
        this.lastSampleAt = _perf_hooks.performance.now();
        this.lastEventLoopUtilization = _perf_hooks.performance.eventLoopUtilization();
        this.delayHistogram = this.metricsService.getMeter().createHistogram('twenty_nodejs_eventloop_delay_seconds', {
            description: 'Node.js event loop lag, sampled per interval',
            unit: 's',
            advice: {
                explicitBucketBoundaries: DELAY_BUCKETS_SECONDS
            }
        });
    }
};
EventLoopMetricsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], EventLoopMetricsService);

//# sourceMappingURL=event-loop-metrics.service.js.map