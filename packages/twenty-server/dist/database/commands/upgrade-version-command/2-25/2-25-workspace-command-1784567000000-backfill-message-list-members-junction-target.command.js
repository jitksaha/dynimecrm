"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillMessageListMembersJunctionTargetCommand", {
    enumerable: true,
    get: function() {
        return BackfillMessageListMembersJunctionTargetCommand;
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
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _isfieldmetadatasettingsoftypeutil = require("../../../../engine/metadata-modules/field-metadata/utils/is-field-metadata-settings-of-type.util");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _getmetadataserializedrelationnamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-serialized-relation-names.util");
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
const MEMBERS_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.messageList.fields.members.universalIdentifier;
const PERSON_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.messageListMember.fields.person.universalIdentifier;
let BackfillMessageListMembersJunctionTargetCommand = class BackfillMessageListMembersJunctionTargetCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        const membersFlatFieldMetadata = flatFieldMetadataMaps.byUniversalIdentifier[MEMBERS_FIELD_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(membersFlatFieldMetadata)) {
            this.logger.log(`No messageList.members field for workspace ${workspaceId}, skipping`);
            return;
        }
        const currentSettings = membersFlatFieldMetadata.settings;
        if (!(0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(currentSettings, _types.FieldMetadataType.RELATION)) {
            this.logger.warn(`messageList.members has no relation settings for workspace ${workspaceId}, skipping`);
            return;
        }
        if ((0, _utils.isDefined)(currentSettings.junctionTargetFieldId)) {
            this.logger.log(`messageList.members junction target already set for workspace ${workspaceId}, skipping`);
            return;
        }
        const personFlatFieldMetadata = flatFieldMetadataMaps.byUniversalIdentifier[PERSON_FIELD_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(personFlatFieldMetadata)) {
            this.logger.warn(`No messageListMember.person field for workspace ${workspaceId}, skipping`);
            return;
        }
        const updatedSettings = {
            ...currentSettings,
            junctionTargetFieldId: personFlatFieldMetadata.id
        };
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Backfilling messageList.members junction target for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        await this.fieldMetadataRepository.update({
            id: membersFlatFieldMetadata.id,
            workspaceId
        }, {
            settings: updatedSettings
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
        this.logger.log(`Backfilled messageList.members junction target for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationRunnerService, fieldMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.fieldMetadataRepository = fieldMetadataRepository;
    }
};
BackfillMessageListMembersJunctionTargetCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.25.0', 1784567000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-25:backfill-message-list-members-junction-target',
        description: 'Backfill the junction target field id on messageList.members for workspaces provisioned before it was declared, so the record page renders the members junction picker.'
    }),
    _ts_param(3, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], BackfillMessageListMembersJunctionTargetCommand);

//# sourceMappingURL=2-25-workspace-command-1784567000000-backfill-message-list-members-junction-target.command.js.map