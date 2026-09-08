"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MigrateCommandMenuItemLabelsToPlaceholdersCommand", {
    enumerable: true,
    get: function() {
        return MigrateCommandMenuItemLabelsToPlaceholdersCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _enginecomponentkeyenum = require("../../../../engine/metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../../engine/metadata-modules/flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
const _standardcommandmenuitemconstant = require("../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
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
const DISPLAY_FIELDS = [
    'label',
    'shortLabel',
    'icon'
];
const pickDisplayFields = (item)=>({
        label: item.label,
        shortLabel: item.shortLabel,
        icon: item.icon
    });
// NAVIGATION items are minted per object by the side-effect engine, so they
// are not in the standard application definition and their expected shape
// comes from the builder's constants instead.
const NAVIGATION_DISPLAY_FIELDS = {
    label: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_LABEL,
    shortLabel: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_SHORT_LABEL,
    icon: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_ICON
};
// Display fields are workspace-independent, so they are read off the standard
// definition directly instead of minting the whole standard application per
// workspace.
const STANDARD_DISPLAY_FIELDS_BY_UNIVERSAL_IDENTIFIER = Object.fromEntries(Object.values(_standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS).map((item)=>[
        item.universalIdentifier,
        pickDisplayFields(item)
    ]));
let MigrateCommandMenuItemLabelsToPlaceholdersCommand = class MigrateCommandMenuItemLabelsToPlaceholdersCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatCommandMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps'
        ]);
        const now = new Date().toISOString();
        const itemsToUpdate = Object.values(flatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).map((existingItem)=>{
            const expectedDisplayFields = existingItem.engineComponentKey === _enginecomponentkeyenum.EngineComponentKey.NAVIGATION ? NAVIGATION_DISPLAY_FIELDS : STANDARD_DISPLAY_FIELDS_BY_UNIVERSAL_IDENTIFIER[existingItem.universalIdentifier];
            if (!(0, _utils.isDefined)(expectedDisplayFields) || DISPLAY_FIELDS.every((field)=>existingItem[field] === expectedDisplayFields[field])) {
                return undefined;
            }
            return {
                ...existingItem,
                ...expectedDisplayFields,
                updatedAt: now
            };
        }).filter(_utils.isDefined);
        if (itemsToUpdate.length === 0) {
            this.logger.log(`Command menu item labels already use placeholders for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] Would update' : 'Updating'} ${itemsToUpdate.length} command menu item label(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: itemsToUpdate
                }
            },
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to migrate command menu item labels:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to migrate command menu item labels for workspace ${workspaceId}`);
        }
        this.logger.log(`Successfully updated ${itemsToUpdate.length} command menu item label(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
MigrateCommandMenuItemLabelsToPlaceholdersCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.33.0', 1787127900000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-33:migrate-command-menu-item-labels-to-placeholders',
        description: 'Rewrite engine-owned command menu item labels to the source messages that carry named placeholders, replacing the template expressions they were stored as'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], MigrateCommandMenuItemLabelsToPlaceholdersCommand);

//# sourceMappingURL=2-33-workspace-command-1787127900000-migrate-command-menu-item-labels-to-placeholders.command.js.map