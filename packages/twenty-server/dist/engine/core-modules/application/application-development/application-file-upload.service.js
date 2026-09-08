"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationFileUploadService", {
    enumerable: true,
    get: function() {
        return ApplicationFileUploadService;
    }
});
const _common = require("@nestjs/common");
const _bytes = /*#__PURE__*/ _interop_require_default(require("bytes"));
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _applicationdevelopmentconstants = require("./constants/application-development.constants");
const _applicationexception = require("../application.exception");
const _applicationservice = require("../application.service");
const _settings = require("../../../constants/settings");
const _validatefilepathutil = require("../../file-storage/utils/validate-file-path.util");
const _fileentity = require("../../file/entities/file.entity");
const _fileuploadtargetservice = require("../../file/file-upload/services/file-upload-target.service");
const _fileuploadcompletionservice = require("../../file/file-upload/services/file-upload-completion.service");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
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
const APPLICATION_FILE_SETTINGS = {
    isTemporaryFile: false,
    toDelete: false
};
let ApplicationFileUploadService = class ApplicationFileUploadService {
    async createApplicationFileUploads({ workspaceId, applicationUniversalIdentifier, files }) {
        const application = await this.findApplicationOrThrow({
            workspaceId,
            applicationUniversalIdentifier
        });
        const maxFileSize = (0, _bytes.default)(_settings.settings.storage.maxDirectUploadFileSize) ?? 0;
        const result = {
            targets: [],
            errors: []
        };
        const validFiles = [];
        for (const file of files){
            const validationError = this.getFileValidationError(file, maxFileSize);
            if ((0, _utils.isDefined)(validationError)) {
                result.errors.push({
                    fileFolder: file.fileFolder,
                    filePath: file.filePath,
                    message: validationError
                });
                continue;
            }
            validFiles.push(file);
        }
        const requests = validFiles.map((file)=>({
                workspaceId,
                applicationUniversalIdentifier,
                applicationId: application.id,
                fileFolder: file.fileFolder,
                resourcePath: file.filePath,
                size: file.size,
                settings: APPLICATION_FILE_SETTINGS
            }));
        const batchResults = await this.fileUploadTargetService.createUploadTargetsBatch(requests);
        batchResults.forEach((batchResult, index)=>{
            const file = validFiles[index];
            if (batchResult.success) {
                result.targets.push({
                    ...batchResult.value,
                    fileFolder: file.fileFolder,
                    filePath: file.filePath
                });
            } else {
                result.errors.push({
                    fileFolder: file.fileFolder,
                    filePath: file.filePath,
                    message: batchResult.error
                });
            }
        });
        return result;
    }
    async completeApplicationFileUploads({ workspaceId, applicationUniversalIdentifier, fileIds }) {
        const application = await this.findApplicationOrThrow({
            workspaceId,
            applicationUniversalIdentifier
        });
        const files = await this.fileRepository.find(workspaceId, {
            where: {
                id: (0, _typeorm.In)(fileIds),
                applicationId: application.id
            }
        });
        const result = {
            files: [],
            errors: []
        };
        const foundFileIds = new Set(files.map((file)=>file.id));
        for (const fileId of fileIds){
            if (!foundFileIds.has(fileId)) {
                result.errors.push({
                    fileId,
                    message: 'No pending upload found for this file.'
                });
            }
        }
        const batchResults = await this.fileUploadCompletionService.completeUploadsBatch(files.map((file)=>({
                workspaceId,
                applicationUniversalIdentifier,
                file
            })));
        batchResults.forEach((batchResult, index)=>{
            const file = files[index];
            if (batchResult.success) {
                result.files.push(batchResult.value);
            } else {
                result.errors.push({
                    fileId: file.id,
                    message: batchResult.error
                });
            }
        });
        return result;
    }
    getFileValidationError(file, maxFileSize) {
        if (!_applicationdevelopmentconstants.ALLOWED_APPLICATION_FILE_FOLDERS.includes(file.fileFolder)) {
            return `Invalid fileFolder for application file upload. Allowed values: ${_applicationdevelopmentconstants.ALLOWED_APPLICATION_FILE_FOLDERS.join(', ')}`;
        }
        const pathValidationResult = (0, _validatefilepathutil.validateFilePath)({
            resourcePath: file.filePath,
            fileFolder: file.fileFolder
        });
        if (!pathValidationResult.isValid) {
            return pathValidationResult.error;
        }
        if (file.size > maxFileSize) {
            return `File "${file.filePath}" is ${file.size} bytes, above the ${maxFileSize} bytes limit.`;
        }
        return undefined;
    }
    async findApplicationOrThrow({ workspaceId, applicationUniversalIdentifier }) {
        const application = await this.applicationService.findByUniversalIdentifier({
            universalIdentifier: applicationUniversalIdentifier,
            workspaceId
        });
        if (!(0, _utils.isDefined)(application)) {
            throw new _applicationexception.ApplicationException('Application not found in workspace.', _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND);
        }
        return application;
    }
    constructor(applicationService, fileUploadTargetService, fileUploadCompletionService, fileRepository){
        this.applicationService = applicationService;
        this.fileUploadTargetService = fileUploadTargetService;
        this.fileUploadCompletionService = fileUploadCompletionService;
        this.fileRepository = fileRepository;
    }
};
ApplicationFileUploadService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_fileentity.FileEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _fileuploadtargetservice.FileUploadTargetService === "undefined" ? Object : _fileuploadtargetservice.FileUploadTargetService,
        typeof _fileuploadcompletionservice.FileUploadCompletionService === "undefined" ? Object : _fileuploadcompletionservice.FileUploadCompletionService,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], ApplicationFileUploadService);

//# sourceMappingURL=application-file-upload.service.js.map