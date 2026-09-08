"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileUploadModule", {
    enumerable: true,
    get: function() {
        return FileUploadModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationentity = require("../../application/application.entity");
const _applicationmodule = require("../../application/application.module");
const _filestoragemodule = require("../../file-storage/file-storage.module");
const _fileentity = require("../entities/file.entity");
const _fileuploadcontroller = require("./controllers/file-upload.controller");
const _pendingfilecleanupcroncommand = require("./crons/commands/pending-file-cleanup.cron.command");
const _pendingfilecleanupcronjob = require("./crons/jobs/pending-file-cleanup.cron.job");
const _fileuploadtokenguard = require("./guards/file-upload-token.guard");
const _fileuploadresolver = require("./resolvers/file-upload.resolver");
const _fileuploadcompletionservice = require("./services/file-upload-completion.service");
const _fileuploadservice = require("./services/file-upload.service");
const _fileuploadtargetservice = require("./services/file-upload-target.service");
const _pendingfilecleanupservice = require("./services/pending-file-cleanup.service");
const _fileurlmodule = require("../file-url/file-url.module");
const _jwtmodule = require("../../jwt/jwt.module");
const _fieldmetadataentity = require("../../../metadata-modules/field-metadata/field-metadata.entity");
const _permissionsmodule = require("../../../metadata-modules/permissions/permissions.module");
const _provideworkspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FileUploadModule = class FileUploadModule {
};
FileUploadModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _jwtmodule.JwtModule,
            _typeorm.TypeOrmModule.forFeature([
                _fileentity.FileEntity,
                _applicationentity.ApplicationEntity,
                _fieldmetadataentity.FieldMetadataEntity
            ]),
            _permissionsmodule.PermissionsModule,
            _filestoragemodule.FileStorageModule,
            _fileurlmodule.FileUrlModule,
            _applicationmodule.ApplicationModule
        ],
        providers: [
            _fileuploadservice.FileUploadService,
            _fileuploadtargetservice.FileUploadTargetService,
            _fileuploadcompletionservice.FileUploadCompletionService,
            _fileuploadresolver.FileUploadResolver,
            _fileuploadtokenguard.FileUploadTokenGuard,
            _pendingfilecleanupservice.PendingFileCleanupService,
            _pendingfilecleanupcronjob.PendingFileCleanupCronJob,
            _pendingfilecleanupcroncommand.PendingFileCleanupCronCommand,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_fileentity.FileEntity)
        ],
        exports: [
            _fileuploadservice.FileUploadService,
            _fileuploadtargetservice.FileUploadTargetService,
            _fileuploadcompletionservice.FileUploadCompletionService,
            _pendingfilecleanupcroncommand.PendingFileCleanupCronCommand
        ],
        controllers: [
            _fileuploadcontroller.FileUploadController
        ]
    })
], FileUploadModule);

//# sourceMappingURL=file-upload.module.js.map