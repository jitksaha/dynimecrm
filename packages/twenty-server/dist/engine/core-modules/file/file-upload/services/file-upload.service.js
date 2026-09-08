"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DIRECT_UPLOAD_FILE_FOLDERS () {
        return DIRECT_UPLOAD_FILE_FOLDERS;
    },
    get FileUploadService () {
        return FileUploadService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _stream = require("stream");
const _promises = require("node:stream/promises");
const _guards = require("@sniptt/guards");
const _bytes = /*#__PURE__*/ _interop_require_default(require("bytes"));
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _settings = require("../../../../constants/settings");
const _applicationentity = require("../../../application/application.entity");
const _applicationservice = require("../../../application/application.service");
const _filestorageservice = require("../../../file-storage/services/file-storage.service");
const _fileentity = require("../../entities/file.entity");
const _fileuploadexception = require("../file-upload.exception");
const _fileuploadcompletionservice = require("./file-upload-completion.service");
const _fileuploadtargetservice = require("./file-upload-target.service");
const _fileurlservice = require("../../file-url/file-url.service");
const _filestatustypes = require("../../types/file-status.types");
const _buildfileinfoutils = require("../../utils/build-file-info.utils");
const _removefilefolderfromfileentitypathutils = require("../../utils/remove-file-folder-from-file-entity-path.utils");
const _fieldmetadataentity = require("../../../../metadata-modules/field-metadata/field-metadata.entity");
const _injectworkspacescopedrepositorydecorator = require("../../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
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
const DIRECT_UPLOAD_FILE_FOLDERS = [
    _types.FileFolder.FilesField,
    _types.FileFolder.Workflow,
    _types.FileFolder.EmailAttachment,
    _types.FileFolder.AgentChat,
    _types.FileFolder.EmailImage
];
let FileUploadService = class FileUploadService {
    async createFileUpload({ workspaceId, filename, size, fileFolder, fieldMetadataId, fieldMetadataUniversalIdentifier }) {
        if (!DIRECT_UPLOAD_FILE_FOLDERS.includes(fileFolder)) {
            throw new _fileuploadexception.FileUploadException(`Direct upload is not supported for file folder ${fileFolder}`, _fileuploadexception.FileUploadExceptionCode.BAD_REQUEST, {
                userFriendlyMessage: /*i18n*/ {
                    id: "m2jBI/",
                    message: "Direct upload is not supported for this file type."
                }
            });
        }
        const maxFileSize = (0, _bytes.default)(_settings.settings.storage.maxDirectUploadFileSize) ?? 0;
        if (!Number.isInteger(size) || size <= 0 || size > maxFileSize) {
            throw new _fileuploadexception.FileUploadException(`Invalid file size ${size} (max ${maxFileSize} bytes)`, _fileuploadexception.FileUploadExceptionCode.FILE_TOO_LARGE, {
                userFriendlyMessage: /*i18n*/ {
                    id: "9fr/BM",
                    message: "The file is empty or exceeds the maximum allowed size."
                }
            });
        }
        const { ext } = (0, _buildfileinfoutils.buildFileInfo)(filename);
        const mimeType = 'application/octet-stream';
        const fileId = (0, _uuid.v4)();
        const name = `${fileId}${(0, _guards.isNonEmptyString)(ext) ? `.${ext}` : ''}`;
        const { applicationUniversalIdentifier, resourcePath } = await this.resolveUploadLocation({
            workspaceId,
            fileFolder,
            name,
            fieldMetadataId,
            fieldMetadataUniversalIdentifier
        });
        await this.fileStorageService.createPendingFile({
            fileFolder,
            applicationUniversalIdentifier,
            workspaceId,
            resourcePath,
            fileId,
            size,
            mimeType,
            settings: {
                isTemporaryFile: true,
                toDelete: false
            }
        });
        return this.fileUploadTargetService.buildUploadTarget({
            workspaceId,
            fileId,
            fileFolder,
            applicationUniversalIdentifier,
            resourcePath,
            contentType: mimeType,
            size
        });
    }
    async receiveFileStream({ workspaceId, fileId, stream }) {
        const file = await this.findFileOrThrow({
            workspaceId,
            fileId
        });
        if (file.status !== _filestatustypes.FILE_STATUS.PENDING) {
            throw new _fileuploadexception.FileUploadException(`File ${fileId} is not awaiting an upload`, _fileuploadexception.FileUploadExceptionCode.BAD_REQUEST, {
                userFriendlyMessage: /*i18n*/ {
                    id: "HUJCXI",
                    message: "This file has already been uploaded."
                }
            });
        }
        const { application, fileFolder, resourcePath } = await this.resolveFileLocation({
            workspaceId,
            file
        });
        const declaredSize = Number(file.size);
        let receivedBytes = 0;
        const sizeLimiter = new _stream.Transform({
            transform: (chunk, _encoding, callback)=>{
                receivedBytes += chunk.length;
                if (receivedBytes > declaredSize) {
                    callback(new _fileuploadexception.FileUploadException(`Upload exceeds declared size of ${declaredSize} bytes`, _fileuploadexception.FileUploadExceptionCode.FILE_TOO_LARGE, {
                        userFriendlyMessage: /*i18n*/ {
                            id: "48fVkh",
                            message: "The uploaded file is larger than declared."
                        }
                    }));
                    return;
                }
                callback(null, chunk);
            }
        });
        try {
            await Promise.all([
                (0, _promises.pipeline)(stream, sizeLimiter),
                this.fileStorageService.writeFileStream({
                    fileFolder,
                    applicationUniversalIdentifier: application.universalIdentifier,
                    workspaceId,
                    resourcePath,
                    stream: sizeLimiter,
                    mimeType: file.mimeType
                })
            ]);
        } catch (error) {
            if (receivedBytes > declaredSize) {
                throw new _fileuploadexception.FileUploadException(`Upload exceeds declared size of ${declaredSize} bytes`, _fileuploadexception.FileUploadExceptionCode.FILE_TOO_LARGE, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "48fVkh",
                        message: "The uploaded file is larger than declared."
                    }
                });
            }
            throw error;
        }
        if (receivedBytes !== declaredSize) {
            throw new _fileuploadexception.FileUploadException(`Uploaded ${receivedBytes} bytes but ${declaredSize} were declared`, _fileuploadexception.FileUploadExceptionCode.FILE_SIZE_MISMATCH, {
                userFriendlyMessage: /*i18n*/ {
                    id: "uYP2Uw",
                    message: "The uploaded file does not match the declared size. Please retry the upload."
                }
            });
        }
    }
    async completeFileUpload({ workspaceId, fileId }) {
        const file = await this.findFileOrThrow({
            workspaceId,
            fileId
        });
        const [fileFolder] = file.path.split('/');
        if (!DIRECT_UPLOAD_FILE_FOLDERS.includes(fileFolder)) {
            throw new _fileuploadexception.FileUploadException(`File not found: ${fileId}`, _fileuploadexception.FileUploadExceptionCode.FILE_NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "weWV3g",
                    message: "File not found."
                }
            });
        }
        if (file.status === _filestatustypes.FILE_STATUS.UPLOADED) {
            if (!file.settings?.isTemporaryFile) {
                throw new _fileuploadexception.FileUploadException(`File ${fileId} is not awaiting an upload confirmation`, _fileuploadexception.FileUploadExceptionCode.BAD_REQUEST, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "6ekAtL",
                        message: "This file upload has already been finalized."
                    }
                });
            }
            return this.toFileWithSignedUrl({
                file,
                fileFolder: fileFolder,
                workspaceId
            });
        }
        const { application, resourcePath } = await this.resolveFileLocation({
            workspaceId,
            file
        });
        const completedFile = await this.fileUploadCompletionService.completeUploadedFile({
            workspaceId,
            file,
            storageLocation: {
                fileFolder: fileFolder,
                applicationUniversalIdentifier: application.universalIdentifier,
                workspaceId,
                resourcePath
            }
        });
        return this.toFileWithSignedUrl({
            file: {
                ...file,
                ...completedFile,
                status: _filestatustypes.FILE_STATUS.UPLOADED
            },
            fileFolder: fileFolder,
            workspaceId
        });
    }
    async resolveUploadLocation({ workspaceId, fileFolder, name, fieldMetadataId, fieldMetadataUniversalIdentifier }) {
        if (fileFolder === _types.FileFolder.FilesField) {
            if (!fieldMetadataId && !fieldMetadataUniversalIdentifier) {
                throw new _fileuploadexception.FileUploadException('fieldMetadataId or fieldMetadataUniversalIdentifier must be provided', _fileuploadexception.FileUploadExceptionCode.BAD_REQUEST, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "VgGXR3",
                        message: "fieldMetadataId or fieldMetadataUniversalIdentifier must be provided"
                    }
                });
            }
            const fieldMetadata = await this.fieldMetadataRepository.findOneOrFail({
                select: [
                    'applicationId',
                    'universalIdentifier'
                ],
                where: {
                    ...fieldMetadataId ? {
                        id: fieldMetadataId
                    } : {},
                    ...fieldMetadataUniversalIdentifier ? {
                        universalIdentifier: fieldMetadataUniversalIdentifier
                    } : {},
                    workspaceId
                }
            });
            const application = await this.applicationRepository.findOneOrFail({
                where: {
                    id: fieldMetadata.applicationId,
                    workspaceId
                }
            });
            return {
                applicationUniversalIdentifier: application.universalIdentifier,
                resourcePath: `${fieldMetadata.universalIdentifier}/${name}`
            };
        }
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        return {
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            resourcePath: name
        };
    }
    async findFileOrThrow({ workspaceId, fileId }) {
        const file = await this.fileRepository.findOne(workspaceId, {
            where: {
                id: fileId
            }
        });
        if (!(0, _utils.isDefined)(file)) {
            throw new _fileuploadexception.FileUploadException(`File not found: ${fileId}`, _fileuploadexception.FileUploadExceptionCode.FILE_NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "weWV3g",
                    message: "File not found."
                }
            });
        }
        return file;
    }
    async resolveFileLocation({ workspaceId, file }) {
        const [fileFolder] = file.path.split('/');
        const application = await this.applicationRepository.findOneOrFail({
            where: {
                id: file.applicationId,
                workspaceId
            }
        });
        return {
            application,
            fileFolder: fileFolder,
            resourcePath: (0, _removefilefolderfromfileentitypathutils.removeFileFolderFromFileEntityPath)(file.path)
        };
    }
    async toFileWithSignedUrl({ file, fileFolder, workspaceId }) {
        return {
            ...file,
            url: await this.fileUrlService.signFileByIdUrl({
                fileId: file.id,
                workspaceId,
                fileFolder
            })
        };
    }
    constructor(fileStorageService, fileUrlService, fileUploadTargetService, fileUploadCompletionService, applicationService, applicationRepository, fieldMetadataRepository, fileRepository){
        this.fileStorageService = fileStorageService;
        this.fileUrlService = fileUrlService;
        this.fileUploadTargetService = fileUploadTargetService;
        this.fileUploadCompletionService = fileUploadCompletionService;
        this.applicationService = applicationService;
        this.applicationRepository = applicationRepository;
        this.fieldMetadataRepository = fieldMetadataRepository;
        this.fileRepository = fileRepository;
    }
};
FileUploadService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(5, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_param(6, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_param(7, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_fileentity.FileEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _fileurlservice.FileUrlService === "undefined" ? Object : _fileurlservice.FileUrlService,
        typeof _fileuploadtargetservice.FileUploadTargetService === "undefined" ? Object : _fileuploadtargetservice.FileUploadTargetService,
        typeof _fileuploadcompletionservice.FileUploadCompletionService === "undefined" ? Object : _fileuploadcompletionservice.FileUploadCompletionService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], FileUploadService);

//# sourceMappingURL=file-upload.service.js.map