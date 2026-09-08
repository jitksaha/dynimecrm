"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationDevelopmentModule", {
    enumerable: true,
    get: function() {
        return ApplicationDevelopmentModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationregistrationmodule = require("../application-registration/application-registration.module");
const _applicationmanifestmodule = require("../application-manifest/application-manifest.module");
const _applicationmodule = require("../application.module");
const _applicationpackagemodule = require("../application-package/application-package.module");
const _applicationdevelopmentresolver = require("./application-development.resolver");
const _applicationdevelopmentservice = require("./application-development.service");
const _applicationfileuploadservice = require("./application-file-upload.service");
const _cachelockmodule = require("../../cache-lock/cache-lock.module");
const _featureflagmodule = require("../../feature-flag/feature-flag.module");
const _filestoragemodule = require("../../file-storage/file-storage.module");
const _fileentity = require("../../file/entities/file.entity");
const _fileuploadmodule = require("../../file/file-upload/file-upload.module");
const _throttlermodule = require("../../throttler/throttler.module");
const _permissionsmodule = require("../../../metadata-modules/permissions/permissions.module");
const _provideworkspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
const _workspacemigrationgraphqlapiexceptioninterceptor = require("../../../workspace-manager/workspace-migration/interceptors/workspace-migration-graphql-api-exception.interceptor");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ApplicationDevelopmentModule = class ApplicationDevelopmentModule {
};
ApplicationDevelopmentModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _applicationmanifestmodule.ApplicationManifestModule,
            _applicationpackagemodule.ApplicationPackageModule,
            _applicationregistrationmodule.ApplicationRegistrationModule,
            _cachelockmodule.CacheLockModule,
            _featureflagmodule.FeatureFlagModule,
            _filestoragemodule.FileStorageModule,
            _fileuploadmodule.FileUploadModule,
            _permissionsmodule.PermissionsModule,
            _throttlermodule.ThrottlerModule,
            _typeorm.TypeOrmModule.forFeature([
                _fileentity.FileEntity
            ])
        ],
        providers: [
            _applicationdevelopmentresolver.ApplicationDevelopmentResolver,
            _applicationdevelopmentservice.ApplicationDevelopmentService,
            _applicationfileuploadservice.ApplicationFileUploadService,
            _workspacemigrationgraphqlapiexceptioninterceptor.WorkspaceMigrationGraphqlApiExceptionInterceptor,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_fileentity.FileEntity)
        ]
    })
], ApplicationDevelopmentModule);

//# sourceMappingURL=application-development.module.js.map