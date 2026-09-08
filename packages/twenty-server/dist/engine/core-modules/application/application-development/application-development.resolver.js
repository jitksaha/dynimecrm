"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationDevelopmentResolver", {
    enumerable: true,
    get: function() {
        return ApplicationDevelopmentResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _GraphQLUpload = /*#__PURE__*/ _interop_require_default(require("graphql-upload/GraphQLUpload.mjs"));
const _constants = require("twenty-shared/constants");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _applicationdevelopmentservice = require("./application-development.service");
const _applicationfileuploadservice = require("./application-file-upload.service");
const _applicationinput = require("./dtos/application.input");
const _completeapplicationfileuploadsresultdto = require("./dtos/complete-application-file-uploads-result.dto");
const _completeapplicationfileuploadsinput = require("./dtos/complete-application-file-uploads.input");
const _createapplicationfileuploadsresultdto = require("./dtos/create-application-file-uploads-result.dto");
const _createapplicationfileuploadsinput = require("./dtos/create-application-file-uploads.input");
const _createdevelopmentapplicationinput = require("./dtos/create-development-application.input");
const _developmentapplicationdto = require("./dtos/development-application.dto");
const _uploadapplicationfileinput = require("./dtos/upload-application-file.input");
const _workspacemigrationdto = require("./dtos/workspace-migration.dto");
const _applicationexceptionfilter = require("../application-exception-filter");
const _filedto = require("../../file/dtos/file.dto");
const _resolvervalidationpipe = require("../../graphql/pipes/resolver-validation.pipe");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _workspacemigrationgraphqlapiexceptioninterceptor = require("../../../workspace-manager/workspace-migration/interceptors/workspace-migration-graphql-api-exception.interceptor");
const _streamtobuffer = require("../../../../utils/stream-to-buffer");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ApplicationDevelopmentResolver = class ApplicationDevelopmentResolver {
    async createDevelopmentApplication({ universalIdentifier, name }, { id: workspaceId }) {
        return this.applicationDevelopmentService.createDevelopmentApplication({
            universalIdentifier,
            name,
            workspaceId
        });
    }
    async syncApplication({ manifest, dryRun }, { id: workspaceId }) {
        return this.applicationDevelopmentService.syncApplication({
            manifest,
            dryRun,
            workspaceId
        });
    }
    async uploadApplicationFile({ id: workspaceId }, { createReadStream }, { applicationUniversalIdentifier, fileFolder, filePath }) {
        return this.applicationDevelopmentService.uploadApplicationFile({
            workspaceId,
            applicationUniversalIdentifier,
            fileFolder,
            filePath,
            getFileBuffer: ()=>(0, _streamtobuffer.streamToBuffer)(createReadStream())
        });
    }
    async createApplicationFileUploads({ id: workspaceId }, { applicationUniversalIdentifier, files }) {
        return this.applicationFileUploadService.createApplicationFileUploads({
            workspaceId,
            applicationUniversalIdentifier,
            files
        });
    }
    async completeApplicationFileUploads({ id: workspaceId }, { applicationUniversalIdentifier, fileIds }) {
        return this.applicationFileUploadService.completeApplicationFileUploads({
            workspaceId,
            applicationUniversalIdentifier,
            fileIds
        });
    }
    constructor(applicationDevelopmentService, applicationFileUploadService){
        this.applicationDevelopmentService = applicationDevelopmentService;
        this.applicationFileUploadService = applicationFileUploadService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_developmentapplicationdto.DevelopmentApplicationDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createdevelopmentapplicationinput.CreateDevelopmentApplicationInput === "undefined" ? Object : _createdevelopmentapplicationinput.CreateDevelopmentApplicationInput,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationDevelopmentResolver.prototype, "createDevelopmentApplication", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_workspacemigrationdto.WorkspaceMigrationDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationinput.ApplicationInput === "undefined" ? Object : _applicationinput.ApplicationInput,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationDevelopmentResolver.prototype, "syncApplication", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_filedto.FileDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.UPLOAD_FILE)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)({
        name: 'file',
        type: ()=>_GraphQLUpload.default
    })),
    _ts_param(2, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        typeof FileUpload === "undefined" ? Object : FileUpload,
        typeof _uploadapplicationfileinput.UploadApplicationFileInput === "undefined" ? Object : _uploadapplicationfileinput.UploadApplicationFileInput
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationDevelopmentResolver.prototype, "uploadApplicationFile", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_createapplicationfileuploadsresultdto.CreateApplicationFileUploadsResultDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.UPLOAD_FILE)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        typeof _createapplicationfileuploadsinput.CreateApplicationFileUploadsInput === "undefined" ? Object : _createapplicationfileuploadsinput.CreateApplicationFileUploadsInput
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationDevelopmentResolver.prototype, "createApplicationFileUploads", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_completeapplicationfileuploadsresultdto.CompleteApplicationFileUploadsResultDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.UPLOAD_FILE)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        typeof _completeapplicationfileuploadsinput.CompleteApplicationFileUploadsInput === "undefined" ? Object : _completeapplicationfileuploadsinput.CompleteApplicationFileUploadsInput
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationDevelopmentResolver.prototype, "completeApplicationFileUploads", null);
ApplicationDevelopmentResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseInterceptors)(_workspacemigrationgraphqlapiexceptioninterceptor.WorkspaceMigrationGraphqlApiExceptionInterceptor),
    (0, _common.UseFilters)(_applicationexceptionfilter.ApplicationExceptionFilter),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationdevelopmentservice.ApplicationDevelopmentService === "undefined" ? Object : _applicationdevelopmentservice.ApplicationDevelopmentService,
        typeof _applicationfileuploadservice.ApplicationFileUploadService === "undefined" ? Object : _applicationfileuploadservice.ApplicationFileUploadService
    ])
], ApplicationDevelopmentResolver);

//# sourceMappingURL=application-development.resolver.js.map