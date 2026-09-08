"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FeatureFlagGaugeService", {
    enumerable: true,
    get: function() {
        return FeatureFlagGaugeService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _featureflagentity = require("../feature-flag.entity");
const _metricsservice = require("../../metrics/metrics.service");
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
const ENABLED_WORKSPACES_METRIC_NAME = 'twenty_feature_flag_enabled_workspaces';
let FeatureFlagGaugeService = class FeatureFlagGaugeService {
    onModuleInit() {
        this.metricsService.createMultiObservableGauge({
            metricName: ENABLED_WORKSPACES_METRIC_NAME,
            options: {
                description: 'Number of workspaces with a given feature flag enabled, labelled by flag_key. Tracks the progress of a feature flag rollout.'
            },
            callback: async ()=>{
                const enabledWorkspacesByFlag = await this.getEnabledWorkspaceCountsByFlag();
                // Emit a series for every known flag, defaulting to 0, so a flag with
                // no enabled workspaces reads as zero rollout rather than missing data.
                return Object.values(_types.FeatureFlagKey).map((flagKey)=>({
                        value: enabledWorkspacesByFlag.get(flagKey) ?? 0,
                        attributes: {
                            flag_key: flagKey
                        }
                    }));
            },
            cacheValue: true
        });
    }
    async getEnabledWorkspaceCountsByFlag() {
        // Join workspace and filter deletedAt: the workspace relation cascades on
        // hard delete only, and featureFlag has no deletedAt, so a soft-deleted
        // workspace would otherwise keep counting toward the rollout forever.
        const rows = await this.dataSource.getRepository(_featureflagentity.FeatureFlagEntity).createQueryBuilder('featureFlag').select('featureFlag.key', 'flagKey').addSelect('COUNT(*)', 'enabledWorkspaces').innerJoin('featureFlag.workspace', 'workspace').where('featureFlag.value = :value', {
            value: true
        }).andWhere('workspace.deletedAt IS NULL').groupBy('featureFlag.key').getRawMany();
        return new Map(rows.map((row)=>[
                row.flagKey,
                Number(row.enabledWorkspaces)
            ]));
    }
    constructor(dataSource, metricsService){
        this.dataSource = dataSource;
        this.metricsService = metricsService;
    }
};
FeatureFlagGaugeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], FeatureFlagGaugeService);

//# sourceMappingURL=feature-flag-gauge.service.js.map