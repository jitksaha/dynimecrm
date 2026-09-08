"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddMessageCampaignStatFieldsCommand", {
    enumerable: true,
    get: function() {
        return AddMessageCampaignStatFieldsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
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
const CAMPAIGN = _metadata.STANDARD_OBJECTS.messageCampaign;
const STAT_FIELD_UNIVERSAL_IDENTIFIERS = [
    CAMPAIGN.fields.sentCount.universalIdentifier,
    CAMPAIGN.fields.failedCount.universalIdentifier,
    CAMPAIGN.fields.bouncedCount.universalIdentifier,
    CAMPAIGN.fields.complainedCount.universalIdentifier
];
// The allMessageCampaigns view is introduced by this feature, so existing
// workspaces have no messageCampaign view at all. Create the view and its
// columns (not just the stat columns) so it materializes end to end.
const CAMPAIGN_VIEW_UNIVERSAL_IDENTIFIER = CAMPAIGN.views.allMessageCampaigns.universalIdentifier;
const CAMPAIGN_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = Object.values(CAMPAIGN.views.allMessageCampaigns.viewFields).map((viewField)=>viewField.universalIdentifier);
let AddMessageCampaignStatFieldsCommand = class AddMessageCampaignStatFieldsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps, flatObjectMetadataMaps, flatViewMaps, flatViewFieldMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps',
            'flatViewMaps',
            'flatViewFieldMaps'
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
        const fieldsToCreate = STAT_FIELD_UNIVERSAL_IDENTIFIERS.filter((universalIdentifier)=>!(0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[universalIdentifier])).map((universalIdentifier)=>{
            const standardField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
                universalIdentifier
            });
            if (!(0, _utils.isDefined)(standardField)) {
                throw new Error(`Standard application is missing messageCampaign field ${universalIdentifier}`);
            }
            return standardField;
        });
        const viewsToCreate = this.resolveViewsToCreate({
            flatViewMaps,
            standardAllFlatEntityMaps
        });
        const viewFieldsToCreate = CAMPAIGN_VIEW_FIELD_UNIVERSAL_IDENTIFIERS.filter((universalIdentifier)=>!(0, _utils.isDefined)(flatViewFieldMaps.byUniversalIdentifier[universalIdentifier])).flatMap((universalIdentifier)=>{
            const standardViewField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: standardAllFlatEntityMaps.flatViewFieldMaps,
                universalIdentifier
            });
            if (!(0, _utils.isDefined)(standardViewField)) {
                throw new Error(`Standard application is missing messageCampaign view column ${universalIdentifier}`);
            }
            const fieldUniversalIdentifier = standardAllFlatEntityMaps.flatFieldMetadataMaps.universalIdentifierById[standardViewField.fieldMetadataId];
            if (!(0, _utils.isDefined)(fieldUniversalIdentifier)) {
                return [];
            }
            // The standard column list keeps growing after 2.20, so skip columns whose
            // field a later command introduces and backfills.
            const isFieldAvailable = (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[fieldUniversalIdentifier]) || fieldsToCreate.some((fieldToCreate)=>fieldToCreate.universalIdentifier === fieldUniversalIdentifier);
            return isFieldAvailable ? [
                standardViewField
            ] : [];
        });
        const hasMetadataChanges = fieldsToCreate.length > 0 || viewsToCreate.length > 0 || viewFieldsToCreate.length > 0;
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Workspace ${workspaceId}: ${fieldsToCreate.length} field(s), ${viewsToCreate.length} view(s), ${viewFieldsToCreate.length} view column(s)`);
            return;
        }
        if (hasMetadataChanges) {
            const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
                isSystemBuild: true,
                workspaceId,
                applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
                allFlatEntityOperationByMetadataName: {
                    fieldMetadata: {
                        flatEntityToCreate: fieldsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    },
                    view: {
                        flatEntityToCreate: viewsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    },
                    viewField: {
                        flatEntityToCreate: viewFieldsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    }
                }
            });
            if (result.status === 'fail') {
                this.logger.error(`Failed to add messageCampaign stat fields:\n${JSON.stringify(result, null, 2)}`);
                throw new Error(`Failed to add messageCampaign stat fields for workspace ${workspaceId}`);
            }
        }
        this.logger.log(`Applied messageCampaign stat fields for workspace ${workspaceId}`);
    }
    resolveViewsToCreate({ flatViewMaps, standardAllFlatEntityMaps }) {
        if ((0, _utils.isDefined)(flatViewMaps.byUniversalIdentifier[CAMPAIGN_VIEW_UNIVERSAL_IDENTIFIER])) {
            return [];
        }
        const standardView = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: standardAllFlatEntityMaps.flatViewMaps,
            universalIdentifier: CAMPAIGN_VIEW_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(standardView)) {
            throw new Error(`Standard application is missing messageCampaign view ${CAMPAIGN_VIEW_UNIVERSAL_IDENTIFIER}`);
        }
        return [
            standardView
        ];
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddMessageCampaignStatFieldsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.20.0', 1783525261000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-20:add-message-campaign-stat-fields',
        description: 'Add the MessageCampaign delivery-stat fields (sent/failed/bounced/complained) and their view columns on existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddMessageCampaignStatFieldsCommand);

//# sourceMappingURL=2-20-workspace-command-1783525261000-add-message-campaign-stat-fields.command.js.map