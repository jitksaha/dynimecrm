"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DomainServerConfigService", {
    enumerable: true,
    get: function() {
        return DomainServerConfigService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _buildurlwithpathnameandsearchparamsutil = require("../utils/build-url-with-pathname-and-search-params.util");
const _publicfunctiondomainutil = require("../utils/public-function-domain.util");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DomainServerConfigService = class DomainServerConfigService {
    getFrontUrl() {
        return new URL(this.twentyConfigService.get('FRONTEND_URL') ?? this.twentyConfigService.get('SERVER_URL'));
    }
    getBaseUrl() {
        const baseUrl = this.getFrontUrl();
        if (this.twentyConfigService.get('IS_MULTIWORKSPACE_ENABLED') && this.twentyConfigService.get('DEFAULT_SUBDOMAIN')) {
            baseUrl.hostname = `${this.twentyConfigService.get('DEFAULT_SUBDOMAIN')}.${baseUrl.hostname}`;
        }
        return baseUrl;
    }
    getPublicDomainUrl() {
        return new URL(this.twentyConfigService.get('PUBLIC_DOMAIN_URL'));
    }
    getPublicBaseHostnameOrUndefined() {
        return (0, _publicfunctiondomainutil.getHostnameFromUrlOrUndefined)(this.twentyConfigService.get('PUBLIC_DOMAIN_URL'));
    }
    buildBaseUrl({ pathname, searchParams, hash }) {
        return (0, _buildurlwithpathnameandsearchparamsutil.buildUrlWithPathnameAndSearchParams)({
            baseUrl: this.getBaseUrl(),
            pathname,
            searchParams,
            hash
        });
    }
    isDefaultSubdomain(subdomain) {
        return subdomain === this.twentyConfigService.get('DEFAULT_SUBDOMAIN');
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
        this.getSubdomainAndDomainFromUrl = (url)=>{
            const { hostname: originHostname } = new URL(url);
            const frontDomain = this.getFrontUrl().hostname;
            const isFrontdomain = originHostname.endsWith(`.${frontDomain}`);
            if (isFrontdomain) {
                const subdomain = originHostname.replace(`.${frontDomain}`, '');
                return {
                    subdomain: this.isDefaultSubdomain(subdomain) ? undefined : subdomain,
                    domain: null,
                    isPublicDomainOrigin: false
                };
            }
            const publicBaseDomain = this.getPublicBaseHostnameOrUndefined();
            if ((0, _utils.isDefined)(publicBaseDomain) && (0, _publicfunctiondomainutil.isHostUnderPublicFunctionDomain)({
                host: originHostname,
                publicDomainBaseHostname: publicBaseDomain
            })) {
                const subdomain = originHostname.replace(`.${publicBaseDomain}`, '');
                return {
                    subdomain: this.isDefaultSubdomain(subdomain) ? undefined : subdomain,
                    domain: null,
                    isPublicDomainOrigin: true
                };
            }
            return {
                subdomain: undefined,
                domain: originHostname,
                isPublicDomainOrigin: false
            };
        };
    }
};
DomainServerConfigService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], DomainServerConfigService);

//# sourceMappingURL=domain-server-config.service.js.map