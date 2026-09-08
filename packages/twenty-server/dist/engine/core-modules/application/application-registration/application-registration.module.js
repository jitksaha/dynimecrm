"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRegistrationModule", {
    enumerable: true,
    get: function() {
        return ApplicationRegistrationModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _coreentitycachemodule = require("../../../core-entity-cache/core-entity-cache.module");
const _applicationregistrationasseturlservice = require("./application-registration-asset-url.service");
const _applicationregistrationassetservice = require("./application-registration-asset.service");
const _applicationregistrationclaimcontroller = require("./application-registration-claim.controller");
const _applicationregistrationclaimservice = require("./application-registration-claim.service");
const _applicationregistrationentity = require("./application-registration.entity");
const _applicationregistrationresolver = require("./application-registration.resolver");
const _applicationregistrationservice = require("./application-registration.service");
const _applicationregistrationsummaryresolver = require("./application-registration-summary.resolver");
const _applicationregistrationvariablemodule = require("../application-registration-variable/application-registration-variable.module");
const _applicationtarballservice = require("./application-tarball.service");
const _applicationpackagemodule = require("../application-package/application-package.module");
const _applicationentity = require("../application.entity");
const _applicationmodule = require("../application.module");
const _cachelockmodule = require("../../cache-lock/cache-lock.module");
const _domainserverconfigmodule = require("../../domain/domain-server-config/domain-server-config.module");
const _workspacedomainsmodule = require("../../domain/workspace-domains/workspace-domains.module");
const _featureflagmodule = require("../../feature-flag/feature-flag.module");
const _filestoragemodule = require("../../file-storage/file-storage.module");
const _fileurlmodule = require("../../file/file-url/file-url.module");
const _guardredirectmodule = require("../../guard-redirect/guard-redirect.module");
const _jwtmodule = require("../../jwt/jwt.module");
const _metricsmodule = require("../../metrics/metrics.module");
const _workspaceentity = require("../../workspace/workspace.entity");
const _permissionsmodule = require("../../../metadata-modules/permissions/permissions.module");
const _workspacecachestoragemodule = require("../../../workspace-cache-storage/workspace-cache-storage.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ApplicationRegistrationModule = class ApplicationRegistrationModule {
};
ApplicationRegistrationModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _applicationregistrationentity.ApplicationRegistrationEntity,
                _applicationentity.ApplicationEntity,
                _workspaceentity.WorkspaceEntity
            ]),
            _applicationregistrationvariablemodule.ApplicationRegistrationVariableModule,
            _applicationmodule.ApplicationModule,
            _applicationpackagemodule.ApplicationPackageModule,
            _cachelockmodule.CacheLockModule,
            _coreentitycachemodule.CoreEntityCacheModule,
            _domainserverconfigmodule.DomainServerConfigModule,
            _workspacedomainsmodule.WorkspaceDomainsModule,
            _featureflagmodule.FeatureFlagModule,
            _guardredirectmodule.GuardRedirectModule,
            _jwtmodule.JwtModule,
            _permissionsmodule.PermissionsModule,
            _filestoragemodule.FileStorageModule,
            _fileurlmodule.FileUrlModule,
            _metricsmodule.MetricsModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule
        ],
        controllers: [
            _applicationregistrationclaimcontroller.ApplicationRegistrationClaimController
        ],
        providers: [
            _applicationregistrationservice.ApplicationRegistrationService,
            _applicationregistrationclaimservice.ApplicationRegistrationClaimService,
            _applicationregistrationresolver.ApplicationRegistrationResolver,
            _applicationregistrationsummaryresolver.ApplicationRegistrationSummaryResolver,
            _applicationtarballservice.ApplicationTarballService,
            _applicationregistrationassetservice.ApplicationRegistrationAssetService,
            _applicationregistrationasseturlservice.ApplicationRegistrationAssetUrlService
        ],
        exports: [
            _applicationregistrationservice.ApplicationRegistrationService,
            _applicationregistrationclaimservice.ApplicationRegistrationClaimService,
            _applicationregistrationvariablemodule.ApplicationRegistrationVariableModule,
            _applicationregistrationassetservice.ApplicationRegistrationAssetService,
            _applicationregistrationasseturlservice.ApplicationRegistrationAssetUrlService
        ]
    })
], ApplicationRegistrationModule);

//# sourceMappingURL=application-registration.module.js.map