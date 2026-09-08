"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RepairActivityTargetsJunctionTargetCommand", {
    enumerable: true,
    get: function() {
        return RepairActivityTargetsJunctionTargetCommand;
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
const LEGACY_NOTE_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER = '20202020-38ca-4aab-92f5-8a605ca2e4c5';
const LEGACY_TASK_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER = '20202020-c8a0-4e85-a016-87e2349cfbec';
const ACTIVITY_JUNCTIONS = [
    {
        label: 'note.noteTargets',
        junctionRelationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.fields.noteTargets.universalIdentifier,
        targetMorphId: _metadata.STANDARD_OBJECTS.noteTarget.morphIds.targetMorphId.morphId,
        preferredTargetFieldUniversalIdentifiers: [
            _metadata.STANDARD_OBJECTS.noteTarget.fields.targetPerson.universalIdentifier,
            LEGACY_NOTE_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER
        ]
    },
    {
        label: 'task.taskTargets',
        junctionRelationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.task.fields.taskTargets.universalIdentifier,
        targetMorphId: _metadata.STANDARD_OBJECTS.taskTarget.morphIds.targetMorphId.morphId,
        preferredTargetFieldUniversalIdentifiers: [
            _metadata.STANDARD_OBJECTS.taskTarget.fields.targetPerson.universalIdentifier,
            LEGACY_TASK_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER
        ]
    }
];
let RepairActivityTargetsJunctionTargetCommand = class RepairActivityTargetsJunctionTargetCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const repairedLabels = await this.fieldMetadataRepository.manager.transaction(async (entityManager)=>{
            const fieldMetadataRepository = entityManager.getRepository(_fieldmetadataentity.FieldMetadataEntity);
            const activeFieldMetadatas = await fieldMetadataRepository.find({
                where: {
                    workspaceId,
                    isActive: true
                },
                order: {
                    universalIdentifier: 'ASC'
                }
            });
            const repairedLabels = [];
            for (const activityJunction of ACTIVITY_JUNCTIONS){
                const repaired = await this.repairActivityJunction({
                    activityJunction,
                    activeFieldMetadatas,
                    fieldMetadataRepository,
                    isDryRun,
                    workspaceId
                });
                if (repaired) {
                    repairedLabels.push(activityJunction.label);
                }
            }
            return repairedLabels;
        });
        if (repairedLabels.length === 0) {
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] Would repair' : 'Repaired'} ${repairedLabels.join(', ')} junction target for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        await (0, _invalidatefieldmetadatacacheutil.invalidateFieldMetadataCache)({
            workspaceId,
            workspaceMigrationRunnerService: this.workspaceMigrationRunnerService
        });
    }
    async repairActivityJunction({ activityJunction, activeFieldMetadatas, fieldMetadataRepository, isDryRun, workspaceId }) {
        const junctionRelationFieldMetadata = activeFieldMetadatas.find(({ universalIdentifier })=>universalIdentifier === activityJunction.junctionRelationFieldUniversalIdentifier);
        if (!(0, _utils.isDefined)(junctionRelationFieldMetadata)) {
            return false;
        }
        const junctionTargetFieldMetadatas = activeFieldMetadatas.filter((fieldMetadata)=>this.isValidJunctionTargetFieldMetadata({
                activityJunction,
                fieldMetadata,
                junctionRelationFieldMetadata
            })).sort((firstFieldMetadata, secondFieldMetadata)=>this.getTargetFieldPriority({
                activityJunction,
                fieldMetadata: firstFieldMetadata
            }) - this.getTargetFieldPriority({
                activityJunction,
                fieldMetadata: secondFieldMetadata
            }));
        const junctionTargetFieldMetadata = junctionTargetFieldMetadatas[0];
        if (!(0, _utils.isDefined)(junctionTargetFieldMetadata)) {
            this.logger.warn(`No valid junction target field for ${activityJunction.label} in workspace ${workspaceId}, skipping`);
            return false;
        }
        const lockedJunctionRelationFieldMetadata = await fieldMetadataRepository.findOne({
            where: {
                id: junctionRelationFieldMetadata.id,
                workspaceId
            },
            lock: {
                mode: 'pessimistic_write'
            }
        });
        if (!(0, _utils.isDefined)(lockedJunctionRelationFieldMetadata) || !(0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(lockedJunctionRelationFieldMetadata.settings, _types.FieldMetadataType.RELATION) || lockedJunctionRelationFieldMetadata.settings.relationType !== _types.RelationType.ONE_TO_MANY) {
            this.logger.warn(`${activityJunction.label} is no longer a one to many relation for workspace ${workspaceId}, skipping`);
            return false;
        }
        const lockedJunctionRelationSettings = lockedJunctionRelationFieldMetadata.settings;
        if (junctionTargetFieldMetadatas.some(({ id })=>id === lockedJunctionRelationSettings.junctionTargetFieldId)) {
            return false;
        }
        if (isDryRun) {
            return true;
        }
        await fieldMetadataRepository.update({
            id: lockedJunctionRelationFieldMetadata.id,
            workspaceId
        }, {
            settings: {
                ...lockedJunctionRelationSettings,
                junctionTargetFieldId: junctionTargetFieldMetadata.id
            }
        });
        return true;
    }
    isValidJunctionTargetFieldMetadata({ activityJunction, fieldMetadata, junctionRelationFieldMetadata }) {
        if (!(0, _utils.isDefined)(junctionRelationFieldMetadata.relationTargetObjectMetadataId) || fieldMetadata.objectMetadataId !== junctionRelationFieldMetadata.relationTargetObjectMetadataId) {
            return false;
        }
        if (fieldMetadata.type === _types.FieldMetadataType.MORPH_RELATION) {
            return fieldMetadata.morphId === activityJunction.targetMorphId && (0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(fieldMetadata.settings, _types.FieldMetadataType.MORPH_RELATION) && fieldMetadata.settings.relationType === _types.RelationType.MANY_TO_ONE;
        }
        return fieldMetadata.type === _types.FieldMetadataType.RELATION && activityJunction.preferredTargetFieldUniversalIdentifiers.includes(fieldMetadata.universalIdentifier) && (0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(fieldMetadata.settings, _types.FieldMetadataType.RELATION) && fieldMetadata.settings.relationType === _types.RelationType.MANY_TO_ONE;
    }
    getTargetFieldPriority({ activityJunction, fieldMetadata }) {
        const preferredIndex = activityJunction.preferredTargetFieldUniversalIdentifiers.indexOf(fieldMetadata.universalIdentifier);
        return preferredIndex === -1 ? Number.MAX_SAFE_INTEGER : preferredIndex;
    }
    constructor(workspaceIteratorService, workspaceMigrationRunnerService, fieldMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.fieldMetadataRepository = fieldMetadataRepository;
    }
};
RepairActivityTargetsJunctionTargetCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.34.0', 1787461587487),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-34:repair-activity-targets-junction-target',
        description: 'Repair note and task activity junction target settings when the target morph only contains custom object fields.'
    }),
    _ts_param(2, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], RepairActivityTargetsJunctionTargetCommand);

//# sourceMappingURL=2-34-workspace-command-1787461587487-repair-activity-targets-junction-target.command.js.map