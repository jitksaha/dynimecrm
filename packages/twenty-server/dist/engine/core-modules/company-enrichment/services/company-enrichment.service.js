"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CompanyEnrichmentService", {
    enumerable: true,
    get: function() {
        return CompanyEnrichmentService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _companyenrichmentthrottlemaxrequestsconstant = require("../constants/company-enrichment-throttle-max-requests.constant");
const _companyenrichmentthrottlewindowmsconstant = require("../constants/company-enrichment-throttle-window-ms.constant");
const _enrichmentthrottleservice = require("./enrichment-throttle.service");
const _peopledatalabsclientservice = require("./people-data-labs-client.service");
const _companyenrichmentattemptkeyvaluetype = require("../types/company-enrichment-attempt-key-value.type");
const _toworkspacecompanyenrichmentutil = require("../utils/to-workspace-company-enrichment.util");
const _keyvaluepairentity = require("../../key-value-pair/key-value-pair.entity");
const _keyvaluepairservice = require("../../key-value-pair/key-value-pair.service");
const _readiscompanyenrichmentenabledutil = require("../utils/read-is-company-enrichment-enabled.util");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _userworkspaceservice = require("../../user-workspace/user-workspace.service");
const _getdomainfromemail = require("../../../../utils/get-domain-from-email");
const _isworkemail = require("../../../../utils/is-work-email");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CompanyEnrichmentService = class CompanyEnrichmentService {
    async enrichCompanyForWorkspaceCreator({ userId, email, workspaceId }) {
        if (!this.hasEnrichmentConsumer()) {
            return {
                outcome: 'unavailable',
                enrichment: null
            };
        }
        const isWorkspaceCreator = await this.userWorkspaceService.isWorkspaceCreator({
            userId,
            workspaceId
        });
        if (!isWorkspaceCreator) {
            return {
                outcome: 'unavailable',
                enrichment: null
            };
        }
        const domain = (0, _getdomainfromemail.getDomainFromEmail)(email)?.toLowerCase();
        if (!(0, _guards.isNonEmptyString)(domain) || !(0, _isworkemail.isWorkDomain)(domain)) {
            return {
                outcome: 'unavailable',
                enrichment: null
            };
        }
        // Checked before throttling so a disabled feature never burns a throttle token.
        if (!this.peopleDataLabsClientService.isEnabled()) {
            return {
                outcome: 'unavailable',
                enrichment: null
            };
        }
        const throttleOutcome = await this.enrichmentThrottleService.consumeToken({
            throttleKey: `company-enrichment:throttler:${workspaceId}`,
            maxRequests: _companyenrichmentthrottlemaxrequestsconstant.COMPANY_ENRICHMENT_THROTTLE_MAX_REQUESTS,
            windowMs: _companyenrichmentthrottlewindowmsconstant.COMPANY_ENRICHMENT_THROTTLE_WINDOW_MS
        });
        if (throttleOutcome === 'limitReached') {
            return {
                outcome: 'transientError',
                enrichment: null
            };
        }
        const result = await this.peopleDataLabsClientService.enrichCompanyByDomain(domain);
        const enrichmentResult = this.resolveEnrichmentResult({
            result,
            workspaceId,
            domain
        });
        // 'skipped' means the feature is disabled (no API key); don't persist the domain in that case.
        if (result.outcome !== 'skipped') {
            await this.recordEnrichmentAttempt({
                workspaceId,
                domain,
                result
            });
        }
        return enrichmentResult;
    }
    hasEnrichmentConsumer() {
        return (0, _readiscompanyenrichmentenabledutil.readIsCompanyEnrichmentEnabled)(this.twentyConfigService);
    }
    resolveEnrichmentResult({ result, workspaceId, domain }) {
        if (result.outcome === 'transientError') {
            this.logger.warn(`Company enrichment transiently failed for workspace ${workspaceId} (${domain}): ${result.message}`);
            return {
                outcome: 'transientError',
                enrichment: null
            };
        }
        if (result.outcome !== 'matched') {
            if (result.outcome === 'permanentError') {
                this.logger.warn(`Company enrichment permanently failed for workspace ${workspaceId} (${domain}): ${result.message} (HTTP ${result.httpStatus})`);
            }
            return {
                outcome: 'unavailable',
                enrichment: null
            };
        }
        const enrichment = (0, _toworkspacecompanyenrichmentutil.toWorkspaceCompanyEnrichment)({
            domain,
            data: result.data,
            enrichedAt: new Date()
        });
        if (!(0, _utils.isDefined)(enrichment)) {
            return {
                outcome: 'unavailable',
                enrichment: null
            };
        }
        return {
            outcome: 'matched',
            enrichment
        };
    }
    async recordEnrichmentAttempt({ workspaceId, domain, result }) {
        // Best-effort telemetry: never let a key-value write failure fail the enrichment.
        // The pre-collapse outcome is recorded so an operator can tell "no PDL match for this
        // domain" apart from "the PDL integration is broken" (both surface as 'unavailable').
        try {
            await this.keyValuePairService.set({
                userId: null,
                workspaceId,
                key: _companyenrichmentattemptkeyvaluetype.COMPANY_ENRICHMENT_ATTEMPT_KEY,
                value: {
                    domain,
                    outcome: result.outcome,
                    ...'httpStatus' in result ? {
                        httpStatus: result.httpStatus,
                        message: result.message
                    } : {},
                    attemptedAt: new Date().toISOString()
                },
                type: _keyvaluepairentity.KeyValuePairType.CONFIG_VARIABLE
            });
        } catch (error) {
            this.logger.warn(`Failed to record company enrichment attempt for workspace ${workspaceId} (${domain}): ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    constructor(userWorkspaceService, peopleDataLabsClientService, twentyConfigService, enrichmentThrottleService, keyValuePairService){
        this.userWorkspaceService = userWorkspaceService;
        this.peopleDataLabsClientService = peopleDataLabsClientService;
        this.twentyConfigService = twentyConfigService;
        this.enrichmentThrottleService = enrichmentThrottleService;
        this.keyValuePairService = keyValuePairService;
        this.logger = new _common.Logger(CompanyEnrichmentService.name);
    }
};
CompanyEnrichmentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userworkspaceservice.UserWorkspaceService === "undefined" ? Object : _userworkspaceservice.UserWorkspaceService,
        typeof _peopledatalabsclientservice.PeopleDataLabsClientService === "undefined" ? Object : _peopledatalabsclientservice.PeopleDataLabsClientService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _enrichmentthrottleservice.EnrichmentThrottleService === "undefined" ? Object : _enrichmentthrottleservice.EnrichmentThrottleService,
        typeof _keyvaluepairservice.KeyValuePairService === "undefined" ? Object : _keyvaluepairservice.KeyValuePairService
    ])
], CompanyEnrichmentService);

//# sourceMappingURL=company-enrichment.service.js.map