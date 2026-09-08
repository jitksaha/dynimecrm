"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileUploadResolver", {
    enumerable: true,
    get: function() {
        return FileUploadResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _metadataresolverdecorator = require("../../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _filewithsignurldto = require("../../dtos/file-with-sign-url.dto");
const _fileuploadtargetdto = require("../dtos/file-upload-target.dto");
const _fileuploadservice = require("../services/file-upload.service");
const _preventnesttoautologgraphqlerrorsfilter = require("../../../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../../../graphql/pipes/resolver-validation.pipe");
const _workspaceentity = require("../../../workspace/workspace.entity");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
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
let FileUploadResolver = class FileUploadResolver {
    async createFileUpload({ id: workspaceId }, filename, size, fileFolder, fieldMetadataId, fieldMetadataUniversalIdentifier) {
        return await this.fileUploadService.createFileUpload({
            workspaceId,
            filename,
            size,
            fileFolder,
            fieldMetadataId,
            fieldMetadataUniversalIdentifier
        });
    }
    async completeFileUpload({ id: workspaceId }, fileId) {
        return await this.fileUploadService.completeFileUpload({
            workspaceId,
            fileId
        });
    }
    constructor(fileUploadService){
        this.fileUploadService = fileUploadService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_fileuploadtargetdto.FileUploadTargetDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.UPLOAD_FILE)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)({
        name: 'filename',
        type: ()=>String
    })),
    _ts_param(2, (0, _graphql.Args)({
        name: 'size',
        type: ()=>Number
    })),
    _ts_param(3, (0, _graphql.Args)({
        name: 'fileFolder',
        type: ()=>_types.FileFolder
    })),
    _ts_param(4, (0, _graphql.Args)({
        name: 'fieldMetadataId',
        type: ()=>String,
        nullable: true
    })),
    _ts_param(5, (0, _graphql.Args)({
        name: 'fieldMetadataUniversalIdentifier',
        type: ()=>String,
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String,
        Number,
        typeof _types.FileFolder === "undefined" ? Object : _types.FileFolder,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FileUploadResolver.prototype, "createFileUpload", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_filewithsignurldto.FileWithSignedUrlDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.UPLOAD_FILE)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)({
        name: 'fileId',
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FileUploadResolver.prototype, "completeFileUpload", null);
FileUploadResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fileuploadservice.FileUploadService === "undefined" ? Object : _fileuploadservice.FileUploadService
    ])
], FileUploadResolver);

//# sourceMappingURL=file-upload.resolver.js.map