"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResendDriver", {
    enumerable: true,
    get: function() {
        return ResendDriver;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _emailingdomaindriverexception = require("../../exceptions/emailing-domain-driver.exception");
const _mapresenddomainrecordsutil = require("../utils/map-resend-domain-records.util");
const _mapresendsendingstatusutil = require("../utils/map-resend-sending-status.util");
const _resendworkspacetagnameconstant = require("../constants/resend-workspace-tag-name.constant");
const _emailingdomainstatustype = require("../../types/emailing-domain-status.type");
const _getunsubscribebaseurlutil = require("../../utils/get-unsubscribe-base-url.util");
let ResendDriver = class ResendDriver {
    // Resend has no per-workspace resources: domains are account-level and
    // workspace attribution travels on each send as a tag.
    async provisionWorkspace(workspaceId) {
        this.logger.log(`No Resend resources to provision for workspace ${workspaceId}`);
    }
    async deprovisionWorkspace(workspaceId) {
        this.logger.log(`No Resend resources to deprovision for workspace ${workspaceId}`);
    }
    async registerDomain(_input) {
    // the return-path subdomain is configured by Resend at domain creation
    }
    async verifyDomain(input) {
        const domain = await this.findOrCreateDomain(input.domain);
        const currentDomain = await this.resendApiClientService.getDomain(domain.id);
        if ((0, _mapresendsendingstatusutil.mapResendSendingStatus)(currentDomain) === _emailingdomainstatustype.EmailingDomainStatus.VERIFIED) {
            return this.toVerificationResult(currentDomain);
        }
        await this.resendApiClientService.verifyDomain(domain.id);
        const refreshedDomain = await this.resendApiClientService.getDomain(domain.id);
        return this.toVerificationResult(refreshedDomain);
    }
    async getDomainStatus(input) {
        const domain = await this.findDomainByName(input.domain);
        if (!(0, _utils.isDefined)(domain)) {
            return {
                status: _emailingdomainstatustype.EmailingDomainStatus.FAILED,
                verificationRecords: []
            };
        }
        const detailedDomain = await this.resendApiClientService.getDomain(domain.id);
        return this.toVerificationResult(detailedDomain);
    }
    async cleanupDomain(input) {
        const domain = await this.findDomainByName(input.domain);
        if (!(0, _utils.isDefined)(domain)) {
            return;
        }
        await this.resendApiClientService.deleteDomain(domain.id).catch((error)=>{
            if (error instanceof _emailingdomaindriverexception.EmailingDomainDriverException && error.code === _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.NOT_FOUND) {
                return;
            }
            throw error;
        });
    }
    async sendEmail(input) {
        if (!(0, _utils.isNonEmptyArray)(input.to)) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException('sendEmail requires at least one recipient', _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR);
        }
        const unsubscribeBaseUrl = (0, _getunsubscribebaseurlutil.getUnsubscribeBaseUrl)(input.emailingDomain);
        const emailToSend = this.unsubscribeContentService.addTo(input, unsubscribeBaseUrl);
        const payload = {
            from: emailToSend.from,
            to: emailToSend.to,
            cc: emailToSend.cc,
            bcc: emailToSend.bcc,
            reply_to: emailToSend.replyTo,
            subject: emailToSend.subject,
            text: emailToSend.text,
            html: emailToSend.html,
            headers: (0, _utils.isNonEmptyArray)(emailToSend.headers) ? Object.fromEntries(emailToSend.headers.map((header)=>[
                    header.name,
                    header.value
                ])) : undefined,
            tags: [
                {
                    name: _resendworkspacetagnameconstant.RESEND_WORKSPACE_TAG_NAME,
                    value: input.workspaceId
                }
            ],
            attachments: (0, _utils.isNonEmptyArray)(emailToSend.attachments) ? emailToSend.attachments.map((attachment)=>({
                    filename: attachment.filename,
                    content: attachment.content.toString('base64'),
                    content_type: attachment.contentType
                })) : undefined
        };
        const { id } = await this.resendApiClientService.sendEmail(payload);
        this.logger.log(`Sent email ${id} from ${emailToSend.from} via Resend`);
        return {
            messageId: id,
            deliveredRecipients: {
                to: emailToSend.to,
                cc: emailToSend.cc ?? [],
                bcc: emailToSend.bcc ?? []
            }
        };
    }
    async findOrCreateDomain(domainName) {
        const existingDomain = await this.findDomainByName(domainName);
        if ((0, _utils.isDefined)(existingDomain)) {
            return existingDomain;
        }
        return this.resendApiClientService.createDomain({
            name: domainName,
            ...(0, _guards.isNonEmptyString)(this.config.domainRegion) ? {
                region: this.config.domainRegion
            } : {}
        });
    }
    async findDomainByName(domainName) {
        const { data } = await this.resendApiClientService.listDomains();
        return data.find((domain)=>domain.name.toLowerCase() === domainName.toLowerCase()) ?? null;
    }
    toVerificationResult(domain) {
        return {
            status: (0, _mapresendsendingstatusutil.mapResendSendingStatus)(domain),
            verificationRecords: (0, _mapresenddomainrecordsutil.mapResendDomainRecords)(domain.records)
        };
    }
    constructor(config, resendApiClientService, unsubscribeContentService){
        this.config = config;
        this.resendApiClientService = resendApiClientService;
        this.unsubscribeContentService = unsubscribeContentService;
        this.logger = new _common.Logger(ResendDriver.name);
    }
};

//# sourceMappingURL=resend-driver.service.js.map