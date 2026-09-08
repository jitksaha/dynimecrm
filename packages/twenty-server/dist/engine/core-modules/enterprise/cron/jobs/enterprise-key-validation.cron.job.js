/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EnterpriseKeyValidationCronJob", {
    enumerable: true,
    get: function() {
        return EnterpriseKeyValidationCronJob;
    }
});
const _common = require("@nestjs/common");
const _sentrycronmonitordecorator = require("../../../cron/sentry-cron-monitor.decorator");
const _enterprisekeyvalidationcronpatternconstant = require("../../constants/enterprise-key-validation-cron-pattern.constant");
const _enterpriseplanservice = require("../../services/enterprise-plan.service");
const _processdecorator = require("../../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../message-queue/message-queue.constants");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EnterpriseKeyValidationCronJob = class EnterpriseKeyValidationCronJob {
    async handle() {
        this.logger.log('Starting enterprise validity token refresh and seat report...');
        try {
            const refreshSuccess = await this.enterprisePlanService.refreshValidityToken();
            if (refreshSuccess) {
                this.logger.log('Enterprise validity token refreshed successfully');
            } else {
                this.logger.warn('Enterprise validity token refresh did not succeed. ' + 'Existing validity token will continue to work until expiration.');
            }
        } catch (error) {
            this.logger.warn(`Enterprise validity token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}. ` + 'Existing validity token will continue to work until expiration.');
        }
        try {
            const seatCount = await this.enterprisePlanService.getBillableSeatCount();
            const reportSuccess = await this.enterprisePlanService.reportSeats(seatCount);
            if (reportSuccess) {
                this.logger.log(`Reported ${seatCount} seats to enterprise API`);
            } else {
                this.logger.warn('Seat report did not succeed');
            }
        } catch (error) {
            this.logger.warn(`Failed to get seat count or report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    constructor(enterprisePlanService){
        this.enterprisePlanService = enterprisePlanService;
        this.logger = new _common.Logger(EnterpriseKeyValidationCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(EnterpriseKeyValidationCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(EnterpriseKeyValidationCronJob.name, _enterprisekeyvalidationcronpatternconstant.ENTERPRISE_KEY_VALIDATION_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], EnterpriseKeyValidationCronJob.prototype, "handle", null);
EnterpriseKeyValidationCronJob = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _enterpriseplanservice.EnterprisePlanService === "undefined" ? Object : _enterpriseplanservice.EnterprisePlanService
    ])
], EnterpriseKeyValidationCronJob);

//# sourceMappingURL=enterprise-key-validation.cron.job.js.map