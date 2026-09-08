/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnsubscribeHostnameService", {
    enumerable: true,
    get: function() {
        return UnsubscribeHostnameService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _dnsmanagerexception = require("../../dns-manager/exceptions/dns-manager.exception");
const _unsubscribehostnameprefixconstant = require("../constants/unsubscribe-hostname-prefix.constant");
const _unsubscribehostnamestatustype = require("../drivers/types/unsubscribe-hostname-status.type");
const _emailingdomainentity = require("../emailing-domain.entity");
const _dnsmanagerservice = require("../../dns-manager/services/dns-manager.service");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
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
let UnsubscribeHostnameService = class UnsubscribeHostnameService {
    async provision(emailingDomain) {
        if ((0, _guards.isNonEmptyString)(emailingDomain.unsubscribeHostnameId)) {
            return;
        }
        const hostname = this.buildHostname(emailingDomain.domain);
        const unsubscribeHostnameId = await this.registerOrAdoptHostname(hostname);
        await this.emailingDomainRepository.update(emailingDomain.workspaceId, {
            id: emailingDomain.id
        }, {
            unsubscribeHostname: hostname,
            unsubscribeHostnameId,
            unsubscribeHostnameStatus: _unsubscribehostnamestatustype.UnsubscribeHostnameStatus.PENDING
        });
    }
    async registerOrAdoptHostname(hostname) {
        try {
            const createdHostname = await this.dnsManagerService.registerHostname(hostname);
            return createdHostname.id;
        } catch (error) {
            if (error instanceof _dnsmanagerexception.DnsManagerException && error.code === _dnsmanagerexception.DnsManagerExceptionCode.HOSTNAME_ALREADY_REGISTERED) {
                const existingHostnameId = await this.dnsManagerService.getHostnameId(hostname);
                if ((0, _guards.isNonEmptyString)(existingHostnameId)) {
                    return existingHostnameId;
                }
            }
            throw error;
        }
    }
    async refreshStatus(emailingDomain) {
        if (!(0, _guards.isNonEmptyString)(emailingDomain.unsubscribeHostname)) {
            return;
        }
        const isWorking = await this.dnsManagerService.isHostnameWorking(emailingDomain.unsubscribeHostname);
        await this.emailingDomainRepository.update(emailingDomain.workspaceId, {
            id: emailingDomain.id
        }, {
            unsubscribeHostnameStatus: isWorking ? _unsubscribehostnamestatustype.UnsubscribeHostnameStatus.ACTIVE : _unsubscribehostnamestatustype.UnsubscribeHostnameStatus.PENDING
        });
    }
    async deprovision(emailingDomain) {
        if (!this.dnsManagerService.isConfigured() || !(0, _guards.isNonEmptyString)(emailingDomain.unsubscribeHostname)) {
            return;
        }
        await this.dnsManagerService.deleteHostnameSilently(emailingDomain.unsubscribeHostname);
    }
    async sync(workspaceId, emailingDomainId, { provision }) {
        if (!this.dnsManagerService.isConfigured()) {
            return;
        }
        try {
            const emailingDomain = await this.emailingDomainRepository.findOneOrFail(workspaceId, {
                where: {
                    id: emailingDomainId
                }
            });
            if (provision) {
                await this.provision(emailingDomain);
            }
            await this.refreshStatus(await this.emailingDomainRepository.findOneOrFail(workspaceId, {
                where: {
                    id: emailingDomainId
                }
            }));
        } catch (error) {
            this.logger.warn(`Failed to sync unsubscribe hostname for emailing domain ${emailingDomainId}: ${error}`);
        }
    }
    async withDnsRecords(emailingDomain) {
        const unsubscribeRecords = await this.getDnsRecords(emailingDomain);
        if (unsubscribeRecords.length === 0) {
            return emailingDomain;
        }
        return {
            ...emailingDomain,
            verificationRecords: [
                ...emailingDomain.verificationRecords ?? [],
                ...unsubscribeRecords
            ]
        };
    }
    async getDnsRecords(emailingDomain) {
        if (!(0, _guards.isNonEmptyString)(emailingDomain.unsubscribeHostname)) {
            return [];
        }
        try {
            const hostnameWithRecords = await this.dnsManagerService.getHostnameWithRecords(emailingDomain.unsubscribeHostname);
            if (!(0, _utils.isDefined)(hostnameWithRecords)) {
                return [];
            }
            return hostnameWithRecords.records.map((record)=>({
                    type: 'CNAME',
                    key: record.key,
                    value: record.value,
                    status: record.status
                }));
        } catch (error) {
            this.logger.warn(`Failed to read unsubscribe DNS records for ${emailingDomain.unsubscribeHostname}: ${error}`);
            return [];
        }
    }
    buildHostname(domain) {
        return `${_unsubscribehostnameprefixconstant.UNSUBSCRIBE_HOSTNAME_PREFIX}.${domain}`;
    }
    constructor(emailingDomainRepository, dnsManagerService){
        this.emailingDomainRepository = emailingDomainRepository;
        this.dnsManagerService = dnsManagerService;
        this.logger = new _common.Logger(UnsubscribeHostnameService.name);
    }
};
UnsubscribeHostnameService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_emailingdomainentity.EmailingDomainEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _dnsmanagerservice.DnsManagerService === "undefined" ? Object : _dnsmanagerservice.DnsManagerService
    ])
], UnsubscribeHostnameService);

//# sourceMappingURL=unsubscribe-hostname.service.js.map