"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PersonEnrichmentService", {
    enumerable: true,
    get: function() {
        return PersonEnrichmentService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _personenrichmentthrottlemaxrequestsconstant = require("../constants/person-enrichment-throttle-max-requests.constant");
const _personenrichmentthrottlewindowmsconstant = require("../constants/person-enrichment-throttle-window-ms.constant");
const _enrichmentthrottleservice = require("./enrichment-throttle.service");
const _peopledatalabsclientservice = require("./people-data-labs-client.service");
const _personenrichmentattemptkeyvaluetype = require("../types/person-enrichment-attempt-key-value.type");
const _readispersonenrichmentenabledutil = require("../utils/read-is-person-enrichment-enabled.util");
const _toworkspacepersonenrichmentutil = require("../utils/to-workspace-person-enrichment.util");
const _keyvaluepairentity = require("../../key-value-pair/key-value-pair.entity");
const _keyvaluepairservice = require("../../key-value-pair/key-value-pair.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _userworkspaceservice = require("../../user-workspace/user-workspace.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PersonEnrichmentService = class PersonEnrichmentService {
    async enrichPersonForWorkspaceCreator({ userId, email, workspaceId }) {
        try {
            return await this.enrichPersonForWorkspaceCreatorOrThrow({
                userId,
                email,
                workspaceId
            });
        } catch (error) {
            this.logger.warn(`Person enrichment unexpectedly failed for workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
            return {
                outcome: 'transientError',
                enrichment: null
            };
        }
    }
    async enrichPersonForWorkspaceCreatorOrThrow({ userId, email, workspaceId }) {
        if (!(0, _readispersonenrichmentenabledutil.readIsPersonEnrichmentEnabled)(this.twentyConfigService)) {
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
        const normalizedEmail = email.trim().toLowerCase();
        if (!(0, _guards.isNonEmptyString)(normalizedEmail)) {
            return {
                outcome: 'unavailable',
                enrichment: null
            };
        }
        if (!this.peopleDataLabsClientService.isEnabled()) {
            return {
                outcome: 'unavailable',
                enrichment: null
            };
        }
        const throttleOutcome = await this.enrichmentThrottleService.consumeToken({
            throttleKey: `person-enrichment:throttler:${workspaceId}`,
            maxRequests: _personenrichmentthrottlemaxrequestsconstant.PERSON_ENRICHMENT_THROTTLE_MAX_REQUESTS,
            windowMs: _personenrichmentthrottlewindowmsconstant.PERSON_ENRICHMENT_THROTTLE_WINDOW_MS
        });
        if (throttleOutcome === 'limitReached') {
            return {
                outcome: 'transientError',
                enrichment: null
            };
        }
        const result = await this.peopleDataLabsClientService.enrichPersonByEmail(normalizedEmail);
        const enrichmentResult = this.resolveEnrichmentResult({
            result,
            workspaceId,
            email: normalizedEmail
        });
        if (result.outcome !== 'skipped') {
            await this.recordEnrichmentAttempt({
                workspaceId,
                email: normalizedEmail,
                result
            });
        }
        return enrichmentResult;
    }
    resolveEnrichmentResult({ result, workspaceId, email }) {
        if (result.outcome === 'transientError') {
            this.logger.warn(`Person enrichment transiently failed for workspace ${workspaceId}: ${result.message}`);
            return {
                outcome: 'transientError',
                enrichment: null
            };
        }
        if (result.outcome !== 'matched') {
            if (result.outcome === 'permanentError') {
                this.logger.warn(`Person enrichment permanently failed for workspace ${workspaceId}: ${result.message} (HTTP ${result.httpStatus})`);
            }
            return {
                outcome: 'unavailable',
                enrichment: null
            };
        }
        const enrichment = (0, _toworkspacepersonenrichmentutil.toWorkspacePersonEnrichment)({
            email,
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
    async recordEnrichmentAttempt({ workspaceId, email, result }) {
        try {
            await this.keyValuePairService.set({
                userId: null,
                workspaceId,
                key: _personenrichmentattemptkeyvaluetype.PERSON_ENRICHMENT_ATTEMPT_KEY,
                value: {
                    email,
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
            this.logger.warn(`Failed to record person enrichment attempt for workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    constructor(userWorkspaceService, peopleDataLabsClientService, twentyConfigService, enrichmentThrottleService, keyValuePairService){
        this.userWorkspaceService = userWorkspaceService;
        this.peopleDataLabsClientService = peopleDataLabsClientService;
        this.twentyConfigService = twentyConfigService;
        this.enrichmentThrottleService = enrichmentThrottleService;
        this.keyValuePairService = keyValuePairService;
        this.logger = new _common.Logger(PersonEnrichmentService.name);
    }
};
PersonEnrichmentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userworkspaceservice.UserWorkspaceService === "undefined" ? Object : _userworkspaceservice.UserWorkspaceService,
        typeof _peopledatalabsclientservice.PeopleDataLabsClientService === "undefined" ? Object : _peopledatalabsclientservice.PeopleDataLabsClientService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _enrichmentthrottleservice.EnrichmentThrottleService === "undefined" ? Object : _enrichmentthrottleservice.EnrichmentThrottleService,
        typeof _keyvaluepairservice.KeyValuePairService === "undefined" ? Object : _keyvaluepairservice.KeyValuePairService
    ])
], PersonEnrichmentService);

//# sourceMappingURL=person-enrichment.service.js.map