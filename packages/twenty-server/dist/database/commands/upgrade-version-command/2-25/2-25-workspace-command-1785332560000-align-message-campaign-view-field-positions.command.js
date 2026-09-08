"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AlignMessageCampaignViewFieldPositionsCommand", {
    enumerable: true,
    get: function() {
        return AlignMessageCampaignViewFieldPositionsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _computeviewfieldpositionsalignedtostandardutil = require("./utils/compute-view-field-positions-aligned-to-standard.util");
const _splitviewfieldpositionupdatesutil = require("./utils/split-view-field-position-updates.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
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
const ALL_MESSAGE_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.messageCampaign.views.allMessageCampaigns.universalIdentifier;
let AlignMessageCampaignViewFieldPositionsCommand = class AlignMessageCampaignViewFieldPositionsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatViewMaps, flatViewFieldMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatViewMaps',
            'flatViewFieldMaps'
        ]);
        const existingView = flatViewMaps.byUniversalIdentifier[ALL_MESSAGE_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(existingView)) {
            this.logger.log(`All campaigns view does not exist for workspace ${workspaceId}, skipping`);
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
        const standardPositionByUniversalIdentifier = Object.fromEntries(Object.values(standardAllFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewField)=>viewField.viewUniversalIdentifier === ALL_MESSAGE_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER).map(({ universalIdentifier, position })=>[
                universalIdentifier,
                position
            ]));
        const existingViewFields = existingView.viewFieldUniversalIdentifiers.map((viewFieldUniversalIdentifier)=>flatViewFieldMaps.byUniversalIdentifier[viewFieldUniversalIdentifier]).filter(_utils.isDefined);
        const positionUpdates = (0, _computeviewfieldpositionsalignedtostandardutil.computeViewFieldPositionsAlignedToStandard)({
            existingViewFields: existingViewFields.map(({ universalIdentifier, position })=>({
                    universalIdentifier,
                    position
                })),
            standardPositionByUniversalIdentifier
        });
        const viewFieldsToUpdate = positionUpdates.map(({ universalIdentifier, position })=>{
            const existingViewField = flatViewFieldMaps.byUniversalIdentifier[universalIdentifier];
            return (0, _utils.isDefined)(existingViewField) ? {
                ...existingViewField,
                position
            } : null;
        }).filter((viewField)=>(0, _utils.isDefined)(viewField));
        if (viewFieldsToUpdate.length === 0) {
            this.logger.log(`All campaigns view columns already match the standard layout for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Aligning ${viewFieldsToUpdate.length} all campaigns view column(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const { others, lowest } = (0, _splitviewfieldpositionupdatesutil.splitViewFieldPositionUpdates)(viewFieldsToUpdate);
        for (const viewFieldBatch of [
            others,
            lowest
        ]){
            if (viewFieldBatch.length === 0) {
                continue;
            }
            await this.runViewFieldUpdates({
                workspaceId,
                applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
                viewFieldsToUpdate: viewFieldBatch
            });
        }
        this.logger.log(`Aligned the all campaigns view columns for workspace ${workspaceId}`);
    }
    async runViewFieldUpdates({ workspaceId, applicationUniversalIdentifier, viewFieldsToUpdate }) {
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier,
            allFlatEntityOperationByMetadataName: {
                viewField: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: viewFieldsToUpdate
                }
            }
        });
        if (result.status === 'fail') {
            this.logger.error(`Failed to align the all campaigns view columns:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to align the all campaigns view columns for workspace ${workspaceId}`);
        }
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AlignMessageCampaignViewFieldPositionsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.25.0', 1785332560000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-25:align-message-campaign-view-field-positions',
        description: 'Align the all campaigns view columns with the standard layout so the name label identifier sits strictly first and the standard-application sync stops trying to move it back'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AlignMessageCampaignViewFieldPositionsCommand);

//# sourceMappingURL=2-25-workspace-command-1785332560000-align-message-campaign-view-field-positions.command.js.map