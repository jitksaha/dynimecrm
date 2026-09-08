"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddMessageCampaignNameFieldCommand", {
    enumerable: true,
    get: function() {
        return AddMessageCampaignNameFieldCommand;
    }
});
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
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
const CAMPAIGN = _metadata.STANDARD_OBJECTS.messageCampaign;
const NAME_FIELD_UNIVERSAL_IDENTIFIER = CAMPAIGN.fields.name.universalIdentifier;
const SUBJECT_FIELD_UNIVERSAL_IDENTIFIER = CAMPAIGN.fields.subject.universalIdentifier;
const NAME_VIEW_FIELD_UNIVERSAL_IDENTIFIER = CAMPAIGN.views.allMessageCampaigns.viewFields.name.universalIdentifier;
const SEARCHED_FIELD_UNIVERSAL_IDENTIFIERS = [
    NAME_FIELD_UNIVERSAL_IDENTIFIER,
    SUBJECT_FIELD_UNIVERSAL_IDENTIFIER
];
let AddMessageCampaignNameFieldCommand = class AddMessageCampaignNameFieldCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatViewMaps, flatViewFieldMaps, flatSearchFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatSearchFieldMetadataMaps'
        ]);
        const campaignObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: CAMPAIGN.universalIdentifier
        });
        if (!(0, _utils.isDefined)(campaignObjectMetadata)) {
            this.logger.log(`messageCampaign object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const fieldsToCreate = [];
        if (!(0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[NAME_FIELD_UNIVERSAL_IDENTIFIER])) {
            const standardNameField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
                universalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER
            });
            if (!(0, _utils.isDefined)(standardNameField)) {
                throw new Error('Standard application is missing the messageCampaign name field');
            }
            fieldsToCreate.push(standardNameField);
        }
        // Move the label identifier from subject to name, but never clobber a
        // user customization pointing at another field.
        const currentLabelIdentifier = campaignObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier;
        const isNameLabelIdentifier = !(0, _utils.isDefined)(currentLabelIdentifier) || currentLabelIdentifier === SUBJECT_FIELD_UNIVERSAL_IDENTIFIER || currentLabelIdentifier === NAME_FIELD_UNIVERSAL_IDENTIFIER;
        const flatObjectMetadataToUpdate = isNameLabelIdentifier && currentLabelIdentifier !== NAME_FIELD_UNIVERSAL_IDENTIFIER ? [
            {
                ...campaignObjectMetadata,
                labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER
            }
        ] : [];
        const viewFieldsToCreate = [];
        if (!(0, _utils.isDefined)(flatViewFieldMaps.byUniversalIdentifier[NAME_VIEW_FIELD_UNIVERSAL_IDENTIFIER])) {
            const standardNameViewField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: standardAllFlatEntityMaps.flatViewFieldMaps,
                universalIdentifier: NAME_VIEW_FIELD_UNIVERSAL_IDENTIFIER
            });
            if (!(0, _utils.isDefined)(standardNameViewField)) {
                throw new Error('Standard application is missing the messageCampaign name view column');
            }
            const campaignIndexFlatView = campaignObjectMetadata.viewUniversalIdentifiers.map((viewUniversalIdentifier)=>flatViewMaps.byUniversalIdentifier[viewUniversalIdentifier]).filter(_utils.isDefined).find((flatView)=>flatView.key === _types.ViewKey.INDEX && !(0, _utils.isDefined)(flatView.deletedAt));
            if ((0, _utils.isDefined)(campaignIndexFlatView)) {
                viewFieldsToCreate.push({
                    ...standardNameViewField,
                    viewUniversalIdentifier: campaignIndexFlatView.universalIdentifier,
                    position: this.computeNameViewFieldPosition({
                        campaignIndexFlatView,
                        flatViewFieldMaps,
                        standardNameViewField,
                        isNameLabelIdentifier
                    })
                });
            } else {
                this.logger.warn(`No INDEX view found for messageCampaign in workspace ${workspaceId}, skipping the name view column`);
            }
        }
        const searchFieldMetadatasToCreate = this.computeSearchFieldMetadatasToCreate({
            flatSearchFieldMetadataMaps,
            standardFlatSearchFieldMetadataMaps: standardAllFlatEntityMaps.flatSearchFieldMetadataMaps,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        const totalOperationCount = fieldsToCreate.length + viewFieldsToCreate.length + searchFieldMetadatasToCreate.length + flatObjectMetadataToUpdate.length;
        if (totalOperationCount === 0) {
            this.logger.log(`messageCampaign name field already configured for workspace ${workspaceId}, skipping`);
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Workspace ${workspaceId}: ${fieldsToCreate.length} field(s), ${viewFieldsToCreate.length} view column(s), ${searchFieldMetadatasToCreate.length} search field(s), ${flatObjectMetadataToUpdate.length} label identifier update(s)`);
            return;
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: fieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: viewFieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                objectMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: flatObjectMetadataToUpdate
                },
                searchFieldMetadata: {
                    flatEntityToCreate: searchFieldMetadatasToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (result.status === 'fail') {
            this.logger.error(`Failed to add the messageCampaign name field:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to add the messageCampaign name field for workspace ${workspaceId}`);
        }
        this.logger.log(`Added the messageCampaign name field for workspace ${workspaceId}`);
    }
    // The standard positions assume a freshly provisioned view, where name comes
    // first and everything else is shifted by one. Existing views keep subject at
    // position 0, so name is placed relative to the columns already there: below
    // all of them when it becomes the label identifier (the validator requires
    // it), above all of them otherwise (the validator forbids anything below the
    // label identifier).
    computeNameViewFieldPosition({ campaignIndexFlatView, flatViewFieldMaps, standardNameViewField, isNameLabelIdentifier }) {
        const otherViewFieldPositions = campaignIndexFlatView.viewFieldUniversalIdentifiers.map((viewFieldUniversalIdentifier)=>flatViewFieldMaps.byUniversalIdentifier[viewFieldUniversalIdentifier]).filter(_utils.isDefined).map(({ position })=>position);
        if (otherViewFieldPositions.length === 0) {
            return standardNameViewField.position;
        }
        return isNameLabelIdentifier ? Math.min(...otherViewFieldPositions) - 1 : Math.max(...otherViewFieldPositions) + 1;
    }
    computeSearchFieldMetadatasToCreate({ flatSearchFieldMetadataMaps, standardFlatSearchFieldMetadataMaps, applicationUniversalIdentifier }) {
        return SEARCHED_FIELD_UNIVERSAL_IDENTIFIERS.flatMap((fieldMetadataUniversalIdentifier)=>{
            const searchFieldUniversalIdentifier = (0, _application.getSearchFieldUniversalIdentifier)({
                applicationUniversalIdentifier,
                fieldMetadataUniversalIdentifier
            });
            if ((0, _utils.isDefined)(flatSearchFieldMetadataMaps.byUniversalIdentifier[searchFieldUniversalIdentifier])) {
                return [];
            }
            const standardFlatSearchFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: standardFlatSearchFieldMetadataMaps,
                universalIdentifier: searchFieldUniversalIdentifier
            });
            if (!(0, _utils.isDefined)(standardFlatSearchFieldMetadata)) {
                throw new Error(`Standard application is missing the messageCampaign search field for field ${fieldMetadataUniversalIdentifier}`);
            }
            return [
                standardFlatSearchFieldMetadata
            ];
        });
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddMessageCampaignNameFieldCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.25.0', 1785229970000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-25:add-message-campaign-name-field',
        description: 'Add the internal name field to messageCampaign, surface it in the all campaigns view, index it in the search vector and make it the label identifier (was subject) on existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddMessageCampaignNameFieldCommand);

//# sourceMappingURL=2-25-workspace-command-1785229970000-add-message-campaign-name-field.command.js.map