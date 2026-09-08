/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceSSOModule", {
    enumerable: true,
    get: function() {
        return WorkspaceSSOModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _billingmodule = require("../billing/billing.module");
const _enterprisemodule = require("../enterprise/enterprise.module");
const _featureflagmodule = require("../feature-flag/feature-flag.module");
const _guardredirectmodule = require("../guard-redirect/guard-redirect.module");
const _ssoservice = require("./services/sso.service");
const _ssoresolver = require("./sso.resolver");
const _workspacessoidentityproviderentity = require("./workspace-sso-identity-provider.entity");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WorkspaceSSOModule = class WorkspaceSSOModule {
};
WorkspaceSSOModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _workspacessoidentityproviderentity.WorkspaceSSOIdentityProviderEntity
            ]),
            _billingmodule.BillingModule,
            _enterprisemodule.EnterpriseModule,
            _guardredirectmodule.GuardRedirectModule,
            _permissionsmodule.PermissionsModule,
            _featureflagmodule.FeatureFlagModule
        ],
        exports: [
            _ssoservice.SSOService
        ],
        providers: [
            _ssoservice.SSOService,
            _ssoresolver.SSOResolver
        ]
    })
], WorkspaceSSOModule);

//# sourceMappingURL=sso.module.js.map