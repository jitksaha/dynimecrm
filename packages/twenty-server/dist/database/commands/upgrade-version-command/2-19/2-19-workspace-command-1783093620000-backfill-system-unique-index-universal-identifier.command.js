"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillSystemUniqueIndexUniversalIdentifierCommand", {
    enumerable: true,
    get: function() {
        return BackfillSystemUniqueIndexUniversalIdentifierCommand;
    }
});
const _nestcommander = require("nest-commander");
const _typeorm = require("@nestjs/typeorm");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _getmetadataserializedrelationnamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-serialized-relation-names.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../engine/metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _isprimarykeyflatfieldmetadatautil = require("../../../../engine/metadata-modules/flat-field-metadata/utils/is-primary-key-flat-field-metadata.util");
const _issystemuniqueflatindexmetadatautil = require("../../../../engine/metadata-modules/flat-index-metadata/utils/is-system-unique-flat-index-metadata.util");
const _indexmetadataentity = require("../../../../engine/metadata-modules/index-metadata/index-metadata.entity");
const _workspacemetadataversionservice = require("../../../../engine/metadata-modules/workspace-metadata-version/services/workspace-metadata-version.service");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let BackfillSystemUniqueIndexUniversalIdentifierCommand = class BackfillSystemUniqueIndexUniversalIdentifierCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps, flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatIndexMaps',
            'flatApplicationMaps'
        ]);
        const backingFlatIndexMetadataByFieldMetadataId = new Map(Object.values(flatIndexMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatIndexMetadata)=>(0, _issystemuniqueflatindexmetadatautil.isSystemUniqueFlatIndexMetadata)(flatIndexMetadata) && flatIndexMetadata.flatIndexFieldMetadatas.length === 1).map((flatIndexMetadata)=>[
                flatIndexMetadata.flatIndexFieldMetadatas[0].fieldMetadataId,
                flatIndexMetadata
            ]));
        const indexesToBackfill = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatFieldMetadata)=>flatFieldMetadata.isUnique === true && !(0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(flatFieldMetadata) && !(0, _isprimarykeyflatfieldmetadatautil.isPrimaryKeyFlatFieldMetadata)(flatFieldMetadata)).flatMap((flatFieldMetadata)=>{
            const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: flatFieldMetadata.objectMetadataId,
                flatEntityMaps: flatObjectMetadataMaps
            });
            if (!(0, _utils.isDefined)(flatObjectMetadata) || !(0, _utils.isDefined)(flatFieldMetadata.applicationId)) {
                return [];
            }
            const applicationUniversalIdentifier = flatApplicationMaps.byId[flatFieldMetadata.applicationId]?.universalIdentifier;
            if (!(0, _utils.isDefined)(applicationUniversalIdentifier)) {
                return [];
            }
            const backingFlatIndexMetadata = backingFlatIndexMetadataByFieldMetadataId.get(flatFieldMetadata.id);
            if (!(0, _utils.isDefined)(backingFlatIndexMetadata)) {
                return [];
            }
            const deterministicUniversalIdentifier = (0, _application.getIndexUniversalIdentifier)({
                applicationUniversalIdentifier,
                objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
                name: backingFlatIndexMetadata.name
            });
            if (deterministicUniversalIdentifier === backingFlatIndexMetadata.universalIdentifier) {
                return [];
            }
            return [
                {
                    id: backingFlatIndexMetadata.id,
                    name: backingFlatIndexMetadata.name,
                    deterministicUniversalIdentifier
                }
            ];
        });
        if (indexesToBackfill.length === 0) {
            this.logger.log(`No system unique index universal identifier to backfill for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Backfilling ${indexesToBackfill.length} system unique index universal identifier(s) for workspace ${workspaceId}: ${indexesToBackfill.map(({ name })=>name).join(', ')}`);
        if (isDryRun) {
            return;
        }
        for (const { id, deterministicUniversalIdentifier } of indexesToBackfill){
            await this.indexMetadataRepository.update({
                id,
                workspaceId
            }, {
                universalIdentifier: deterministicUniversalIdentifier
            });
        }
        const indexRelatedMetadataNames = [
            'index',
            ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('index'),
            ...(0, _getmetadataserializedrelationnamesutil.getMetadataSerializedRelationNames)('index')
        ];
        const cacheKeysToFlush = [
            ...new Set(indexRelatedMetadataNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
        ];
        await this.workspaceCacheService.flush(workspaceId, cacheKeysToFlush);
        await this.workspaceMetadataVersionService.incrementMetadataVersion(workspaceId);
        this.logger.log(`Backfilled ${indexesToBackfill.length} system unique index universal identifier(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMetadataVersionService, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    indexMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMetadataVersionService = workspaceMetadataVersionService, this.indexMetadataRepository = indexMetadataRepository;
    }
};
BackfillSystemUniqueIndexUniversalIdentifierCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.19.0', 1783093620000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-19:backfill-system-unique-index-universal-identifier',
        description: 'Backfill the deterministic universal identifier of system unique indexes (the index backing a unique scalar field) so the metadata side-effect engine can own their lifecycle.'
    }),
    _ts_param(3, (0, _typeorm.InjectRepository)(_indexmetadataentity.IndexMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemetadataversionservice.WorkspaceMetadataVersionService === "undefined" ? Object : _workspacemetadataversionservice.WorkspaceMetadataVersionService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], BackfillSystemUniqueIndexUniversalIdentifierCommand);

//# sourceMappingURL=2-19-workspace-command-1783093620000-backfill-system-unique-index-universal-identifier.command.js.map