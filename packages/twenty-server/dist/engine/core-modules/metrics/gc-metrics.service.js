"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GcMetricsService", {
    enumerable: true,
    get: function() {
        return GcMetricsService;
    }
});
const _common = require("@nestjs/common");
const _perf_hooks = require("perf_hooks");
const _v8 = require("v8");
const _utils = require("twenty-shared/utils");
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
const MILLISECONDS_PER_SECOND = 1_000;
const GC_DURATION_BUCKETS_SECONDS = [
    0.0005,
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
const HEAP_STATISTICS_CACHE_MS = 1_000;
const GC_KIND_BY_CONSTANT = new Map([
    [
        _perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR,
        'minor'
    ],
    [
        _perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR,
        'major'
    ],
    [
        _perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL,
        'incremental'
    ],
    [
        _perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB,
        'weakcb'
    ]
]);
const gcKindOf = (detail)=>{
    if (typeof detail !== 'object' || detail === null || !('kind' in detail) || typeof detail.kind !== 'number') {
        return 'unknown';
    }
    return GC_KIND_BY_CONSTANT.get(detail.kind) ?? 'unknown';
};
let GcMetricsService = class GcMetricsService {
    onModuleInit() {
        this.observer = new _perf_hooks.PerformanceObserver((list)=>{
            for (const entry of list.getEntries()){
                this.pauseHistogram.record(entry.duration / MILLISECONDS_PER_SECOND, {
                    kind: gcKindOf(entry.detail)
                });
            }
        });
        this.observer.observe({
            entryTypes: [
                'gc'
            ]
        });
        this.registerHeapGauges();
    }
    onModuleDestroy() {
        this.observer?.disconnect();
    }
    registerHeapGauges() {
        const gauges = [
            {
                metricName: 'twenty_nodejs_heap_used_bytes',
                description: 'V8 heap occupied by live objects',
                read: (statistics)=>statistics.used_heap_size
            },
            {
                metricName: 'twenty_nodejs_heap_total_bytes',
                description: 'V8 heap committed by the process',
                read: (statistics)=>statistics.total_heap_size
            },
            {
                metricName: 'twenty_nodejs_heap_size_limit_bytes',
                description: 'V8 heap ceiling (--max-old-space-size)',
                read: (statistics)=>statistics.heap_size_limit
            },
            {
                metricName: 'twenty_nodejs_heap_external_bytes',
                description: 'Memory held outside the V8 heap by native objects',
                read: (statistics)=>statistics.external_memory
            }
        ];
        for (const gauge of gauges){
            this.metricsService.createObservableGauge({
                metricName: gauge.metricName,
                options: {
                    description: gauge.description,
                    unit: 'By'
                },
                callback: async ()=>gauge.read(this.getHeapStatisticsSnapshot())
            });
        }
    }
    getHeapStatisticsSnapshot() {
        const now = Date.now();
        if (!(0, _utils.isDefined)(this.heapStatistics) || now - this.heapStatisticsAt > HEAP_STATISTICS_CACHE_MS) {
            this.heapStatistics = (0, _v8.getHeapStatistics)();
            this.heapStatisticsAt = now;
        }
        return this.heapStatistics;
    }
    constructor(metricsService){
        this.metricsService = metricsService;
        this.heapStatisticsAt = 0;
        this.pauseHistogram = this.metricsService.getMeter().createHistogram('twenty_nodejs_gc_duration_seconds', {
            description: 'V8 garbage collection pause duration, by collection kind',
            unit: 's',
            advice: {
                explicitBucketBoundaries: GC_DURATION_BUCKETS_SECONDS
            }
        });
    }
};
GcMetricsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], GcMetricsService);

//# sourceMappingURL=gc-metrics.service.js.map