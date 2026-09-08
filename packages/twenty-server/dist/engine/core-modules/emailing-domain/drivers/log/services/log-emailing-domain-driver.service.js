"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LogEmailingDomainDriver", {
    enumerable: true,
    get: function() {
        return LogEmailingDomainDriver;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _emailingdomaindriverexception = require("../../exceptions/emailing-domain-driver.exception");
const _unsubscribehostnameprefixconstant = require("../../../constants/unsubscribe-hostname-prefix.constant");
const _emailingdomainstatustype = require("../../types/emailing-domain-status.type");
const _unsubscribecontentservice = require("../../../services/unsubscribe-content.service");
const _twentyconfigservice = require("../../../../twenty-config/twenty-config.service");
const _workspaceentity = require("../../../../workspace/workspace.entity");
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
const SIMULATED_PROVIDER = {
    sendLatencyMs: 50,
    throttleFailureRatio: 0
};
let LogEmailingDomainDriver = class LogEmailingDomainDriver {
    async provisionWorkspace(workspaceId) {
        this.logger.log(`[log-driver] provisionWorkspace(${workspaceId})`);
    }
    async deprovisionWorkspace(workspaceId) {
        this.logger.log(`[log-driver] deprovisionWorkspace(${workspaceId})`);
    }
    async verifyDomain(input) {
        return this.alwaysVerified('verifyDomain', input.domain);
    }
    async getDomainStatus(input) {
        return this.alwaysVerified('getDomainStatus', input.domain);
    }
    alwaysVerified(operation, domain) {
        this.logger.log(`[log-driver] ${operation}(${domain}) → VERIFIED`);
        return {
            status: _emailingdomainstatustype.EmailingDomainStatus.VERIFIED,
            verificationRecords: this.buildSyntheticVerificationRecords(domain)
        };
    }
    buildSyntheticVerificationRecords(domain) {
        return [
            {
                type: 'CNAME',
                key: `synthetic1._domainkey.${domain}`,
                value: `synthetic1.dkim.amazonses.example`,
                status: 'success'
            },
            {
                type: 'CNAME',
                key: `synthetic2._domainkey.${domain}`,
                value: `synthetic2.dkim.amazonses.example`,
                status: 'success'
            },
            {
                type: 'CNAME',
                key: `synthetic3._domainkey.${domain}`,
                value: `synthetic3.dkim.amazonses.example`,
                status: 'pending'
            },
            {
                type: 'CNAME',
                key: `${_unsubscribehostnameprefixconstant.UNSUBSCRIBE_HOSTNAME_PREFIX}.${domain}`,
                value: `app.localhost`,
                status: 'pending'
            },
            {
                type: 'CNAME',
                key: `_acme-challenge.${_unsubscribehostnameprefixconstant.UNSUBSCRIBE_HOSTNAME_PREFIX}.${domain}`,
                value: `${domain}.dcv.cloudflare.example`,
                status: 'error'
            }
        ];
    }
    async registerDomain(input) {
        this.logger.log(`[log-driver] registerDomain(${input.domain})`);
    }
    async cleanupDomain(input) {
        this.logger.log(`[log-driver] cleanupDomain(${input.domain})`);
    }
    async simulateProviderCall() {
        if (SIMULATED_PROVIDER.sendLatencyMs > 0) {
            await new Promise((resolve)=>setTimeout(resolve, SIMULATED_PROVIDER.sendLatencyMs));
        }
        if (Math.random() < SIMULATED_PROVIDER.throttleFailureRatio) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException('[log-driver] simulated provider throttling', _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR);
        }
    }
    async sendEmail(input) {
        await this.simulateProviderCall();
        const unsubscribeBaseUrl = await this.getUnsubscribeBaseUrl(input.workspaceId);
        const emailToSend = this.unsubscribeContentService.addTo(input, unsubscribeBaseUrl);
        const messageId = `log-${(0, _uuid.v4)()}`;
        const listUnsubscribe = emailToSend.headers?.find((header)=>header.name === 'List-Unsubscribe')?.value;
        this.logger.log(`[log-driver] sendEmail → fake messageId=${messageId}\n` + `From: ${emailToSend.from}\n` + `To: ${emailToSend.to.join(',')}\n` + `Subject: ${emailToSend.subject}\n` + `List-Unsubscribe: ${listUnsubscribe ?? '(none)'}\n` + `Content Text: ${emailToSend.text}\n` + `Content HTML: ${emailToSend.html ?? '(none)'}`);
        return {
            messageId,
            deliveredRecipients: {
                to: emailToSend.to,
                cc: emailToSend.cc ?? [],
                bcc: emailToSend.bcc ?? []
            }
        };
    }
    async getUnsubscribeBaseUrl(workspaceId) {
        const workspace = await this.workspaceRepository.findOneBy({
            id: workspaceId
        });
        if (!(0, _guards.isNonEmptyString)(workspace?.subdomain)) {
            return null;
        }
        const baseUrl = new URL(this.twentyConfigService.get('SERVER_URL'));
        baseUrl.hostname = this.twentyConfigService.get('IS_MULTIWORKSPACE_ENABLED') ? `${_unsubscribehostnameprefixconstant.UNSUBSCRIBE_HOSTNAME_PREFIX}.${workspace.subdomain}.${baseUrl.hostname}` : `${_unsubscribehostnameprefixconstant.UNSUBSCRIBE_HOSTNAME_PREFIX}.${baseUrl.hostname}`;
        return baseUrl.origin;
    }
    constructor(twentyConfigService, unsubscribeContentService, workspaceRepository){
        this.twentyConfigService = twentyConfigService;
        this.unsubscribeContentService = unsubscribeContentService;
        this.workspaceRepository = workspaceRepository;
        this.logger = new _common.Logger(LogEmailingDomainDriver.name);
    }
};
LogEmailingDomainDriver = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _unsubscribecontentservice.UnsubscribeContentService === "undefined" ? Object : _unsubscribecontentservice.UnsubscribeContentService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], LogEmailingDomainDriver);

//# sourceMappingURL=log-emailing-domain-driver.service.js.map