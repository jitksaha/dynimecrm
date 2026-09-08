"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CheckEmailingDomainVerificationCronJob", {
    enumerable: true,
    get: function() {
        return CheckEmailingDomainVerificationCronJob;
    }
});
const _checkemailingdomainverificationcronpatternconstant = require("../../constants/check-emailing-domain-verification-cron-pattern.constant");
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _sentrycronmonitordecorator = require("../../../cron/sentry-cron-monitor.decorator");
const _nonterminalemailingdomainstatusesconstant = require("../../constants/non-terminal-emailing-domain-statuses.constant");
const _emailingdomaindriverfactory = require("../../drivers/emailing-domain-driver.factory");
const _emailingdomainstatustype = require("../../drivers/types/emailing-domain-status.type");
const _unsubscribehostnamestatustype = require("../../drivers/types/unsubscribe-hostname-status.type");
const _emailingdomainentity = require("../../emailing-domain.entity");
const _emailingdomainservice = require("../../services/emailing-domain.service");
const _unsubscribehostnameservice = require("../../services/unsubscribe-hostname.service");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let CheckEmailingDomainVerificationCronJob = class CheckEmailingDomainVerificationCronJob {
    async handle() {
        await this.refreshUnverifiedDomains();
        await this.refreshPendingUnsubscribeHostnames();
        await this.reprovisionVerifiedWorkspaces();
    }
    async reprovisionVerifiedWorkspaces() {
        const verifiedDomains = await this.emailingDomainRepository.find({
            where: {
                status: _emailingdomainstatustype.EmailingDomainStatus.VERIFIED
            },
            select: [
                'workspaceId'
            ]
        });
        const workspaceIds = new Set(verifiedDomains.map((emailingDomain)=>emailingDomain.workspaceId));
        for (const workspaceId of workspaceIds){
            await this.emailingDomainDriverFactory.getCurrentDriver().provisionWorkspace(workspaceId).catch((error)=>{
                this.logger.error(`[${CheckEmailingDomainVerificationCronJob.name}] Cannot reprovision emailing resources for workspace ${workspaceId}: ${error}`);
            });
        }
    }
    async refreshUnverifiedDomains() {
        const unverifiedDomains = await this.emailingDomainRepository.find({
            where: {
                status: (0, _typeorm1.In)(_nonterminalemailingdomainstatusesconstant.NON_TERMINAL_EMAILING_DOMAIN_STATUSES)
            },
            select: [
                'id',
                'workspaceId',
                'domain'
            ]
        });
        for (const emailingDomain of unverifiedDomains){
            await this.emailingDomainService.verifyEmailingDomain({
                workspaceId: emailingDomain.workspaceId,
                emailingDomainId: emailingDomain.id
            }).catch((error)=>{
                this.logger.error(`[${CheckEmailingDomainVerificationCronJob.name}] Cannot verify emailing domain ${emailingDomain.domain} of workspace ${emailingDomain.workspaceId}: ${error}`);
            });
        }
    }
    async refreshPendingUnsubscribeHostnames() {
        const verifiedDomainsWithPendingHostname = await this.emailingDomainRepository.find({
            where: {
                status: _emailingdomainstatustype.EmailingDomainStatus.VERIFIED,
                unsubscribeHostnameStatus: _unsubscribehostnamestatustype.UnsubscribeHostnameStatus.PENDING
            },
            select: [
                'id',
                'workspaceId'
            ]
        });
        for (const emailingDomain of verifiedDomainsWithPendingHostname){
            await this.unsubscribeHostnameService.sync(emailingDomain.workspaceId, emailingDomain.id, {
                provision: false
            });
        }
    }
    constructor(emailingDomainRepository, emailingDomainService, unsubscribeHostnameService, emailingDomainDriverFactory){
        this.emailingDomainRepository = emailingDomainRepository;
        this.emailingDomainService = emailingDomainService;
        this.unsubscribeHostnameService = unsubscribeHostnameService;
        this.emailingDomainDriverFactory = emailingDomainDriverFactory;
        this.logger = new _common.Logger(CheckEmailingDomainVerificationCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(CheckEmailingDomainVerificationCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(CheckEmailingDomainVerificationCronJob.name, _checkemailingdomainverificationcronpatternconstant.CHECK_EMAILING_DOMAIN_VERIFICATION_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CheckEmailingDomainVerificationCronJob.prototype, "handle", null);
CheckEmailingDomainVerificationCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(0, (0, _typeorm.InjectRepository)(_emailingdomainentity.EmailingDomainEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _emailingdomainservice.EmailingDomainService === "undefined" ? Object : _emailingdomainservice.EmailingDomainService,
        typeof _unsubscribehostnameservice.UnsubscribeHostnameService === "undefined" ? Object : _unsubscribehostnameservice.UnsubscribeHostnameService,
        typeof _emailingdomaindriverfactory.EmailingDomainDriverFactory === "undefined" ? Object : _emailingdomaindriverfactory.EmailingDomainDriverFactory
    ])
], CheckEmailingDomainVerificationCronJob);

//# sourceMappingURL=check-emailing-domain-verification.cron.job.js.map