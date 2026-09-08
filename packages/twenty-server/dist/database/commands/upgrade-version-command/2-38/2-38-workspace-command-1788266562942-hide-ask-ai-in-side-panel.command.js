"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HideAskAiInSidePanelCommand", {
    enumerable: true,
    get: function() {
        return HideAskAiInSidePanelCommand;
    }
});
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildhideaskaiinsidepanelcommandmenuitemupdateutil = require("./utils/build-hide-ask-ai-in-side-panel-command-menu-item-update.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _standardcommandmenuitemconstant = require("../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const _workspacemigrationbuilderexception = require("../../../../engine/workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
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
let HideAskAiInSidePanelCommand = class HideAskAiInSidePanelCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const { flatCommandMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps'
        ]);
        const commandMenuItemToUpdate = (0, _buildhideaskaiinsidepanelcommandmenuitemupdateutil.buildHideAskAiInSidePanelCommandMenuItemUpdate)({
            existingCommandMenuItem: flatCommandMenuItemMaps.byUniversalIdentifier[_standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.askAi.universalIdentifier],
            now: new Date().toISOString()
        });
        if (!(0, _utils.isDefined)(commandMenuItemToUpdate)) {
            return;
        }
        if (options.dryRun) {
            this.logger.log(`Would hide the Ask AI command in side panels for workspace ${workspaceId}`);
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        commandMenuItemToUpdate
                    ]
                }
            },
            workspaceId,
            isSystemBuild: true,
            applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult);
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
HideAskAiInSidePanelCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1788266562942),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:hide-ask-ai-in-side-panel',
        description: 'Hide the Ask AI command in side panels'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], HideAskAiInSidePanelCommand);

//# sourceMappingURL=2-38-workspace-command-1788266562942-hide-ask-ai-in-side-panel.command.js.map