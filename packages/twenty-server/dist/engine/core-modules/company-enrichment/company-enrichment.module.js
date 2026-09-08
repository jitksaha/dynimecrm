"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CompanyEnrichmentModule", {
    enumerable: true,
    get: function() {
        return CompanyEnrichmentModule;
    }
});
const _common = require("@nestjs/common");
const _companyenrichmentresolver = require("./resolvers/company-enrichment.resolver");
const _companyenrichmentservice = require("./services/company-enrichment.service");
const _enrichmentthrottleservice = require("./services/enrichment-throttle.service");
const _peopledatalabsclientservice = require("./services/people-data-labs-client.service");
const _personenrichmentservice = require("./services/person-enrichment.service");
const _keyvaluepairmodule = require("../key-value-pair/key-value-pair.module");
const _onboardingmodule = require("../onboarding/onboarding.module");
const _securehttpclientmodule = require("../secure-http-client/secure-http-client.module");
const _throttlermodule = require("../throttler/throttler.module");
const _userworkspacemodule = require("../user-workspace/user-workspace.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CompanyEnrichmentModule = class CompanyEnrichmentModule {
};
CompanyEnrichmentModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _keyvaluepairmodule.KeyValuePairModule,
            _onboardingmodule.OnboardingModule,
            _securehttpclientmodule.SecureHttpClientModule,
            _throttlermodule.ThrottlerModule,
            _userworkspacemodule.UserWorkspaceModule
        ],
        providers: [
            _companyenrichmentresolver.CompanyEnrichmentResolver,
            _companyenrichmentservice.CompanyEnrichmentService,
            _enrichmentthrottleservice.EnrichmentThrottleService,
            _peopledatalabsclientservice.PeopleDataLabsClientService,
            _personenrichmentservice.PersonEnrichmentService
        ],
        exports: [
            _companyenrichmentservice.CompanyEnrichmentService,
            _personenrichmentservice.PersonEnrichmentService
        ]
    })
], CompanyEnrichmentModule);

//# sourceMappingURL=company-enrichment.module.js.map