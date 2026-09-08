"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationJobEnqueueThrottlerService", {
    enumerable: true,
    get: function() {
        return ApplicationJobEnqueueThrottlerService;
    }
});
const _common = require("@nestjs/common");
const _metricsservice = require("../../metrics/metrics.service");
const _metricskeystype = require("../../metrics/types/metrics-keys.type");
const _throttlerexception = require("../../throttler/throttler.exception");
const _throttlerservice = require("../../throttler/throttler.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationJobEnqueueThrottlerService = class ApplicationJobEnqueueThrottlerService {
    async throttleOrThrow({ applicationId, applicationRegistrationId, jobCount = 1 }) {
        const timeWindow = this.twentyConfigService.get('APPLICATION_JOB_ENQUEUE_RATE_LIMITING_TTL_IN_MS');
        const applicationKey = `enqueue:throttler:application:${applicationId}`;
        const applicationLimit = this.twentyConfigService.get('APPLICATION_JOB_ENQUEUE_RATE_LIMITING_LIMIT');
        const registrationKey = `enqueue:throttler:application-registration:${applicationRegistrationId}`;
        const registrationLimit = this.twentyConfigService.get('APPLICATION_REGISTRATION_JOB_ENQUEUE_RATE_LIMITING_LIMIT');
        const [applicationTokens, registrationTokens] = await Promise.all([
            this.throttlerService.getAvailableTokensCount(applicationKey, applicationLimit, timeWindow),
            this.throttlerService.getAvailableTokensCount(registrationKey, registrationLimit, timeWindow)
        ]);
        if (applicationTokens < jobCount || registrationTokens < jobCount) {
            await this.metricsService.incrementCounterForEvent({
                key: _metricskeystype.MetricsKeys.JobEnqueueApplicationRateLimited,
                shouldStoreInCache: false,
                attributes: {
                    application_id: applicationId,
                    application_registration_id: applicationRegistrationId
                }
            });
            throw new _throttlerexception.ThrottlerException('Application job enqueue limit reached', _throttlerexception.ThrottlerExceptionCode.LIMIT_REACHED);
        }
        await Promise.all([
            this.throttlerService.consumeTokens(applicationKey, jobCount, applicationLimit, timeWindow),
            this.throttlerService.consumeTokens(registrationKey, jobCount, registrationLimit, timeWindow)
        ]);
    }
    constructor(throttlerService, twentyConfigService, metricsService){
        this.throttlerService = throttlerService;
        this.twentyConfigService = twentyConfigService;
        this.metricsService = metricsService;
    }
};
ApplicationJobEnqueueThrottlerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _throttlerservice.ThrottlerService === "undefined" ? Object : _throttlerservice.ThrottlerService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], ApplicationJobEnqueueThrottlerService);

//# sourceMappingURL=application-job-enqueue-throttler.service.js.map