"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingDomainService", {
    enumerable: true,
    get: function() {
        return EmailingDomainService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _emailingdomaindriverexception = require("../drivers/exceptions/emailing-domain-driver.exception");
const _emailingdomaindriverfactory = require("../drivers/emailing-domain-driver.factory");
const _emailingdomainstatustype = require("../drivers/types/emailing-domain-status.type");
const _emailingdomainentity = require("../emailing-domain.entity");
const _emailingdomainexception = require("../exceptions/emailing-domain.exception");
const _unsubscribehostnameservice = require("./unsubscribe-hostname.service");
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
let EmailingDomainService = class EmailingDomainService {
    async createEmailingDomain(domain, workspaceId) {
        const existingEmailingDomain = await this.globalEmailingDomainRepository.findOne({
            where: {
                domain
            }
        });
        if ((0, _utils.isDefined)(existingEmailingDomain)) {
            throw new _emailingdomainexception.EmailingDomainException('Emailing domain is already registered', _emailingdomainexception.EmailingDomainExceptionCode.EMAILING_DOMAIN_ALREADY_REGISTERED);
        }
        const emailingDomainDriver = this.emailingDomainDriverFactory.getCurrentDriver();
        await emailingDomainDriver.provisionWorkspace(workspaceId);
        const verificationResult = await emailingDomainDriver.verifyDomain({
            domain,
            workspaceId
        });
        await emailingDomainDriver.registerDomain({
            domain,
            workspaceId
        });
        const isVerifiedOnCreation = verificationResult.status === _emailingdomainstatustype.EmailingDomainStatus.VERIFIED;
        const emailingDomain = await this.emailingDomainRepository.insertAndReturnOne(workspaceId, {
            domain,
            status: verificationResult.status,
            verificationRecords: verificationResult.verificationRecords,
            verifiedAt: isVerifiedOnCreation ? new Date() : null
        });
        await this.unsubscribeHostnameService.sync(workspaceId, emailingDomain.id, {
            provision: true
        });
        return this.unsubscribeHostnameService.withDnsRecords(await this.emailingDomainRepository.findOneOrFail(workspaceId, {
            where: {
                id: emailingDomain.id
            }
        }));
    }
    async ensureEmailingDomain(domain, workspaceId) {
        const existingEmailingDomain = await this.emailingDomainRepository.findOne(workspaceId, {
            where: {
                domain
            }
        });
        if ((0, _utils.isDefined)(existingEmailingDomain)) {
            return;
        }
        await this.createEmailingDomain(domain, workspaceId);
    }
    async deleteEmailingDomainByDomainIfExists(workspaceId, domain) {
        const emailingDomain = await this.emailingDomainRepository.findOne(workspaceId, {
            where: {
                domain
            }
        });
        if (!(0, _utils.isDefined)(emailingDomain)) {
            return;
        }
        await this.unsubscribeHostnameService.deprovision(emailingDomain);
        await this.deleteRemoteEmailingDomain(emailingDomain);
        await this.emailingDomainRepository.delete(workspaceId, {
            id: emailingDomain.id
        });
    }
    async deleteEmailingDomain(workspace, emailingDomainId) {
        const emailingDomain = await this.findEmailingDomainByIdOrThrow(workspace.id, emailingDomainId);
        await this.unsubscribeHostnameService.deprovision(emailingDomain);
        await this.deleteRemoteEmailingDomain(emailingDomain);
        await this.emailingDomainRepository.delete(workspace.id, {
            id: emailingDomain.id
        });
    }
    async cleanupEmailingDomainsForWorkspace(workspaceId, domains) {
        const emailingDomainDriver = this.emailingDomainDriverFactory.getCurrentDriver();
        if (domains.length === 0) {
            return;
        }
        const results = await Promise.allSettled(domains.map((domain)=>emailingDomainDriver.cleanupDomain({
                domain,
                workspaceId
            })));
        await emailingDomainDriver.deprovisionWorkspace(workspaceId);
        if (results.some((result)=>result.status === 'rejected')) {
            throw new Error(`Failed to clean up one or more emailing domains for workspace ${workspaceId}`);
        }
    }
    async getEmailingDomains(workspace) {
        const emailingDomains = await this.emailingDomainRepository.find(workspace.id, {
            order: {
                createdAt: 'DESC'
            }
        });
        return Promise.all(emailingDomains.map((emailingDomain)=>this.unsubscribeHostnameService.withDnsRecords(emailingDomain)));
    }
    async verifyEmailingDomain({ workspaceId, emailingDomainId }) {
        const emailingDomain = await this.findEmailingDomainByIdOrThrow(workspaceId, emailingDomainId);
        const emailingDomainDriver = this.emailingDomainDriverFactory.getCurrentDriver();
        const verificationResult = await emailingDomainDriver.verifyDomain({
            domain: emailingDomain.domain,
            workspaceId: emailingDomain.workspaceId
        });
        const hasJustBecomeVerified = emailingDomain.status !== _emailingdomainstatustype.EmailingDomainStatus.VERIFIED && verificationResult.status === _emailingdomainstatustype.EmailingDomainStatus.VERIFIED;
        await this.emailingDomainRepository.update(workspaceId, {
            id: emailingDomain.id
        }, {
            status: verificationResult.status,
            verificationRecords: verificationResult.verificationRecords,
            ...hasJustBecomeVerified ? {
                verifiedAt: new Date()
            } : {}
        });
        await this.unsubscribeHostnameService.sync(workspaceId, emailingDomain.id, {
            provision: true
        });
        return this.unsubscribeHostnameService.withDnsRecords(await this.emailingDomainRepository.findOneOrFail(workspaceId, {
            where: {
                id: emailingDomain.id
            }
        }));
    }
    async findEmailingDomainByIdOrThrow(workspaceId, emailingDomainId) {
        const emailingDomain = await this.emailingDomainRepository.findOne(workspaceId, {
            where: {
                id: emailingDomainId
            }
        });
        if (!emailingDomain) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException('Emailing domain not found', _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.NOT_FOUND);
        }
        return emailingDomain;
    }
    async deleteRemoteEmailingDomain(emailingDomain) {
        try {
            await this.emailingDomainDriverFactory.getCurrentDriver().cleanupDomain({
                domain: emailingDomain.domain,
                workspaceId: emailingDomain.workspaceId
            });
        } catch (error) {
            this.logger.warn(`Remote cleanup for emailing domain ${emailingDomain.domain} (workspace ${emailingDomain.workspaceId}) failed: ${error}`);
        }
    }
    constructor(emailingDomainRepository, // Domain is globally unique across workspaces, so existence checks need
    // an unscoped repository
    globalEmailingDomainRepository, emailingDomainDriverFactory, unsubscribeHostnameService){
        this.emailingDomainRepository = emailingDomainRepository;
        this.globalEmailingDomainRepository = globalEmailingDomainRepository;
        this.emailingDomainDriverFactory = emailingDomainDriverFactory;
        this.unsubscribeHostnameService = unsubscribeHostnameService;
        this.logger = new _common.Logger(EmailingDomainService.name);
    }
};
EmailingDomainService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_emailingdomainentity.EmailingDomainEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_emailingdomainentity.EmailingDomainEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _emailingdomaindriverfactory.EmailingDomainDriverFactory === "undefined" ? Object : _emailingdomaindriverfactory.EmailingDomainDriverFactory,
        typeof _unsubscribehostnameservice.UnsubscribeHostnameService === "undefined" ? Object : _unsubscribehostnameservice.UnsubscribeHostnameService
    ])
], EmailingDomainService);

//# sourceMappingURL=emailing-domain.service.js.map