"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReconcileSystemRelationFieldUniversalIdentifierCommand", {
    enumerable: true,
    get: function() {
        return ReconcileSystemRelationFieldUniversalIdentifierCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _getmetadataserializedrelationnamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-serialized-relation-names.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _standardobjecticons = require("../../../../engine/workspace-manager/workspace-migration/constant/standard-object-icons");
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
const REVERSE_SYSTEM_RELATION_FIELD_NAME_PREFIX = 'target';
// Every provisioning path of the default relations (legacy SDK manifest, legacy
// API transpiler, twenty-standard) stamps the reverse morph field with the
// engine-defined targetMorphId of its host standard object, while user-created
// morph relations carry freshly generated morphIds. Matching on this morphId
// (in addition to the name prefix) makes the reconciliation an exact
// fingerprint and cannot hijack a user-authored `target*` morph field hosted
// on one of the four standard relation objects.
const TARGET_MORPH_ID_BY_DEFAULT_RELATION_OBJECT_UNIVERSAL_IDENTIFIER = Object.fromEntries(_metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS.map((standardObjectNameSingular)=>[
        _metadata.STANDARD_OBJECTS[standardObjectNameSingular].universalIdentifier,
        _metadata.STANDARD_OBJECTS[standardObjectNameSingular].morphIds.targetMorphId.morphId
    ]));
let ReconcileSystemRelationFieldUniversalIdentifierCommand = class ReconcileSystemRelationFieldUniversalIdentifierCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps'
        ]);
        const systemRelationFieldUpdates = [];
        for (const flatFieldMetadata of Object.values(flatFieldMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatFieldMetadata) || flatFieldMetadata.type !== _types.FieldMetadataType.MORPH_RELATION || !flatFieldMetadata.name.startsWith(REVERSE_SYSTEM_RELATION_FIELD_NAME_PREFIX) || !(0, _utils.isDefined)(flatFieldMetadata.relationTargetObjectMetadataId)) {
                continue;
            }
            const hostFlatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityMaps: flatObjectMetadataMaps,
                flatEntityId: flatFieldMetadata.objectMetadataId
            });
            if (!(0, _utils.isDefined)(hostFlatObjectMetadata)) {
                continue;
            }
            const expectedTargetMorphId = TARGET_MORPH_ID_BY_DEFAULT_RELATION_OBJECT_UNIVERSAL_IDENTIFIER[hostFlatObjectMetadata.universalIdentifier];
            if (!(0, _utils.isDefined)(expectedTargetMorphId) || flatFieldMetadata.morphId !== expectedTargetMorphId) {
                continue;
            }
            const sourceFlatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityMaps: flatObjectMetadataMaps,
                flatEntityId: flatFieldMetadata.relationTargetObjectMetadataId
            });
            if (!(0, _utils.isDefined)(sourceFlatObjectMetadata)) {
                this.logger.warn(`Missing source object for reverse relation field ${flatFieldMetadata.name} (${flatFieldMetadata.id}) in workspace ${workspaceId}, skipping`);
                continue;
            }
            const derivedUniversalIdentifier = (0, _application.getSystemRelationFieldUniversalIdentifier)({
                applicationUniversalIdentifier: sourceFlatObjectMetadata.applicationUniversalIdentifier,
                objectUniversalIdentifier: hostFlatObjectMetadata.universalIdentifier,
                relationTargetObjectUniversalIdentifier: sourceFlatObjectMetadata.universalIdentifier
            });
            // Name-derived label + host-object icon, matching the engine provisioner
            // convention already used for custom objects.
            const derivedLabel = (0, _utils.capitalize)(sourceFlatObjectMetadata.nameSingular);
            const derivedIcon = _standardobjecticons.STANDARD_OBJECT_ICONS[hostFlatObjectMetadata.nameSingular] ?? 'IconBuildingSkyscraper';
            const update = {};
            if (flatFieldMetadata.universalIdentifier !== derivedUniversalIdentifier) {
                update.universalIdentifier = derivedUniversalIdentifier;
            }
            if (!flatFieldMetadata.isSystemSideEffect) {
                update.isSystemSideEffect = true;
            }
            if (flatFieldMetadata.label !== derivedLabel) {
                update.label = derivedLabel;
            }
            if (flatFieldMetadata.icon !== derivedIcon) {
                update.icon = derivedIcon;
            }
            if (Object.keys(update).length > 0) {
                systemRelationFieldUpdates.push({
                    id: flatFieldMetadata.id,
                    update
                });
            }
            // Both sides of a default relation are engine-owned, for standard and
            // custom source objects alike: the forward field on the source object
            // was provisioned alongside the reverse field (by the side-effect engine
            // for custom objects, by twenty-standard for standard ones), so it must
            // carry isSystemSideEffect and the same name-free deterministic
            // universal identifier as the reverse side, with host and relation
            // target swapped — matching what the create side-effect handler emits
            // for objects created post-2.23.
            const forwardFlatFieldMetadata = (0, _utils.isDefined)(flatFieldMetadata.relationTargetFieldMetadataId) ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityMaps: flatFieldMetadataMaps,
                flatEntityId: flatFieldMetadata.relationTargetFieldMetadataId
            }) : undefined;
            if (!(0, _utils.isDefined)(forwardFlatFieldMetadata)) {
                this.logger.warn(`Missing forward field for reverse relation field ${flatFieldMetadata.name} (${flatFieldMetadata.id}) in workspace ${workspaceId}, skipping`);
                continue;
            }
            const derivedForwardUniversalIdentifier = (0, _application.getSystemRelationFieldUniversalIdentifier)({
                applicationUniversalIdentifier: sourceFlatObjectMetadata.applicationUniversalIdentifier,
                objectUniversalIdentifier: sourceFlatObjectMetadata.universalIdentifier,
                relationTargetObjectUniversalIdentifier: hostFlatObjectMetadata.universalIdentifier
            });
            const forwardUpdate = {};
            if (forwardFlatFieldMetadata.universalIdentifier !== derivedForwardUniversalIdentifier) {
                forwardUpdate.universalIdentifier = derivedForwardUniversalIdentifier;
            }
            if (!forwardFlatFieldMetadata.isSystemSideEffect) {
                forwardUpdate.isSystemSideEffect = true;
            }
            if (Object.keys(forwardUpdate).length > 0) {
                systemRelationFieldUpdates.push({
                    id: forwardFlatFieldMetadata.id,
                    update: forwardUpdate
                });
            }
        }
        if (systemRelationFieldUpdates.length === 0) {
            this.logger.log(`No default-relation field to reconcile for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Reconciling ${systemRelationFieldUpdates.length} default-relation field(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        // Single transaction per workspace: a partial backfill would leave old and
        // new universal identifiers coexisting, breaking the reconcile invariant
        // for the follow-up people-data-labs upgrade command.
        await this.fieldMetadataRepository.manager.transaction(async (entityManager)=>{
            const transactionalFieldMetadataRepository = entityManager.getRepository(_fieldmetadataentity.FieldMetadataEntity);
            for (const { id, update } of systemRelationFieldUpdates){
                await transactionalFieldMetadataRepository.update({
                    id,
                    workspaceId
                }, update);
            }
        });
        const fieldMetadataRelatedNames = [
            'fieldMetadata',
            ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('fieldMetadata'),
            ...(0, _getmetadataserializedrelationnamesutil.getMetadataSerializedRelationNames)('fieldMetadata'),
            'index'
        ];
        const allFlatEntityMapsKeys = [
            ...new Set(fieldMetadataRelatedNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
        ];
        await this.workspaceMigrationRunnerService.invalidateCache({
            allFlatEntityMapsKeys,
            workspaceId
        });
        this.logger.log(`Reconciled ${systemRelationFieldUpdates.length} default-relation field(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationRunnerService, fieldMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.fieldMetadataRepository = fieldMetadataRepository;
    }
};
ReconcileSystemRelationFieldUniversalIdentifierCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.23.0', 1784565136000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-23:reconcile-system-relation-field-universal-identifier',
        description: 'Reconcile the default relations (timelineActivity/attachment/noteTarget/taskTarget) with the engine convention, for standard and custom source objects alike. Both sides get the name-free deterministic universal identifier (host and relation target object identifiers, direction encoded by swapping them) and isSystemSideEffect: true; reverse morph fields additionally get the name-derived label/icon. An object rename becomes a lossless update and standard fields match custom ones, as if twenty-standard objects had been provisioned by the side-effect engine.'
    }),
    _ts_param(3, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ReconcileSystemRelationFieldUniversalIdentifierCommand);

//# sourceMappingURL=2-23-workspace-command-1784565136000-reconcile-system-relation-field-universal-identifier.command.js.map