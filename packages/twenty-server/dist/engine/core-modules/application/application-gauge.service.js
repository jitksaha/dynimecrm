"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationGaugeService", {
    enumerable: true,
    get: function() {
        return ApplicationGaugeService;
    }
});
const _common = require("@nestjs/common");
const _applicationservice = require("./application.service");
const _metricsservice = require("../metrics/metrics.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const TOP_INSTALLED_APPS_LIMIT = 100;
let ApplicationGaugeService = class ApplicationGaugeService {
    onModuleInit() {
        this.metricsService.createMultiObservableGauge({
            metricName: 'twenty_app_installed_workspaces_total',
            options: {
                description: 'Number of workspaces each application is installed in (top 100 external apps by install count)'
            },
            callback: async ()=>{
                try {
                    const installedApps = await this.applicationService.countInstalledWorkspacesByApplication({
                        limit: TOP_INSTALLED_APPS_LIMIT
                    });
                    return installedApps.map((installedApp)=>({
                            value: installedApp.installedWorkspaceCount,
                            attributes: {
                                universal_identifier: installedApp.universalIdentifier,
                                app_name: installedApp.name,
                                source_type: installedApp.sourceType
                            }
                        }));
                } catch (error) {
                    this.logger.error('Failed to collect installed application counts for gauge', error);
                    return [];
                }
            },
            cacheValue: true
        });
    }
    constructor(metricsService, applicationService){
        this.metricsService = metricsService;
        this.applicationService = applicationService;
        this.logger = new _common.Logger(ApplicationGaugeService.name);
    }
};
ApplicationGaugeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], ApplicationGaugeService);

//# sourceMappingURL=application-gauge.service.js.map