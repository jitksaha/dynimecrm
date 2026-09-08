"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationManifestModule", {
    enumerable: true,
    get: function() {
        return ApplicationManifestModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationmodule = require("../application.module");
const _applicationentity = require("../application.entity");
const _applicationmanifestapplyservice = require("./application-manifest-apply.service");
const _applicationmanifestmigrationservice = require("./application-manifest-migration.service");
const _applicationuninstallservice = require("./services/application-uninstall.service");
const _computeapplicationmanifestalluniversalflatentitymapsservice = require("./services/compute-application-manifest-all-universal-flat-entity-maps.service");
const _applicationsyncservice = require("./application-sync.service");
const _applicationregistrationmodule = require("../application-registration/application-registration.module");
const _applicationtranslationmodule = require("../application-translation/application-translation.module");
const _applicationvariablemodule = require("../application-variable/application-variable.module");
const _featureflagmodule = require("../../feature-flag/feature-flag.module");
const _filestoragemodule = require("../../file-storage/file-storage.module");
const _logicfunctionexecutormodule = require("../../logic-function/logic-function-executor/logic-function-executor.module");
const _secretencryptionmodule = require("../../secret-encryption/secret-encryption.module");
const _sdkclientmodule = require("../../sdk-client/sdk-client.module");
const _frontcomponententity = require("../../../metadata-modules/front-component/entities/front-component.entity");
const _permissionsmodule = require("../../../metadata-modules/permissions/permissions.module");
const _workspacecachemodule = require("../../../workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ApplicationManifestModule = class ApplicationManifestModule {
};
ApplicationManifestModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _applicationentity.ApplicationEntity,
                _frontcomponententity.FrontComponentEntity
            ]),
            _applicationmodule.ApplicationModule,
            _applicationregistrationmodule.ApplicationRegistrationModule,
            _applicationtranslationmodule.ApplicationTranslationModule,
            _applicationvariablemodule.ApplicationVariableEntityModule,
            _featureflagmodule.FeatureFlagModule,
            _filestoragemodule.FileStorageModule,
            _logicfunctionexecutormodule.LogicFunctionExecutorModule,
            _permissionsmodule.PermissionsModule,
            _secretencryptionmodule.SecretEncryptionModule,
            _sdkclientmodule.SdkClientModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _applicationmanifestapplyservice.ApplicationManifestApplyService,
            _applicationmanifestmigrationservice.ApplicationManifestMigrationService,
            _applicationsyncservice.ApplicationSyncService,
            _applicationuninstallservice.ApplicationUninstallService,
            _computeapplicationmanifestalluniversalflatentitymapsservice.ComputeApplicationManifestAllUniversalFlatEntityMapsService
        ],
        exports: [
            _applicationmanifestapplyservice.ApplicationManifestApplyService,
            _applicationmanifestmigrationservice.ApplicationManifestMigrationService,
            _applicationsyncservice.ApplicationSyncService,
            _applicationuninstallservice.ApplicationUninstallService
        ]
    })
], ApplicationManifestModule);

//# sourceMappingURL=application-manifest.module.js.map