"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillDeterministicFieldUniversalIdentifiersCommand", {
    enumerable: true,
    get: function() {
        return BackfillDeterministicFieldUniversalIdentifiersCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationentity = require("../../../../engine/core-modules/application/application.entity");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _getmetadataserializedrelationnamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-serialized-relation-names.util");
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
// Server-owned system field names: their universal identifiers are taken
// over for every application, whatever value they currently hold, since
// validateObjectMetadataSystemFieldsIntegrity now rejects any non-derived
// value at sync time. Fields are picked explicitly so system fields added to
// PARTIAL_SYSTEM_FLAT_FIELD_METADATAS later never alter this shipped
// migration.
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
// The name field is a default field, not a system field: it is only taken
// over where it is guaranteed to be auto-provisioned (workspace-custom
// objects). For installed applications authors may define it themselves, so
// only legacy SDK-derived values are converged; for the standard application
// it is author-provided in STANDARD_OBJECTS and keeps its hardcoded value.
const NAME_FIELD_NAME = 'name';
const DEFAULT_RELATION_FORWARD_FIELD_NAMES = new Set([
    'timelineActivities',
    'attachments',
    'noteTargets',
    'taskTargets'
]);
const DEFAULT_RELATION_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS = new Set([
    _metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier,
    _metadata.STANDARD_OBJECTS.attachment.universalIdentifier,
    _metadata.STANDARD_OBJECTS.noteTarget.universalIdentifier,
    _metadata.STANDARD_OBJECTS.taskTarget.universalIdentifier
]);
// Namespace the SDK used before default field universal identifiers were
// aligned with getFieldUniversalIdentifier; only rows still carrying a
// legacy-derived value are backfilled for installed applications, so
// author-provided identifiers are left untouched.
const LEGACY_SDK_UNIVERSAL_IDENTIFIER_NAMESPACE = '142046f0-4d80-48b5-ad56-26ad410e895c';
const computeLegacySdkDefaultFieldUniversalIdentifier = ({ objectUniversalIdentifier, fieldName })=>(0, _uuid.v5)(`${objectUniversalIdentifier}-${fieldName}`, LEGACY_SDK_UNIVERSAL_IDENTIFIER_NAMESPACE);
const isMorphOrRelationFieldMetadataType = (type)=>type === _types.FieldMetadataType.RELATION || type === _types.FieldMetadataType.MORPH_RELATION;
let BackfillDeterministicFieldUniversalIdentifiersCommand = class BackfillDeterministicFieldUniversalIdentifiersCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
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
        const updates = [];
        for (const flatFieldMetadata of Object.values(flatFieldMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatFieldMetadata)) {
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
            const shouldBackfill = this.shouldBackfillFieldMetadata({
                flatFieldMetadata,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                twentyStandardApplicationId: twentyStandardFlatApplication.id,
                workspaceCustomApplicationId: workspaceCustomFlatApplication.id
            });
            if (!shouldBackfill) {
                continue;
            }
            const newUniversalIdentifier = (0, _application.getFieldUniversalIdentifier)({
                applicationUniversalIdentifier,
                objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
                name: flatFieldMetadata.name
            });
            if (newUniversalIdentifier === flatFieldMetadata.universalIdentifier) {
                continue;
            }
            updates.push({
                id: flatFieldMetadata.id,
                newUniversalIdentifier
            });
        }
        if (updates.length === 0) {
            this.logger.log(`No field universal identifiers to backfill for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Backfilling ${updates.length} field universal identifier(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        await this.fieldMetadataRepository.manager.transaction(async (entityManager)=>{
            const transactionalFieldMetadataRepository = entityManager.getRepository(_fieldmetadataentity.FieldMetadataEntity);
            for (const { id, newUniversalIdentifier } of updates){
                await transactionalFieldMetadataRepository.update({
                    id,
                    workspaceId
                }, {
                    universalIdentifier: newUniversalIdentifier
                });
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
        this.logger.log(`Backfilled ${updates.length} field universal identifier(s) for workspace ${workspaceId}`);
    }
    shouldBackfillFieldMetadata({ flatFieldMetadata, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, twentyStandardApplicationId, workspaceCustomApplicationId }) {
        // System field universal identifiers are server-owned: they are taken
        // over for every application. Sync now rejects non-derived values
        // (validateObjectMetadataSystemFieldsIntegrity), so converging every row
        // here is both safe and required.
        if (SYSTEM_FIELD_NAMES.has(flatFieldMetadata.name)) {
            return true;
        }
        // Standard application: every non-system standard field (including name)
        // is author-provided in STANDARD_OBJECTS and keeps its hardcoded value.
        if (flatFieldMetadata.applicationId === twentyStandardApplicationId) {
            return false;
        }
        const relationTargetFlatObjectMetadata = (0, _utils.isDefined)(flatFieldMetadata.relationTargetObjectMetadataId) ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityMaps: flatObjectMetadataMaps,
            flatEntityId: flatFieldMetadata.relationTargetObjectMetadataId
        }) : undefined;
        if (flatFieldMetadata.applicationId === workspaceCustomApplicationId) {
            if (flatFieldMetadata.name === NAME_FIELD_NAME) {
                return true;
            }
            if (!isMorphOrRelationFieldMetadataType(flatFieldMetadata.type)) {
                return false;
            }
            // Forward default relation fields on custom objects (attachments,
            // noteTargets, taskTargets, timelineActivities).
            if (DEFAULT_RELATION_FORWARD_FIELD_NAMES.has(flatFieldMetadata.name) && (0, _utils.isDefined)(relationTargetFlatObjectMetadata) && DEFAULT_RELATION_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.has(relationTargetFlatObjectMetadata.universalIdentifier)) {
                return true;
            }
            // Reverse default relation fields living on the standard relation
            // objects and pointing back at the custom object.
            if (DEFAULT_RELATION_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.has(flatObjectMetadata.universalIdentifier) && (0, _utils.isDefined)(relationTargetFlatObjectMetadata) && (flatFieldMetadata.name === `target${(0, _utils.capitalize)(relationTargetFlatObjectMetadata.nameSingular)}` || flatFieldMetadata.name === relationTargetFlatObjectMetadata.nameSingular)) {
                return true;
            }
            return false;
        }
        // Installed applications, remaining auto-provisioned fields (injected
        // name field and default relation fields): only rows still carrying an
        // SDK-auto-generated (legacy derivation) identifier are backfilled;
        // author-provided identifiers must keep matching the application source
        // code.
        const legacyDefaultUniversalIdentifier = computeLegacySdkDefaultFieldUniversalIdentifier({
            objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            fieldName: flatFieldMetadata.name
        });
        if (flatFieldMetadata.universalIdentifier === legacyDefaultUniversalIdentifier) {
            return true;
        }
        // Legacy reverse default relation fields were derived from the custom
        // object universal identifier and the forward field name suffixed with
        // "Inverse".
        const relationTargetFlatFieldMetadata = (0, _utils.isDefined)(flatFieldMetadata.relationTargetFieldMetadataId) ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityMaps: flatFieldMetadataMaps,
            flatEntityId: flatFieldMetadata.relationTargetFieldMetadataId
        }) : undefined;
        if ((0, _utils.isDefined)(relationTargetFlatObjectMetadata) && (0, _utils.isDefined)(relationTargetFlatFieldMetadata)) {
            const legacyReverseUniversalIdentifier = computeLegacySdkDefaultFieldUniversalIdentifier({
                objectUniversalIdentifier: relationTargetFlatObjectMetadata.universalIdentifier,
                fieldName: `${relationTargetFlatFieldMetadata.name}Inverse`
            });
            if (flatFieldMetadata.universalIdentifier === legacyReverseUniversalIdentifier) {
                return true;
            }
        }
        return false;
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationRunnerService, applicationRepository, fieldMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.applicationRepository = applicationRepository, this.fieldMetadataRepository = fieldMetadataRepository;
    }
};
BackfillDeterministicFieldUniversalIdentifiersCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.19.0', 1783100000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-19:backfill-deterministic-field-universal-identifiers',
        description: 'Recompute the universal identifier of auto-provisioned field metadata (system fields and default relation fields) to the deterministic getFieldUniversalIdentifier derivation.'
    }),
    _ts_param(4, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_param(5, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], BackfillDeterministicFieldUniversalIdentifiersCommand);

//# sourceMappingURL=2-19-workspace-command-1783100000000-backfill-deterministic-field-universal-identifiers.command.js.map