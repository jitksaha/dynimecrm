"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillSystemFieldIsSystemSideEffectCommand", {
    enumerable: true,
    get: function() {
        return BackfillSystemFieldIsSystemSideEffectCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationentity = require("../../../../engine/core-modules/application/application.entity");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _partialsystemflatfieldmetadatasconstant = require("../../../../engine/metadata-modules/object-metadata/constants/partial-system-flat-field-metadatas.constant");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationrunnerservice = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/services/workspace-migration-runner.service");
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
const SYSTEM_FIELD_NAMES = new Set([
    _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS.id.name,
    _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS.createdAt.name,
    _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS.updatedAt.name,
    _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS.deletedAt.name,
    _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS.createdBy.name,
    _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS.updatedBy.name,
    _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS.position.name,
    _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS.searchVector.name
]);
let BackfillSystemFieldIsSystemSideEffectCommand = class BackfillSystemFieldIsSystemSideEffectCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const applications = await this.applicationRepository.find({
            select: [
                'id',
                'universalIdentifier'
            ],
            where: {
                workspaceId
            },
            withDeleted: true
        });
        const applicationUniversalIdentifierById = new Map(applications.map((application)=>[
                application.id,
                application.universalIdentifier
            ]));
        const { flatFieldMetadataMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps'
        ]);
        const fieldMetadataIdsToFlag = [];
        for (const flatFieldMetadata of Object.values(flatFieldMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatFieldMetadata) || !SYSTEM_FIELD_NAMES.has(flatFieldMetadata.name) || flatFieldMetadata.isSystemSideEffect) {
                continue;
            }
            const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityMaps: flatObjectMetadataMaps,
                flatEntityId: flatFieldMetadata.objectMetadataId
            });
            const applicationUniversalIdentifier = applicationUniversalIdentifierById.get(flatFieldMetadata.applicationId);
            if (!(0, _utils.isDefined)(flatObjectMetadata) || !(0, _utils.isDefined)(applicationUniversalIdentifier)) {
                this.logger.warn(`Missing object or application for field ${flatFieldMetadata.name} (${flatFieldMetadata.id}) in workspace ${workspaceId}, skipping`);
                continue;
            }
            const systemFieldUniversalIdentifier = (0, _application.getFieldUniversalIdentifier)({
                applicationUniversalIdentifier,
                objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
                name: flatFieldMetadata.name
            });
            if (systemFieldUniversalIdentifier !== flatFieldMetadata.universalIdentifier) {
                this.logger.warn(`System field ${flatFieldMetadata.name} (${flatFieldMetadata.id}) does not carry its deterministic universal identifier in workspace ${workspaceId}, skipping`);
                continue;
            }
            fieldMetadataIdsToFlag.push(flatFieldMetadata.id);
        }
        if (fieldMetadataIdsToFlag.length === 0) {
            this.logger.log(`No system field isSystemSideEffect flag to backfill for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Flagging ${fieldMetadataIdsToFlag.length} system field(s) as isSystemSideEffect for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        await this.fieldMetadataRepository.update({
            id: (0, _typeorm1.In)(fieldMetadataIdsToFlag),
            workspaceId
        }, {
            isSystemSideEffect: true
        });
        await this.workspaceMigrationRunnerService.invalidateCache({
            allFlatEntityMapsKeys: [
                (0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)('fieldMetadata')
            ],
            workspaceId
        });
        this.logger.log(`Flagged ${fieldMetadataIdsToFlag.length} system field(s) as isSystemSideEffect for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationRunnerService, applicationRepository, fieldMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.applicationRepository = applicationRepository, this.fieldMetadataRepository = fieldMetadataRepository;
    }
};
BackfillSystemFieldIsSystemSideEffectCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.21.0', 1783925862946),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-21:backfill-system-field-is-system-side-effect',
        description: 'Flag existing system fields (id, createdAt, updatedAt, deletedAt, createdBy, updatedBy, position, searchVector) as isSystemSideEffect: true so manifest sync deletion inference excludes them.'
    }),
    _ts_param(3, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], BackfillSystemFieldIsSystemSideEffectCommand);

//# sourceMappingURL=2-21-workspace-command-1783925862946-backfill-system-field-is-system-side-effect.command.js.map