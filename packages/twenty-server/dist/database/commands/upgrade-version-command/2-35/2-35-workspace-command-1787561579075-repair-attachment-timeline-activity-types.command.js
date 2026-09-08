"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RepairAttachmentTimelineActivityTypesCommand", {
    enumerable: true,
    get: function() {
        return RepairAttachmentTimelineActivityTypesCommand;
    }
});
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _hastimelineactivityobjectmetadatautil = require("../2-34/utils/has-timeline-activity-object-metadata.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _isfieldmetadatasettingsoftypeutil = require("../../../../engine/metadata-modules/field-metadata/utils/is-field-metadata-settings-of-type.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER = '20202020-64aa-4b6f-b003-9c74b97cee20';
const ATTACHMENT_OBJECT_UNIVERSAL_IDENTIFIER = '20202020-bd3d-4c60-8dca-571c71d4447a';
const ATTACHMENT_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER = '721ddb1f-468d-535a-9809-cb3429a52e06';
const ATTACHMENT_TARGET_MORPH_ID = '20202020-f634-435d-ab8d-e1168b375c69';
const ATTACHMENT_TIMELINE_ACTIVITY_TYPES = [
    {
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c11',
        name: 'attachmentLinked',
        label: 'attached a file',
        action: 'linked',
        icon: 'IconPaperclip'
    },
    {
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c12',
        name: 'attachmentUnlinked',
        label: 'removed an attachment',
        action: 'unlinked',
        icon: 'IconUnlink'
    }
];
let RepairAttachmentTimelineActivityTypesCommand = class RepairAttachmentTimelineActivityTypesCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const { flatFieldMetadataMaps, flatObjectMetadataMaps, flatTimelineActivityTypeMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps',
            'flatTimelineActivityTypeMaps'
        ]);
        if (!(0, _hastimelineactivityobjectmetadatautil.hasTimelineActivityObjectMetadata)(flatObjectMetadataMaps)) {
            return;
        }
        const missingDefinitions = ATTACHMENT_TIMELINE_ACTIVITY_TYPES.filter(({ universalIdentifier })=>!(0, _utils.isDefined)(flatTimelineActivityTypeMaps.byUniversalIdentifier[universalIdentifier]));
        if (missingDefinitions.length === 0) {
            return;
        }
        const attachmentObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[ATTACHMENT_OBJECT_UNIVERSAL_IDENTIFIER];
        const attachmentTargetRelationFieldMetadata = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((fieldMetadata)=>this.isValidAttachmentTargetMorphRelation({
                attachmentObjectMetadataId: attachmentObjectMetadata?.id,
                fieldMetadata
            })).sort((firstFieldMetadata, secondFieldMetadata)=>{
            const firstIsPreferred = firstFieldMetadata.universalIdentifier === ATTACHMENT_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER;
            const secondIsPreferred = secondFieldMetadata.universalIdentifier === ATTACHMENT_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER;
            if (firstIsPreferred !== secondIsPreferred) {
                return firstIsPreferred ? -1 : 1;
            }
            return firstFieldMetadata.universalIdentifier.localeCompare(secondFieldMetadata.universalIdentifier);
        })[0];
        if (!(0, _utils.isDefined)(attachmentTargetRelationFieldMetadata)) {
            this.logger.warn(`No valid attachment target morph relation for workspace ${workspaceId}, skipping`);
            return;
        }
        if (options.dryRun ?? false) {
            this.logger.log(`[DRY RUN] Would add ${missingDefinitions.length} attachment timeline activity types for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const now = new Date().toISOString();
        const flatTimelineActivityTypesToCreate = missingDefinitions.map((definition)=>({
                id: (0, _uuid.v4)(),
                workspaceId,
                applicationId: twentyStandardFlatApplication.id,
                applicationUniversalIdentifier: STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
                universalIdentifier: definition.universalIdentifier,
                name: definition.name,
                label: definition.label,
                action: definition.action,
                icon: definition.icon,
                frontComponentUniversalIdentifier: null,
                objectUniversalIdentifier: ATTACHMENT_OBJECT_UNIVERSAL_IDENTIFIER,
                targetRelationFieldUniversalIdentifier: attachmentTargetRelationFieldMetadata.universalIdentifier,
                triggerFieldUniversalIdentifiers: null,
                happensAtFieldUniversalIdentifier: null,
                replacesTimelineActivityTypeUniversalIdentifier: null,
                isActive: true,
                overrides: null,
                createdAt: now,
                updatedAt: now
            }));
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            allFlatEntityOperationByMetadataName: {
                timelineActivityType: {
                    flatEntityToCreate: flatTimelineActivityTypesToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (result.status === 'fail') {
            throw new Error(`Failed to repair attachment timeline activity types for workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
        }
    }
    isValidAttachmentTargetMorphRelation({ attachmentObjectMetadataId, fieldMetadata }) {
        return (0, _utils.isDefined)(attachmentObjectMetadataId) && fieldMetadata.objectMetadataId === attachmentObjectMetadataId && fieldMetadata.type === _types.FieldMetadataType.MORPH_RELATION && fieldMetadata.morphId === ATTACHMENT_TARGET_MORPH_ID && (0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(fieldMetadata.settings, _types.FieldMetadataType.MORPH_RELATION) && fieldMetadata.settings.relationType === _types.RelationType.MANY_TO_ONE && (0, _utils.isDefined)(fieldMetadata.relationTargetObjectMetadataId) && (0, _utils.isDefined)(fieldMetadata.relationTargetFieldMetadataId);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
RepairAttachmentTimelineActivityTypesCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.35.0', 1787561579075),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-35:repair-attachment-timeline-activity-types',
        description: 'Repair attachment timeline activity types in workspaces whose attachment target morph only contains custom fields'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], RepairAttachmentTimelineActivityTypesCommand);

//# sourceMappingURL=2-35-workspace-command-1787561579075-repair-attachment-timeline-activity-types.command.js.map