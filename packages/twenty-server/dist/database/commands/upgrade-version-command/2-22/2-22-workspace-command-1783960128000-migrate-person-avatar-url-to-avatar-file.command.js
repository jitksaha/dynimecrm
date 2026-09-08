"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MigratePersonAvatarUrlToAvatarFileCommand", {
    enumerable: true,
    get: function() {
        return MigratePersonAvatarUrlToAvatarFileCommand;
    }
});
const _nestcommander = require("nest-commander");
const _guards = require("@sniptt/guards");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _filesfieldservice = require("../../../../engine/core-modules/file/files-field/services/files-field.service");
const _securehttpclientservice = require("../../../../engine/core-modules/secure-http-client/secure-http-client.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _image = require("../../../../utils/image");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const PERSON_BATCH_SIZE = 100;
const MIN_UUID = '00000000-0000-0000-0000-000000000000';
let MigratePersonAvatarUrlToAvatarFileCommand = class MigratePersonAvatarUrlToAvatarFileCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options, dataSource }) {
        const isDryRun = options.dryRun ?? false;
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No workspace data source for workspace ${workspaceId}, skipping`);
            return;
        }
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const personObject = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: _metadata.STANDARD_OBJECTS.person.universalIdentifier
        });
        if (!(0, _utils.isDefined)(personObject)) {
            this.logger.log(`person object not found for workspace ${workspaceId}, skipping`);
            return;
        }
        const avatarFileField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: _metadata.STANDARD_OBJECTS.person.fields.avatarFile.universalIdentifier
        });
        if (!(0, _utils.isDefined)(avatarFileField)) {
            this.logger.log(`avatarFile field not found on person for workspace ${workspaceId}, skipping`);
            return;
        }
        const personRepository = this.workspaceOrmManager.getRepository('person', {
            shouldBypassPermissionChecks: true
        });
        let candidateCount = 0;
        let migratedCount = 0;
        let skippedCount = 0;
        let failedCount = 0;
        let cursor = MIN_UUID;
        let persons = await this.findPersonsWithAvatarUrlBatch({
            personRepository,
            cursor
        });
        while(persons.length > 0){
            cursor = persons[persons.length - 1].id;
            for (const person of persons){
                const avatarUrl = person.avatarUrl;
                if (!(0, _guards.isNonEmptyString)(avatarUrl) || (0, _utils.isNonEmptyArray)(person.avatarFile)) {
                    continue;
                }
                if (isDryRun) {
                    candidateCount++;
                    continue;
                }
                const result = await this.migratePersonAvatar({
                    personId: person.id,
                    avatarUrl,
                    workspaceId,
                    fieldMetadataUniversalIdentifier: avatarFileField.universalIdentifier,
                    personRepository
                });
                if (result === 'migrated') {
                    migratedCount++;
                } else if (result === 'skipped') {
                    skippedCount++;
                } else {
                    failedCount++;
                }
            }
            persons = await this.findPersonsWithAvatarUrlBatch({
                personRepository,
                cursor
            });
        }
        if (isDryRun) {
            if (candidateCount > 0) {
                this.logger.log(`[DRY RUN] person avatarUrl -> avatarFile for workspace ${workspaceId}: ${candidateCount} candidate(s) would be attempted (download/upload not performed, so migrated/skipped/failed is unknown)`);
            }
            return;
        }
        if (migratedCount > 0 || skippedCount > 0 || failedCount > 0) {
            this.logger.log(`person avatarUrl -> avatarFile for workspace ${workspaceId}: ${migratedCount} migrated, ${skippedCount} skipped (unreachable/non-image), ${failedCount} failed`);
        }
    }
    async findPersonsWithAvatarUrlBatch({ personRepository, cursor }) {
        return personRepository.find({
            select: [
                'id',
                'avatarUrl',
                'avatarFile'
            ],
            where: {
                id: (0, _typeorm.MoreThan)(cursor),
                avatarUrl: (0, _typeorm.Not)((0, _typeorm.IsNull)())
            },
            order: {
                id: 'ASC'
            },
            take: PERSON_BATCH_SIZE
        });
    }
    async migratePersonAvatar({ personId, avatarUrl, workspaceId, fieldMetadataUniversalIdentifier, personRepository }) {
        const imageData = await this.downloadImage({
            imageUrl: avatarUrl,
            personId,
            workspaceId
        });
        if (!(0, _utils.isDefined)(imageData)) {
            return 'skipped';
        }
        const filename = `avatar.${imageData.extension}`;
        const uploadedFile = await this.uploadAvatarFile({
            buffer: imageData.buffer,
            filename,
            workspaceId,
            fieldMetadataUniversalIdentifier,
            personId
        });
        if (!(0, _utils.isDefined)(uploadedFile)) {
            return 'failed';
        }
        try {
            await personRepository.update(personId, {
                avatarFile: [
                    {
                        fileId: uploadedFile.id,
                        label: filename,
                        extension: imageData.extension
                    }
                ]
            });
            return 'migrated';
        } catch (error) {
            this.logger.warn(`Failed to attach migrated avatar for person ${personId} in workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
            const isFileReferencedByPerson = await this.isAvatarFileReferenced({
                personId,
                fileId: uploadedFile.id,
                workspaceId,
                personRepository
            });
            if (isFileReferencedByPerson) {
                return 'migrated';
            }
            await this.safeDeleteUploadedFile(uploadedFile.id, workspaceId);
            return 'failed';
        }
    }
    async uploadAvatarFile({ buffer, filename, workspaceId, fieldMetadataUniversalIdentifier, personId }) {
        try {
            return await this.filesFieldService.uploadFile({
                file: buffer,
                filename,
                workspaceId,
                fieldMetadataUniversalIdentifier
            });
        } catch (error) {
            this.logger.warn(`Failed to upload migrated avatar for person ${personId} in workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
            return undefined;
        }
    }
    async isAvatarFileReferenced({ personId, fileId, workspaceId, personRepository }) {
        try {
            const person = await personRepository.findOne({
                select: [
                    'id',
                    'avatarFile'
                ],
                where: {
                    id: personId
                }
            });
            return person?.avatarFile?.some((file)=>file.fileId === fileId) ?? false;
        } catch (error) {
            this.logger.warn(`Failed to verify avatar file reference for person ${personId} in workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
            return true;
        }
    }
    async downloadImage({ imageUrl, personId, workspaceId }) {
        const httpClient = this.secureHttpClientService.getHttpClient({
            retries: 2,
            shouldResetTimeout: true
        });
        try {
            return await (0, _image.fetchImageWithTypeFromUrl)(imageUrl, httpClient);
        } catch  {
            this.logger.warn(`Failed to fetch avatar image for person ${personId} in workspace ${workspaceId}, skipping`);
            return undefined;
        }
    }
    async safeDeleteUploadedFile(fileId, workspaceId) {
        try {
            await this.filesFieldService.deleteFilesFieldFile({
                fileId,
                workspaceId
            });
        } catch (error) {
            this.logger.warn(`Failed to delete orphaned avatar file ${fileId} in workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService, filesFieldService, secureHttpClientService, workspaceOrmManager){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.filesFieldService = filesFieldService, this.secureHttpClientService = secureHttpClientService, this.workspaceOrmManager = workspaceOrmManager;
    }
};
MigratePersonAvatarUrlToAvatarFileCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.22.0', 1783960128000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-22:migrate-person-avatar-url-to-avatar-file',
        description: 'Migrate legacy person.avatarUrl (external image URL) into the avatarFile FILES field for existing workspaces.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _filesfieldservice.FilesFieldService === "undefined" ? Object : _filesfieldservice.FilesFieldService,
        typeof _securehttpclientservice.SecureHttpClientService === "undefined" ? Object : _securehttpclientservice.SecureHttpClientService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], MigratePersonAvatarUrlToAvatarFileCommand);

//# sourceMappingURL=2-22-workspace-command-1783960128000-migrate-person-avatar-url-to-avatar-file.command.js.map