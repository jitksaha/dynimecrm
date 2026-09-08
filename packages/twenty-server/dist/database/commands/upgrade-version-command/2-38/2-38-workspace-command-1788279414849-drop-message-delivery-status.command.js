"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DropMessageDeliveryStatusCommand", {
    enumerable: true,
    get: function() {
        return DropMessageDeliveryStatusCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
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
// Kept as a literal because the entry it used to name has been removed from
// STANDARD_OBJECT_FIELDS in the same change.
const MESSAGE_DELIVERY_STATUS_FIELD_UNIVERSAL_IDENTIFIER = '209254fa-2b89-429d-a72a-c401c4bd5a78';
let DropMessageDeliveryStatusCommand = class DropMessageDeliveryStatusCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        const deliveryStatusField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: MESSAGE_DELIVERY_STATUS_FIELD_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(deliveryStatusField)) {
            this.logger.log(`Workspace ${workspaceId} has no message deliveryStatus field, skipping`);
            return;
        }
        if (options.dryRun ?? false) {
            this.logger.log(`[DRY RUN] Would drop the message deliveryStatus field for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const migrationResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [
                        deliveryStatusField
                    ],
                    flatEntityToUpdate: []
                }
            }
        });
        if (migrationResult.status === 'fail') {
            throw new Error(`Failed to drop the message deliveryStatus field for workspace ${workspaceId}:\n${JSON.stringify(migrationResult, null, 2)}`);
        }
        this.logger.log(`Dropped the message deliveryStatus field for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
DropMessageDeliveryStatusCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1788279414849),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:drop-message-delivery-status',
        description: 'Remove the message deliveryStatus field, now that per-recipient campaign state lives on core.campaignDelivery'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], DropMessageDeliveryStatusCommand);

//# sourceMappingURL=2-38-workspace-command-1788279414849-drop-message-delivery-status.command.js.map