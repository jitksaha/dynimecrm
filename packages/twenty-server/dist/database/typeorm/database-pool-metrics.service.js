"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DatabasePoolMetricsService () {
        return DatabasePoolMetricsService;
    },
    get DatabasePoolName () {
        return DatabasePoolName;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _metricsservice = require("../../engine/core-modules/metrics/metrics.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var DatabasePoolName = /*#__PURE__*/ function(DatabasePoolName) {
    DatabasePoolName["Core"] = "core";
    DatabasePoolName["WorkspacePrimary"] = "workspace_primary";
    DatabasePoolName["WorkspaceReplica"] = "workspace_replica";
    DatabasePoolName["WorkspaceV2Primary"] = "workspace_v2_primary";
    DatabasePoolName["WorkspaceV2Replica"] = "workspace_v2_replica";
    return DatabasePoolName;
}({});
const ACQUISITION_DURATION_BUCKETS_SECONDS = [
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
    5,
    10
];
const POOL_GAUGES = [
    {
        metricName: 'twenty_database_pool_total_connections',
        description: 'Current total number of PostgreSQL pool connections',
        getValue: (pool)=>pool.totalCount
    },
    {
        metricName: 'twenty_database_pool_idle_connections',
        description: 'Current number of idle PostgreSQL pool connections',
        getValue: (pool)=>pool.idleCount
    },
    {
        metricName: 'twenty_database_pool_waiting_requests',
        description: 'Current number of requests waiting for a PostgreSQL pool connection',
        getValue: (pool)=>pool.waitingCount
    },
    {
        metricName: 'twenty_database_pool_max_connections',
        description: 'Maximum number of PostgreSQL pool connections',
        getValue: (pool)=>pool.options.max
    }
];
let DatabasePoolMetricsService = class DatabasePoolMetricsService {
    registerPool({ poolName, pool }) {
        this.pools.set(poolName, pool);
        if (this.instrumentedPools.has(pool)) {
            return;
        }
        const connect = pool.connect.bind(pool);
        const recordAcquisition = (startedAt, error)=>{
            if ((0, _utils.isDefined)(error)) {
                this.acquisitionFailureCounter.add(1, {
                    pool: poolName
                });
            }
            this.acquisitionDurationHistogram.record((performance.now() - startedAt) / 1000, {
                pool: poolName
            });
        };
        pool.connect = (callback)=>{
            const startedAt = performance.now();
            if ((0, _utils.isDefined)(callback)) {
                return connect((error, client, release)=>{
                    recordAcquisition(startedAt, error);
                    callback(error, client, release);
                });
            }
            return connect().then((client)=>{
                recordAcquisition(startedAt);
                return client;
            }, (error)=>{
                recordAcquisition(startedAt, error);
                throw error;
            });
        };
        this.instrumentedPools.add(pool);
    }
    unregisterPool(poolName) {
        this.pools.delete(poolName);
    }
    registerDataSource({ poolName, dataSource }) {
        const driver = dataSource.driver;
        const pool = driver.master;
        this.pools.set(poolName, pool);
        if (this.instrumentedDrivers.has(driver)) {
            return;
        }
        const obtainMasterConnection = driver.obtainMasterConnection.bind(driver);
        driver.obtainMasterConnection = async ()=>{
            const start = performance.now();
            try {
                return await obtainMasterConnection();
            } catch (error) {
                this.acquisitionFailureCounter.add(1, {
                    pool: poolName
                });
                throw error;
            } finally{
                this.acquisitionDurationHistogram.record((performance.now() - start) / 1000, {
                    pool: poolName
                });
            }
        };
        this.instrumentedDrivers.add(driver);
    }
    constructor(metricsService){
        this.metricsService = metricsService;
        this.pools = new Map();
        this.instrumentedDrivers = new WeakSet();
        this.instrumentedPools = new WeakSet();
        const meter = this.metricsService.getMeter();
        this.acquisitionDurationHistogram = meter.createHistogram('twenty_database_pool_acquisition_duration_seconds', {
            description: 'Time spent acquiring a connection from the PostgreSQL pool',
            unit: 's',
            advice: {
                explicitBucketBoundaries: ACQUISITION_DURATION_BUCKETS_SECONDS
            }
        });
        this.acquisitionFailureCounter = meter.createCounter('twenty_database_pool_acquisition_failures', {
            description: 'Number of failed PostgreSQL pool connection acquisitions'
        });
        for (const gauge of POOL_GAUGES){
            this.metricsService.createMultiObservableGauge({
                metricName: gauge.metricName,
                options: {
                    description: gauge.description
                },
                callback: async ()=>Array.from(this.pools, ([poolName, pool])=>({
                            value: gauge.getValue(pool),
                            attributes: {
                                pool: poolName
                            }
                        }))
            });
        }
    }
};
DatabasePoolMetricsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], DatabasePoolMetricsService);

//# sourceMappingURL=database-pool-metrics.service.js.map