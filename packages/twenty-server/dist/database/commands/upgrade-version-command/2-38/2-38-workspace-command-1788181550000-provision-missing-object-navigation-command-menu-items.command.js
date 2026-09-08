"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProvisionMissingObjectNavigationCommandMenuItemsCommand", {
    enumerable: true,
    get: function() {
        return ProvisionMissingObjectNavigationCommandMenuItemsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../../engine/metadata-modules/flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
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
let ProvisionMissingObjectNavigationCommandMenuItemsCommand = class ProvisionMissingObjectNavigationCommandMenuItemsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatCommandMenuItemMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps',
            'flatObjectMetadataMaps'
        ]);
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const flatCommandMenuItemsToCreateByApplication = this.computeFlatCommandMenuItemsToCreateByApplication({
            flatCommandMenuItemMaps,
            flatObjectMetadataMaps,
            excludedApplicationUniversalIdentifiers: new Set([
                twentyStandardFlatApplication.universalIdentifier,
                workspaceCustomFlatApplication.universalIdentifier
            ])
        });
        if (flatCommandMenuItemsToCreateByApplication.size === 0) {
            this.logger.log(`Every object already has a navigation command menu item in workspace ${workspaceId}`);
            return;
        }
        const totalCount = [
            ...flatCommandMenuItemsToCreateByApplication.values()
        ].reduce((count, flatCommandMenuItems)=>count + flatCommandMenuItems.length, 0);
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Provisioning ${totalCount} missing object navigation command menu item(s) across ${flatCommandMenuItemsToCreateByApplication.size} application(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        for (const [applicationUniversalIdentifier, flatCommandMenuItemsToCreate] of flatCommandMenuItemsToCreateByApplication){
            const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
                isSystemBuild: true,
                workspaceId,
                applicationUniversalIdentifier,
                allFlatEntityOperationByMetadataName: {
                    commandMenuItem: {
                        flatEntityToCreate: flatCommandMenuItemsToCreate,
                        flatEntityToUpdate: [],
                        flatEntityToDelete: []
                    }
                }
            });
            if (result.status === 'fail') {
                this.logger.error(`Failed to provision navigation command menu item(s) for application ${applicationUniversalIdentifier} in workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
                throw new Error(`Failed to provision navigation command menu item(s) for workspace ${workspaceId}`);
            }
        }
        this.logger.log(`Provisioned ${totalCount} object navigation command menu item(s) for workspace ${workspaceId}`);
    }
    computeFlatCommandMenuItemsToCreateByApplication({ flatCommandMenuItemMaps, flatObjectMetadataMaps, excludedApplicationUniversalIdentifiers }) {
        const flatCommandMenuItemsToCreateByApplication = new Map();
        const maxPosition = Object.values(flatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).reduce((max, flatCommandMenuItem)=>Math.max(max, flatCommandMenuItem.position), -1);
        let nextPosition = maxPosition + 1;
        const now = new Date().toISOString();
        for (const flatObjectMetadata of Object.values(flatObjectMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatObjectMetadata) || excludedApplicationUniversalIdentifiers.has(flatObjectMetadata.applicationUniversalIdentifier)) {
                continue;
            }
            const objectAlreadyHasNavigationCommandMenuItem = flatObjectMetadata.commandMenuItemUniversalIdentifiers.some((universalIdentifier)=>(0, _utils.isDefined)(flatCommandMenuItemMaps.byUniversalIdentifier[universalIdentifier]));
            const derivedUniversalIdentifier = (0, _application.getSystemNavigationCommandMenuItemUniversalIdentifier)({
                objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                objectUniversalIdentifier: flatObjectMetadata.universalIdentifier
            });
            if (objectAlreadyHasNavigationCommandMenuItem || (0, _utils.isDefined)(flatCommandMenuItemMaps.byUniversalIdentifier[derivedUniversalIdentifier])) {
                continue;
            }
            const flatCommandMenuItemToCreate = (0, _buildobjectnavigationuniversalflatcommandmenuitemutil.buildObjectNavigationUniversalFlatCommandMenuItem)({
                objectMetadata: {
                    id: flatObjectMetadata.id,
                    universalIdentifier: flatObjectMetadata.universalIdentifier,
                    nameSingular: flatObjectMetadata.nameSingular,
                    shortcut: flatObjectMetadata.shortcut,
                    isActive: flatObjectMetadata.isActive
                },
                applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                position: nextPosition++,
                now
            });
            const existing = flatCommandMenuItemsToCreateByApplication.get(flatObjectMetadata.applicationUniversalIdentifier) ?? [];
            existing.push(flatCommandMenuItemToCreate);
            flatCommandMenuItemsToCreateByApplication.set(flatObjectMetadata.applicationUniversalIdentifier, existing);
        }
        return flatCommandMenuItemsToCreateByApplication;
    }
    constructor(workspaceIteratorService, workspaceCacheService, applicationService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.applicationService = applicationService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
ProvisionMissingObjectNavigationCommandMenuItemsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1788181550000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:provision-missing-object-navigation-command-menu-items',
        description: 'Provision the navigation command menu item of every object that has none. Objects installed through an application manifest never got one: objectNavigationCommandOnCreate noops on that path because the manifest mints entity ids after side-effect expansion and the NAVIGATION payload needs the object id (the dual write tracked by core-team-issues#2794). Scoped to application-installed objects: twenty-standard seeds its own through the from/to sync it owns, and workspace-custom objects go through the API path where the create handler already provisions. Mints exactly what the create handler mints, under the application owning the object, one migration per application, with isActive mirroring the object so an inactive object gets a disabled command. Skips any object that already has a command menu item targeting it, so it is idempotent and leaves rows the 2-38 re-own could not converge alone. Runs after that re-own so a converged row is recognised by its derived identifier.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], ProvisionMissingObjectNavigationCommandMenuItemsCommand);

//# sourceMappingURL=2-38-workspace-command-1788181550000-provision-missing-object-navigation-command-menu-items.command.js.map