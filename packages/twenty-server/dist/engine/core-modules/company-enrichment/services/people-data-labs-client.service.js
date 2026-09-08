"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PeopleDataLabsClientService", {
    enumerable: true,
    get: function() {
        return PeopleDataLabsClientService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _peopledatalabsbaseurlconstant = require("../constants/people-data-labs-base-url.constant");
const _peopledatalabscompanyminlikelihoodconstant = require("../constants/people-data-labs-company-min-likelihood.constant");
const _peopledatalabspersonminlikelihoodconstant = require("../constants/people-data-labs-person-min-likelihood.constant");
const _peopledatalabsrequesttimeoutmsconstant = require("../constants/people-data-labs-request-timeout-ms.constant");
const _istransientpeopledatalabsstatusutil = require("../utils/is-transient-people-data-labs-status.util");
const _parsepeopledatalabsresponseitemutil = require("../utils/parse-people-data-labs-response-item.util");
const _securehttpclientservice = require("../../secure-http-client/secure-http-client.service");
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
let PeopleDataLabsClientService = class PeopleDataLabsClientService {
    isEnabled() {
        return (0, _guards.isNonEmptyString)(this.getApiKey());
    }
    async enrichCompanyByDomain(domain) {
        return this.enrich({
            path: '/company/enrich',
            params: {
                website: domain,
                min_likelihood: _peopledatalabscompanyminlikelihoodconstant.PEOPLE_DATA_LABS_COMPANY_MIN_LIKELIHOOD
            },
            requestedMinLikelihood: _peopledatalabscompanyminlikelihoodconstant.PEOPLE_DATA_LABS_COMPANY_MIN_LIKELIHOOD
        });
    }
    async enrichPersonByEmail(email) {
        return this.enrich({
            path: '/person/enrich',
            params: {
                email,
                min_likelihood: _peopledatalabspersonminlikelihoodconstant.PEOPLE_DATA_LABS_PERSON_MIN_LIKELIHOOD
            },
            requestedMinLikelihood: _peopledatalabspersonminlikelihoodconstant.PEOPLE_DATA_LABS_PERSON_MIN_LIKELIHOOD
        });
    }
    async enrich({ path, params, requestedMinLikelihood }) {
        const apiKey = this.getApiKey();
        if (!(0, _guards.isNonEmptyString)(apiKey)) {
            return {
                outcome: 'skipped'
            };
        }
        try {
            const response = await this.httpClient.get(path, {
                params,
                headers: {
                    'X-Api-Key': apiKey
                }
            });
            const responseBody = (0, _utils.isPlainObject)(response.data) ? response.data : null;
            if (!(0, _utils.isDefined)(responseBody)) {
                if (response.status < 200 || response.status >= 300) {
                    return this.classifyError({
                        httpStatus: response.status,
                        message: `PDL request failed (HTTP ${response.status}).`
                    });
                }
                return {
                    outcome: 'transientError',
                    httpStatus: response.status,
                    message: 'People Data Labs returned a non-JSON response'
                };
            }
            // People Data Labs reports the outcome in the body, and can return a body
            // level 404 under an HTTP 200, so the body status wins when present.
            const parsed = (0, _parsepeopledatalabsresponseitemutil.parsePeopleDataLabsResponseItem)({
                item: {
                    ...responseBody,
                    status: (0, _guards.isNumber)(responseBody.status) ? responseBody.status : response.status
                },
                requestedMinLikelihood
            });
            if (parsed.outcome === 'notFound') {
                return {
                    outcome: 'notFound'
                };
            }
            if (parsed.outcome === 'error') {
                return this.classifyError({
                    httpStatus: parsed.httpStatus,
                    message: parsed.message
                });
            }
            return {
                outcome: 'matched',
                data: parsed.data
            };
        } catch (error) {
            return {
                outcome: 'transientError',
                httpStatus: 0,
                message: error instanceof Error ? error.message : String(error)
            };
        }
    }
    getApiKey() {
        return this.twentyConfigService.get('PEOPLE_DATA_LABS_API_KEY')?.trim();
    }
    classifyError({ httpStatus, message }) {
        return httpStatus === 0 || (0, _istransientpeopledatalabsstatusutil.isTransientPeopleDataLabsStatus)(httpStatus) ? {
            outcome: 'transientError',
            httpStatus,
            message
        } : {
            outcome: 'permanentError',
            httpStatus,
            message
        };
    }
    constructor(twentyConfigService, secureHttpClientService){
        this.twentyConfigService = twentyConfigService;
        this.httpClient = secureHttpClientService.getHttpClient({
            baseURL: _peopledatalabsbaseurlconstant.PEOPLE_DATA_LABS_BASE_URL,
            timeout: _peopledatalabsrequesttimeoutmsconstant.PEOPLE_DATA_LABS_REQUEST_TIMEOUT_MS,
            validateStatus: ()=>true
        });
    }
};
PeopleDataLabsClientService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _securehttpclientservice.SecureHttpClientService === "undefined" ? Object : _securehttpclientservice.SecureHttpClientService
    ])
], PeopleDataLabsClientService);

//# sourceMappingURL=people-data-labs-client.service.js.map