"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PendingFileCleanupService", {
    enumerable: true,
    get: function() {
        return PendingFileCleanupService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _applicationentity = require("../../../application/application.entity");
const _filestorageservice = require("../../../file-storage/services/file-storage.service");
const _fileentity = require("../../entities/file.entity");
const _pendingfilecleanupconstants = require("../crons/constants/pending-file-cleanup.constants");
const _filestatustypes = require("../../types/file-status.types");
const _removefilefolderfromfileentitypathutils = require("../../utils/remove-file-folder-from-file-entity-path.utils");
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
let PendingFileCleanupService = class PendingFileCleanupService {
    // Deletes file records stuck in PENDING (direct uploads that were initiated
    // but never completed) together with any partially uploaded object. Never
    // promotes to UPLOADED: a file that was never confirmed is referenced by
    // nothing, the client recovery path is re-uploading under a fresh fileId.
    async cleanupStalePendingFiles() {
        const staleThreshold = new Date(Date.now() - _pendingfilecleanupconstants.PENDING_FILE_MAX_AGE_MS);
        const staleFiles = await this.fileRepository.find({
            where: {
                status: _filestatustypes.FILE_STATUS.PENDING,
                createdAt: (0, _typeorm1.LessThan)(staleThreshold),
                workspaceId: (0, _typeorm1.Not)((0, _typeorm1.IsNull)())
            },
            take: _pendingfilecleanupconstants.PENDING_FILE_CLEANUP_BATCH_SIZE
        });
        let deletedCount = 0;
        for (const file of staleFiles){
            try {
                // Claim the row atomically: delete it only while it is still PENDING.
                // If completeFileUpload promoted it to UPLOADED between the fetch above
                // and here, the delete affects no rows and the now-live file (and its
                // object) are left untouched.
                const { affected } = await this.fileRepository.delete({
                    id: file.id,
                    status: _filestatustypes.FILE_STATUS.PENDING
                });
                if (!(0, _utils.isDefined)(affected) || affected === 0) {
                    continue;
                }
                await this.deleteStorageObject(file);
                deletedCount++;
            } catch (error) {
                this.logger.warn(`Failed to clean up stale pending file ${file.id} in workspace ${file.workspaceId}: ${error.message}`);
            }
        }
        return deletedCount;
    }
    // The row has already been removed, so this only tidies the (possibly
    // partial, possibly absent) storage object. A failure here leaks bytes but
    // never data, so it is logged rather than retried.
    async deleteStorageObject(file) {
        if (!(0, _utils.isDefined)(file.workspaceId)) {
            return;
        }
        const [fileFolder] = file.path.split('/');
        const application = await this.applicationRepository.findOne({
            where: {
                id: file.applicationId,
                workspaceId: file.workspaceId
            }
        });
        if (!(0, _utils.isDefined)(application)) {
            return;
        }
        await this.fileStorageService.deleteFile({
            workspaceId: file.workspaceId,
            applicationUniversalIdentifier: application.universalIdentifier,
            fileFolder: fileFolder,
            resourcePath: (0, _removefilefolderfromfileentitypathutils.removeFileFolderFromFileEntityPath)(file.path)
        });
    }
    constructor(// eslint-disable-next-line twenty/prefer-workspace-scoped-repository -- the reaper runs in a cron with no workspace context and must sweep stale PENDING files across every workspace
    fileRepository, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository -- resolves the application universalIdentifier of a cross-workspace file while reaping outside any workspace context
    applicationRepository, fileStorageService){
        this.fileRepository = fileRepository;
        this.applicationRepository = applicationRepository;
        this.fileStorageService = fileStorageService;
        this.logger = new _common.Logger(PendingFileCleanupService.name);
    }
};
PendingFileCleanupService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_fileentity.FileEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService
    ])
], PendingFileCleanupService);

//# sourceMappingURL=pending-file-cleanup.service.js.map