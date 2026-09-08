"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FilesFieldService", {
    enumerable: true,
    get: function() {
        return FilesFieldService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _path = require("path");
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _applicationentity = require("../../../application/application.entity");
const _filestorageservice = require("../../../file-storage/services/file-storage.service");
const _fileentity = require("../../entities/file.entity");
const _fileurlservice = require("../../file-url/file-url.service");
const _filesfieldexception = require("../files-field.exception");
const _filestatustypes = require("../../types/file-status.types");
const _extractfileinfoorthrowutils = require("../../utils/extract-file-info-or-throw.utils");
const _removefilefolderfromfileentitypathutils = require("../../utils/remove-file-folder-from-file-entity-path.utils");
const _fieldmetadataentity = require("../../../../metadata-modules/field-metadata/field-metadata.entity");
const _injectworkspacescopedrepositorydecorator = require("../../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
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
let FilesFieldService = class FilesFieldService {
    async uploadFile({ file, filename, workspaceId, fieldMetadataId, fieldMetadataUniversalIdentifier }) {
        if (!fieldMetadataId && !fieldMetadataUniversalIdentifier) {
            throw new _filesfieldexception.FilesFieldException('fieldMetadataId or fieldMetadataUniversalIdentifier must be provided', _filesfieldexception.FilesFieldExceptionCode.BAD_REQUEST, {
                userFriendlyMessage: /*i18n*/ {
                    id: "VgGXR3",
                    message: "fieldMetadataId or fieldMetadataUniversalIdentifier must be provided"
                }
            });
        }
        const { ext } = await (0, _extractfileinfoorthrowutils.extractFileInfoOrThrow)({
            file,
            filename
        });
        const fileId = (0, _uuid.v4)();
        const name = `${fileId}${(0, _guards.isNonEmptyString)(ext) ? `.${ext}` : ''}`;
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
        const savedFile = await this.fileStorageService.writeFile({
            sourceFile: file,
            resourcePath: `${fieldMetadata.universalIdentifier}/${name}`,
            fileFolder: _types.FileFolder.FilesField,
            applicationUniversalIdentifier: application.universalIdentifier,
            workspaceId,
            fileId,
            settings: {
                isTemporaryFile: true,
                toDelete: false
            }
        });
        return {
            ...savedFile,
            url: await this.fileUrlService.signFileByIdUrl({
                fileId,
                workspaceId,
                fileFolder: _types.FileFolder.FilesField
            })
        };
    }
    async copyFileIntoFilesField({ fileId, workspaceId, fieldMetadataId }) {
        const sourceFile = await this.fileRepository.findOne(workspaceId, {
            where: {
                id: fileId
            }
        });
        if (!(0, _utils.isDefined)(sourceFile)) {
            throw new _filesfieldexception.FilesFieldException(`File ${fileId} not found`, _filesfieldexception.FilesFieldExceptionCode.BAD_REQUEST, {
                userFriendlyMessage: /*i18n*/ {
                    id: "weWV3g",
                    message: "File not found."
                }
            });
        }
        if (sourceFile.status !== _filestatustypes.FILE_STATUS.UPLOADED) {
            throw new _filesfieldexception.FilesFieldException(`File ${fileId} upload has not been completed`, _filesfieldexception.FilesFieldExceptionCode.BAD_REQUEST, {
                userFriendlyMessage: /*i18n*/ {
                    id: "2hrpBa",
                    message: "The file upload has not been completed. Please retry the upload."
                }
            });
        }
        const fieldMetadata = await this.fieldMetadataRepository.findOneOrFail({
            select: [
                'applicationId',
                'universalIdentifier'
            ],
            where: {
                id: fieldMetadataId,
                workspaceId
            }
        });
        const [sourceApplication, destinationApplication] = await Promise.all([
            this.applicationRepository.findOneOrFail({
                select: [
                    'universalIdentifier'
                ],
                where: {
                    id: sourceFile.applicationId,
                    workspaceId
                }
            }),
            this.applicationRepository.findOneOrFail({
                select: [
                    'universalIdentifier'
                ],
                where: {
                    id: fieldMetadata.applicationId,
                    workspaceId
                }
            })
        ]);
        const copiedFileId = (0, _uuid.v4)();
        const extension = (0, _path.extname)(sourceFile.path);
        const resourcePath = `${fieldMetadata.universalIdentifier}/${copiedFileId}${extension}`;
        const sourceFileFolder = sourceFile.path.split('/')[0];
        await this.fileStorageService.copy({
            from: {
                workspaceId,
                applicationUniversalIdentifier: sourceApplication.universalIdentifier,
                fileFolder: sourceFileFolder,
                resourcePath: (0, _removefilefolderfromfileentitypathutils.removeFileFolderFromFileEntityPath)(sourceFile.path)
            },
            to: {
                workspaceId,
                applicationUniversalIdentifier: destinationApplication.universalIdentifier,
                fileFolder: _types.FileFolder.FilesField,
                resourcePath
            }
        });
        return this.fileRepository.insertAndReturnOne(workspaceId, {
            id: copiedFileId,
            path: `${_types.FileFolder.FilesField}/${resourcePath}`,
            applicationId: fieldMetadata.applicationId,
            mimeType: sourceFile.mimeType,
            size: sourceFile.size,
            status: _filestatustypes.FILE_STATUS.UPLOADED,
            settings: {
                isTemporaryFile: true,
                toDelete: false
            }
        });
    }
    async deleteFilesFieldFile({ fileId, workspaceId }) {
        try {
            await this.fileStorageService.deleteByFileId({
                fileId,
                workspaceId,
                fileFolder: _types.FileFolder.FilesField
            });
        } catch (error) {
            throw new _filesfieldexception.FilesFieldException(`Failed to delete file ${fileId}: ${error.message}`, _filesfieldexception.FilesFieldExceptionCode.FILE_DELETION_FAILED, {
                userFriendlyMessage: /*i18n*/ {
                    id: "mWj8el",
                    message: "Failed to delete file {fileId}",
                    values: {
                        fileId: fileId
                    }
                }
            });
        }
    }
    constructor(fileStorageService, applicationRepository, fieldMetadataRepository, fileRepository, fileUrlService){
        this.fileStorageService = fileStorageService;
        this.applicationRepository = applicationRepository;
        this.fieldMetadataRepository = fieldMetadataRepository;
        this.fileRepository = fileRepository;
        this.fileUrlService = fileUrlService;
    }
};
FilesFieldService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_param(3, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_fileentity.FileEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _fileurlservice.FileUrlService === "undefined" ? Object : _fileurlservice.FileUrlService
    ])
], FilesFieldService);

//# sourceMappingURL=files-field.service.js.map