"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillActivityTargetsJunctionTargetCommand", {
    enumerable: true,
    get: function() {
        return BackfillActivityTargetsJunctionTargetCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _invalidatefieldmetadatacacheutil = require("../utils/invalidate-field-metadata-cache.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _isfieldmetadatasettingsoftypeutil = require("../../../../engine/metadata-modules/field-metadata/utils/is-field-metadata-settings-of-type.util");
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
// These identifiers predate deterministic system relation identifiers and
// remain in standard workspaces provisioned before that migration.
const LEGACY_NOTE_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER = '20202020-38ca-4aab-92f5-8a605ca2e4c5';
const LEGACY_TASK_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER = '20202020-c8a0-4e85-a016-87e2349cfbec';
// The junction target points at one member of the target morph. Consumers expand
// the whole morph group from it, so any member identifies the polymorphic edge.
const ACTIVITY_JUNCTIONS = [
    {
        label: 'note.noteTargets',
        junctionRelationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.fields.noteTargets.universalIdentifier,
        junctionTargetFieldUniversalIdentifiers: [
            _metadata.STANDARD_OBJECTS.noteTarget.fields.targetPerson.universalIdentifier,
            LEGACY_NOTE_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER
        ]
    },
    {
        label: 'task.taskTargets',
        junctionRelationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.task.fields.taskTargets.universalIdentifier,
        junctionTargetFieldUniversalIdentifiers: [
            _metadata.STANDARD_OBJECTS.taskTarget.fields.targetPerson.universalIdentifier,
            LEGACY_TASK_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER
        ]
    }
];
let BackfillActivityTargetsJunctionTargetCommand = class BackfillActivityTargetsJunctionTargetCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        const backfills = ACTIVITY_JUNCTIONS.map((activityJunction)=>this.resolveBackfill({
                activityJunction,
                flatFieldMetadataMaps,
                workspaceId
            })).filter(_utils.isDefined);
        if (backfills.length === 0) {
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Backfilling ${backfills.map(({ label })=>label).join(', ')} junction target for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const updatedFieldMetadataIds = await this.applyBackfills({
            backfills,
            workspaceId
        });
        if (updatedFieldMetadataIds.length === 0) {
            this.logger.warn(`No activity junction field was updated for workspace ${workspaceId}, its metadata changed since the cache was computed`);
            return;
        }
        await (0, _invalidatefieldmetadatacacheutil.invalidateFieldMetadataCache)({
            workspaceId,
            workspaceMigrationRunnerService: this.workspaceMigrationRunnerService
        });
    }
    // Both activity junctions are written together so an interrupted upgrade never
    // leaves notes migrated and tasks not, which would be invisible until a rerun.
    async applyBackfills({ backfills, workspaceId }) {
        return this.fieldMetadataRepository.manager.transaction(async (entityManager)=>{
            const fieldMetadataRepository = entityManager.getRepository(_fieldmetadataentity.FieldMetadataEntity);
            const updatedFieldMetadataIds = [];
            for (const { label, junctionRelationFieldMetadataId, junctionTargetFieldMetadataId } of backfills){
                // Re-read under the transaction: the cache the resolution ran against
                // can lag the row, and settings is overwritten as a whole document.
                const fieldMetadata = await fieldMetadataRepository.findOne({
                    where: {
                        id: junctionRelationFieldMetadataId,
                        workspaceId
                    },
                    lock: {
                        mode: 'pessimistic_write'
                    }
                });
                if (!(0, _utils.isDefined)(fieldMetadata) || !(0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(fieldMetadata.settings, _types.FieldMetadataType.RELATION) || fieldMetadata.settings.relationType !== _types.RelationType.ONE_TO_MANY) {
                    this.logger.warn(`${label} is no longer a one to many relation for workspace ${workspaceId}, skipping`);
                    continue;
                }
                await fieldMetadataRepository.update({
                    id: junctionRelationFieldMetadataId,
                    workspaceId
                }, {
                    settings: {
                        ...fieldMetadata.settings,
                        junctionTargetFieldId: junctionTargetFieldMetadataId
                    }
                });
                updatedFieldMetadataIds.push(junctionRelationFieldMetadataId);
            }
            return updatedFieldMetadataIds;
        });
    }
    // Mirrors validateJunctionTargetSettings so the backfill can never write a
    // setting the metadata layer would have rejected on a normal field update.
    resolveBackfill({ activityJunction, flatFieldMetadataMaps, workspaceId }) {
        const { label, junctionRelationFieldUniversalIdentifier, junctionTargetFieldUniversalIdentifiers } = activityJunction;
        const junctionRelationFlatFieldMetadata = flatFieldMetadataMaps.byUniversalIdentifier[junctionRelationFieldUniversalIdentifier];
        if (!(0, _utils.isDefined)(junctionRelationFlatFieldMetadata)) {
            this.logger.log(`No ${label} field for workspace ${workspaceId}, skipping`);
            return undefined;
        }
        const junctionRelationSettings = junctionRelationFlatFieldMetadata.settings;
        if (!(0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(junctionRelationSettings, _types.FieldMetadataType.RELATION) || junctionRelationSettings.relationType !== _types.RelationType.ONE_TO_MANY) {
            this.logger.warn(`${label} is not a one to many relation for workspace ${workspaceId}, skipping`);
            return undefined;
        }
        const junctionTargetFlatFieldMetadata = junctionTargetFieldUniversalIdentifiers.map((universalIdentifier)=>flatFieldMetadataMaps.byUniversalIdentifier[universalIdentifier]).find(_utils.isDefined);
        if (!(0, _utils.isDefined)(junctionTargetFlatFieldMetadata)) {
            this.logger.warn(`No junction target field for ${label} in workspace ${workspaceId}, skipping`);
            return undefined;
        }
        if (junctionTargetFlatFieldMetadata.objectMetadataId !== junctionRelationFlatFieldMetadata.relationTargetObjectMetadataId) {
            this.logger.warn(`Junction target field for ${label} is not on the junction object in workspace ${workspaceId}, skipping`);
            return undefined;
        }
        const junctionTargetSettings = junctionTargetFlatFieldMetadata.settings;
        const isMorphTarget = junctionTargetFlatFieldMetadata.type === _types.FieldMetadataType.MORPH_RELATION;
        if (!isMorphTarget && (!(0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(junctionTargetSettings, _types.FieldMetadataType.RELATION) || junctionTargetSettings.relationType !== _types.RelationType.MANY_TO_ONE)) {
            this.logger.warn(`Junction target field for ${label} is not a many to one relation in workspace ${workspaceId}, skipping`);
            return undefined;
        }
        const currentJunctionTargetFieldId = junctionRelationSettings.junctionTargetFieldId;
        // A dangling id is repaired: it resolves to nothing, so leaving it in place
        // keeps the junction unusable while looking configured.
        if ((0, _utils.isDefined)(currentJunctionTargetFieldId) && (0, _utils.isDefined)(flatFieldMetadataMaps.universalIdentifierById[currentJunctionTargetFieldId])) {
            this.logger.log(`${label} junction target already set for workspace ${workspaceId}, skipping`);
            return undefined;
        }
        return {
            label,
            junctionRelationFieldMetadataId: junctionRelationFlatFieldMetadata.id,
            junctionTargetFieldMetadataId: junctionTargetFlatFieldMetadata.id
        };
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationRunnerService, fieldMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.fieldMetadataRepository = fieldMetadataRepository;
    }
};
BackfillActivityTargetsJunctionTargetCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.33.0', 1787123540000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-33:backfill-activity-targets-junction-target',
        description: 'Backfill the junction target field id on note.noteTargets and task.taskTargets for workspaces provisioned before it was declared, so activity targets are recognised as junction relations.'
    }),
    _ts_param(3, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], BackfillActivityTargetsJunctionTargetCommand);

//# sourceMappingURL=2-33-workspace-command-1787123540000-backfill-activity-targets-junction-target.command.js.map