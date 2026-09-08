"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResendApiClientService", {
    enumerable: true,
    get: function() {
        return ResendApiClientService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _emailingdomaindriverexception = require("../../exceptions/emailing-domain-driver.exception");
const _twentyconfigservice = require("../../../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const RESEND_API_BASE_URL = 'https://api.resend.com';
let ResendApiClientService = class ResendApiClientService {
    async sendEmail(payload) {
        return this.requestJson('POST', '/emails', payload);
    }
    async createDomain(payload) {
        return this.requestJson('POST', '/domains', payload);
    }
    async getDomain(domainId) {
        return this.requestJson('GET', `/domains/${domainId}`);
    }
    async listDomains() {
        return this.requestJson('GET', '/domains');
    }
    async verifyDomain(domainId) {
        await this.performRequest('POST', `/domains/${domainId}/verify`);
    }
    async deleteDomain(domainId) {
        await this.performRequest('DELETE', `/domains/${domainId}`);
    }
    async getReceivedEmail(emailId) {
        return this.requestJson('GET', `/emails/receiving/${emailId}`);
    }
    // raw download URLs are pre-signed by Resend and require no Authorization
    async downloadRawEmail(downloadUrl) {
        const response = await fetch(downloadUrl);
        if (!response.ok) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException(`Failed to download raw email content (status ${response.status})`, _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR);
        }
        return Buffer.from(await response.arrayBuffer());
    }
    getApiKeyOrThrow() {
        const apiKey = this.twentyConfigService.get('RESEND_API_KEY');
        if (!(0, _guards.isNonEmptyString)(apiKey)) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException('RESEND_API_KEY is not configured', _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR);
        }
        return apiKey;
    }
    async requestJson(method, path, body) {
        const responseText = await this.performRequest(method, path, body);
        const parsedResponse = (0, _utils.parseJson)(responseText);
        if (!(0, _utils.isDefined)(parsedResponse)) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException(`Resend API ${method} ${path} returned an unparsable response`, _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNKNOWN);
        }
        return parsedResponse;
    }
    async performRequest(method, path, body) {
        const response = await fetch(`${RESEND_API_BASE_URL}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${this.getApiKeyOrThrow()}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });
        const responseText = await response.text();
        if (!response.ok) {
            throw this.buildException(response.status, responseText, method, path);
        }
        return responseText;
    }
    buildException(status, responseText, method, path) {
        const errorBody = (0, _utils.parseJson)(responseText);
        const providerMessage = (0, _guards.isNonEmptyString)(errorBody?.message) ? `: ${errorBody.message}` : '';
        return new _emailingdomaindriverexception.EmailingDomainDriverException(`Resend API ${method} ${path} failed with status ${status}${providerMessage}`, this.mapStatusToExceptionCode(status));
    }
    mapStatusToExceptionCode(status) {
        if (status === 404) {
            return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.NOT_FOUND;
        }
        if (status === 401 || status === 403) {
            return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.INSUFFICIENT_PERMISSIONS;
        }
        if (status === 429 || status >= 500) {
            return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR;
        }
        if (status >= 400) {
            return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR;
        }
        return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNKNOWN;
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
    }
};
ResendApiClientService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], ResendApiClientService);

//# sourceMappingURL=resend-api-client.service.js.map