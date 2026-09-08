"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileUploadCompletionService", {
    enumerable: true,
    get: function() {
        return FileUploadCompletionService;
    }
});
const _common = require("@nestjs/common");
const _stream = require("stream");
const _utils = require("twenty-shared/utils");
const _filestorageservice = require("../../../file-storage/services/file-storage.service");
const _fileentity = require("../../entities/file.entity");
const _filecontentsniffconstant = require("../constants/file-content-sniff.constant");
const _fileuploadexception = require("../file-upload.exception");
const _tobatcherrormessageutil = require("../utils/to-batch-error-message.util");
const _filefolderinterface = require("../../interfaces/file-folder.interface");
const _filestatustypes = require("../../types/file-status.types");
const _extractfileinfoorthrowutils = require("../../utils/extract-file-info-or-throw.utils");
const _removefilefolderfromfileentitypathutils = require("../../utils/remove-file-folder-from-file-entity-path.utils");
const _sanitizefileutils = require("../../utils/sanitize-file.utils");
const _injectworkspacescopedrepositorydecorator = require("../../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _readreadableprefix = require("../../../../../utils/read-readable-prefix");
const _streamtobuffer = require("../../../../../utils/stream-to-buffer");
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
let FileUploadCompletionService = class FileUploadCompletionService {
    async completeUploadsBatch(requests) {
        return Promise.all(requests.map(async (request)=>{
            try {
                const value = await this.completeUploadedFile({
                    workspaceId: request.workspaceId,
                    file: request.file,
                    storageLocation: this.getApplicationFileStorageLocation(request)
                });
                return {
                    success: true,
                    value
                };
            } catch (error) {
                return {
                    success: false,
                    error: (0, _tobatcherrormessageutil.toBatchErrorMessage)(error)
                };
            }
        }));
    }
    async completeUploadedFile({ workspaceId, file, storageLocation }) {
        const metadata = await this.fileStorageService.getFileMetadata(storageLocation);
        if (!(0, _utils.isDefined)(metadata)) {
            throw new _fileuploadexception.FileUploadException(`File "${file.path}" has not been uploaded to storage yet.`, _fileuploadexception.FileUploadExceptionCode.FILE_NOT_UPLOADED, {
                userFriendlyMessage: /*i18n*/ {
                    id: "H+ZNr6",
                    message: "The file has not been uploaded yet. Please upload it before confirming."
                }
            });
        }
        const declaredSize = Number(file.size);
        if (metadata.size !== declaredSize) {
            throw new _fileuploadexception.FileUploadException(`File "${file.path}" has ${metadata.size} bytes in storage but ${declaredSize} were declared.`, _fileuploadexception.FileUploadExceptionCode.FILE_SIZE_MISMATCH, {
                userFriendlyMessage: /*i18n*/ {
                    id: "uYP2Uw",
                    message: "The uploaded file does not match the declared size. Please retry the upload."
                }
            });
        }
        const mimeType = await this.detectUploadedMimeTypeOrThrow({
            ...storageLocation,
            filename: file.path
        });
        this.assertMimeTypeAllowedForFolder(storageLocation.fileFolder, mimeType);
        const size = await this.sanitizeUploadedFileIfNeeded({
            storageLocation,
            mimeType,
            size: metadata.size
        });
        await this.fileRepository.update(workspaceId, {
            id: file.id
        }, {
            status: _filestatustypes.FILE_STATUS.UPLOADED,
            mimeType,
            size
        });
        return {
            id: file.id,
            path: file.path,
            size,
            createdAt: file.createdAt,
            mimeType
        };
    }
    getApplicationFileStorageLocation({ workspaceId, applicationUniversalIdentifier, file }) {
        const [fileFolder] = file.path.split('/');
        return {
            fileFolder: fileFolder,
            applicationUniversalIdentifier,
            workspaceId,
            resourcePath: (0, _removefilefolderfromfileentitypathutils.removeFileFolderFromFileEntityPath)(file.path)
        };
    }
    async detectUploadedMimeTypeOrThrow({ fileFolder, applicationUniversalIdentifier, workspaceId, resourcePath, filename }) {
        const stream = await this.fileStorageService.readFile({
            fileFolder,
            applicationUniversalIdentifier,
            workspaceId,
            resourcePath
        });
        const prefix = await (0, _readreadableprefix.readReadablePrefix)(stream, _filecontentsniffconstant.FILE_CONTENT_SNIFF_BYTE_COUNT);
        const { mimeType } = await (0, _extractfileinfoorthrowutils.extractFileInfoOrThrow)({
            file: prefix,
            filename
        });
        return mimeType;
    }
    assertMimeTypeAllowedForFolder(fileFolder, mimeType) {
        const { allowedMimeTypes } = _filefolderinterface.fileFolderConfigs[fileFolder];
        if (!allowedMimeTypes || allowedMimeTypes.includes(mimeType)) {
            return;
        }
        throw new _fileuploadexception.FileUploadException(`MIME type ${mimeType} is not allowed in file folder ${fileFolder}`, _fileuploadexception.FileUploadExceptionCode.BAD_REQUEST, {
            userFriendlyMessage: /*i18n*/ {
                id: "5F02zD",
                message: "This file format is not supported."
            }
        });
    }
    async sanitizeUploadedFileIfNeeded({ storageLocation, mimeType, size }) {
        if (mimeType !== 'image/svg+xml') {
            return size;
        }
        const stream = await this.fileStorageService.readFile(storageLocation);
        const sanitizedFile = (0, _sanitizefileutils.sanitizeFile)({
            file: await (0, _streamtobuffer.streamToBuffer)(stream),
            ext: 'svg',
            mimeType
        });
        const sanitizedBuffer = Buffer.isBuffer(sanitizedFile) ? sanitizedFile : Buffer.from(sanitizedFile);
        await this.fileStorageService.writeFileStream({
            ...storageLocation,
            stream: _stream.Readable.from(sanitizedBuffer),
            mimeType
        });
        return sanitizedBuffer.length;
    }
    constructor(fileStorageService, fileRepository){
        this.fileStorageService = fileStorageService;
        this.fileRepository = fileRepository;
    }
};
FileUploadCompletionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_fileentity.FileEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], FileUploadCompletionService);

//# sourceMappingURL=file-upload-completion.service.js.map