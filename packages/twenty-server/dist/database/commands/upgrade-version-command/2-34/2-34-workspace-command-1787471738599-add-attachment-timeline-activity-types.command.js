"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddAttachmentTimelineActivityTypesCommand", {
    enumerable: true,
    get: function() {
        return AddAttachmentTimelineActivityTypesCommand;
    }
});
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _hastimelineactivityobjectmetadatautil = require("./utils/has-timeline-activity-object-metadata.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
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
// Replaying 2.34 must not pick up attachment type changes from later releases.
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
let AddAttachmentTimelineActivityTypesCommand = class AddAttachmentTimelineActivityTypesCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const { flatFieldMetadataMaps, flatObjectMetadataMaps, flatTimelineActivityTypeMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps',
            'flatTimelineActivityTypeMaps'
        ]);
        if (!(0, _hastimelineactivityobjectmetadatautil.hasTimelineActivityObjectMetadata)(flatObjectMetadataMaps)) {
            this.logger.log(`timelineActivity object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const missingDefinitions = ATTACHMENT_TIMELINE_ACTIVITY_TYPES.filter(({ universalIdentifier })=>!(0, _utils.isDefined)(flatTimelineActivityTypeMaps.byUniversalIdentifier[universalIdentifier]));
        if (missingDefinitions.length === 0) {
            return;
        }
        const attachmentObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[ATTACHMENT_OBJECT_UNIVERSAL_IDENTIFIER];
        const preferredAttachmentTargetRelationFieldMetadata = flatFieldMetadataMaps.byUniversalIdentifier[ATTACHMENT_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER];
        const isAttachmentTargetMorphRelation = (fieldMetadata)=>(0, _utils.isDefined)(fieldMetadata) && (0, _utils.isDefined)(attachmentObjectMetadata) && fieldMetadata.objectMetadataId === attachmentObjectMetadata.id && fieldMetadata.type === _types.FieldMetadataType.MORPH_RELATION && fieldMetadata.morphId === ATTACHMENT_TARGET_MORPH_ID;
        const attachmentTargetRelationFieldMetadata = isAttachmentTargetMorphRelation(preferredAttachmentTargetRelationFieldMetadata) ? preferredAttachmentTargetRelationFieldMetadata : Object.values(flatFieldMetadataMaps.byUniversalIdentifier).find((fieldMetadata)=>isAttachmentTargetMorphRelation(fieldMetadata));
        if (!(0, _utils.isDefined)(attachmentTargetRelationFieldMetadata)) {
            this.logger.warn(`Attachment target morph relation does not exist for workspace ${workspaceId}, skipping attachment timeline activity types`);
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
            throw new Error(`Failed to add attachment timeline activity types for workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
        }
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddAttachmentTimelineActivityTypesCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.34.0', 1787471738599),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-34:add-attachment-timeline-activity-types',
        description: 'Add attachment link lifecycle events to record timelines'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddAttachmentTimelineActivityTypesCommand);

//# sourceMappingURL=2-34-workspace-command-1787471738599-add-attachment-timeline-activity-types.command.js.map