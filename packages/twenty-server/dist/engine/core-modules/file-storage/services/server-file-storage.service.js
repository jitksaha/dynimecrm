"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServerFileStorageService", {
    enumerable: true,
    get: function() {
        return ServerFileStorageService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _path = require("path");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _serverfilestorageprefixconstant = require("../constants/server-file-storage-prefix.constant");
const _filestoragedriverfactory = require("../file-storage-driver.factory");
const _filestorageexception = require("../interfaces/file-storage-exception");
const _validatefilepathutil = require("../utils/validate-file-path.util");
const _validatestoragepathiswithinserverscopeorthrowutil = require("../utils/validate-storage-path-is-within-server-scope-or-throw.util");
const _fileentity = require("../../file/entities/file.entity");
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
let ServerFileStorageService = class ServerFileStorageService {
    validateAndBuildServerFileStoragePathOrThrow({ fileFolder, applicationRegistrationId, resourcePath }) {
        const validationResult = (0, _validatefilepathutil.validateFilePath)({
            resourcePath,
            fileFolder
        });
        if (!validationResult.isValid) {
            throw new _filestorageexception.FileStorageException(validationResult.error, _filestorageexception.FileStorageExceptionCode.ACCESS_DENIED);
        }
        const filePath = (0, _path.join)(fileFolder, applicationRegistrationId, resourcePath).replace(/\/+/g, '/');
        const onStorageFilePath = (0, _path.join)(_serverfilestorageprefixconstant.SERVER_FILE_STORAGE_PREFIX, filePath).replace(/\/+/g, '/');
        (0, _validatestoragepathiswithinserverscopeorthrowutil.validateStoragePathIsWithinServerScopeOrThrow)({
            onStoragePath: onStorageFilePath,
            fileFolder
        });
        return {
            onStorageFilePath,
            filePath
        };
    }
    async writeServerFile({ fileFolder, applicationRegistrationId, resourcePath, contents, mimeType }) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const { onStorageFilePath, filePath } = this.validateAndBuildServerFileStoragePathOrThrow({
            fileFolder,
            applicationRegistrationId,
            resourcePath
        });
        await driver.writeFile({
            filePath: onStorageFilePath,
            mimeType,
            sourceFile: contents
        });
        await this.serverFileRepository.upsert({
            path: filePath,
            workspaceId: null,
            size: typeof contents === 'string' ? Buffer.byteLength(contents) : contents.length,
            mimeType,
            applicationRegistrationId
        }, {
            conflictPaths: [
                'applicationRegistrationId',
                'path'
            ]
        });
        return this.serverFileRepository.findOneByOrFail({
            applicationRegistrationId,
            path: filePath,
            workspaceId: (0, _typeorm1.IsNull)()
        });
    }
    async readServerFile({ fileFolder, applicationRegistrationId, resourcePath }) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const { onStorageFilePath } = this.validateAndBuildServerFileStoragePathOrThrow({
            fileFolder,
            applicationRegistrationId,
            resourcePath
        });
        const serverFile = await this.findServerFile({
            fileFolder,
            applicationRegistrationId,
            resourcePath
        });
        if (!(0, _utils.isDefined)(serverFile)) {
            throw new _filestorageexception.FileStorageException(`Server file ${fileFolder}/${applicationRegistrationId}/${resourcePath} not found`, _filestorageexception.FileStorageExceptionCode.FILE_NOT_FOUND);
        }
        const stream = await driver.readFile({
            filePath: onStorageFilePath
        });
        return {
            stream,
            mimeType: serverFile.mimeType
        };
    }
    async findServerFile({ fileFolder, applicationRegistrationId, resourcePath }) {
        const { filePath } = this.validateAndBuildServerFileStoragePathOrThrow({
            fileFolder,
            applicationRegistrationId,
            resourcePath
        });
        return this.serverFileRepository.findOneBy({
            applicationRegistrationId,
            path: filePath,
            workspaceId: (0, _typeorm1.IsNull)()
        });
    }
    checkServerFileExists({ fileFolder, applicationRegistrationId, resourcePath }) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const { onStorageFilePath } = this.validateAndBuildServerFileStoragePathOrThrow({
            fileFolder,
            applicationRegistrationId,
            resourcePath
        });
        return driver.checkFileExists({
            filePath: onStorageFilePath
        });
    }
    async deleteServerFile({ fileFolder, applicationRegistrationId, resourcePath }) {
        const { onStorageFilePath, filePath } = this.validateAndBuildServerFileStoragePathOrThrow({
            fileFolder,
            applicationRegistrationId,
            resourcePath
        });
        await this.deleteServerFileBytesBestEffort(onStorageFilePath);
        await this.serverFileRepository.delete({
            path: filePath,
            workspaceId: (0, _typeorm1.IsNull)()
        });
    }
    async deleteByApplicationRegistrationId(applicationRegistrationId) {
        const serverFiles = await this.serverFileRepository.findBy({
            applicationRegistrationId,
            workspaceId: (0, _typeorm1.IsNull)()
        });
        for (const serverFile of serverFiles){
            await this.deleteServerFileBytesBestEffort(this.buildServerOnStorageFilePath(serverFile));
        }
        await this.serverFileRepository.delete({
            applicationRegistrationId,
            workspaceId: (0, _typeorm1.IsNull)()
        });
    }
    buildServerOnStorageFilePath(serverFile) {
        return (0, _path.join)(_serverfilestorageprefixconstant.SERVER_FILE_STORAGE_PREFIX, serverFile.path);
    }
    async deleteServerFileBytesBestEffort(onStorageFilePath) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        try {
            await driver.delete({
                folderPath: (0, _path.dirname)(onStorageFilePath),
                filename: (0, _path.basename)(onStorageFilePath)
            });
        } catch (error) {
            this.logger.warn(`Failed to delete server file bytes at ${onStorageFilePath}: ${error}`);
        }
    }
    constructor(fileStorageDriverFactory, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository -- server-scoped rows (workspaceId IS NULL) are unreachable through the scoped wrapper; every query below pins workspaceId to IsNull()
    serverFileRepository){
        this.fileStorageDriverFactory = fileStorageDriverFactory;
        this.serverFileRepository = serverFileRepository;
        this.logger = new _common.Logger(ServerFileStorageService.name);
    }
};
ServerFileStorageService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_fileentity.FileEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestoragedriverfactory.FileStorageDriverFactory === "undefined" ? Object : _filestoragedriverfactory.FileStorageDriverFactory,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ServerFileStorageService);

//# sourceMappingURL=server-file-storage.service.js.map