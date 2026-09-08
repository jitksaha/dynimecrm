"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReownObjectNavigationCommandMenuItemsCommand", {
    enumerable: true,
    get: function() {
        return ReownObjectNavigationCommandMenuItemsCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _invalidatecommandmenuitemreowncacheutil = require("./utils/invalidate-command-menu-item-reown-cache.util");
const _buildlegacynavigationflatcommandmenuitemutil = require("../utils/build-legacy-navigation-flat-command-menu-item.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _commandmenuitementity = require("../../../../engine/metadata-modules/command-menu-item/entities/command-menu-item.entity");
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
let ReownObjectNavigationCommandMenuItemsCommand = class ReownObjectNavigationCommandMenuItemsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatCommandMenuItemMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps',
            'flatObjectMetadataMaps'
        ]);
        const commandMenuItemUpdates = this.computeReownUpdates({
            workspaceId,
            flatCommandMenuItemMaps,
            flatObjectMetadataMaps
        });
        if (commandMenuItemUpdates.length === 0) {
            this.logger.log(`No object navigation command menu item to re-own for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Re-owning ${commandMenuItemUpdates.length} object navigation command menu item(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        await this.commandMenuItemRepository.manager.transaction(async (entityManager)=>{
            const transactionalCommandMenuItemRepository = entityManager.getRepository(_commandmenuitementity.CommandMenuItemEntity);
            for (const { id, update } of commandMenuItemUpdates){
                await transactionalCommandMenuItemRepository.update({
                    id,
                    workspaceId
                }, update);
            }
        });
        await (0, _invalidatecommandmenuitemreowncacheutil.invalidateCommandMenuItemReownCache)({
            workspaceId,
            workspaceMigrationRunnerService: this.workspaceMigrationRunnerService
        });
        this.logger.log(`Re-owned ${commandMenuItemUpdates.length} object navigation command menu item(s) for workspace ${workspaceId}`);
    }
    computeReownUpdates({ workspaceId, flatCommandMenuItemMaps, flatObjectMetadataMaps }) {
        const commandMenuItemUpdates = [];
        for (const flatObjectMetadata of Object.values(flatObjectMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatObjectMetadata)) {
                continue;
            }
            const legacyFlatCommandMenuItem = flatCommandMenuItemMaps.byUniversalIdentifier[(0, _buildlegacynavigationflatcommandmenuitemutil.getLegacyNavigationCommandUniversalIdentifier)(flatObjectMetadata.universalIdentifier)];
            if (!(0, _utils.isDefined)(legacyFlatCommandMenuItem) || legacyFlatCommandMenuItem.applicationUniversalIdentifier !== flatObjectMetadata.applicationUniversalIdentifier) {
                continue;
            }
            const derivedUniversalIdentifier = (0, _application.getSystemNavigationCommandMenuItemUniversalIdentifier)({
                objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                objectUniversalIdentifier: flatObjectMetadata.universalIdentifier
            });
            const update = {};
            if (!legacyFlatCommandMenuItem.isSystemSideEffect) {
                update.isSystemSideEffect = true;
            }
            if ((0, _utils.isDefined)(flatCommandMenuItemMaps.byUniversalIdentifier[derivedUniversalIdentifier])) {
                this.logger.warn(`Derived identifier ${derivedUniversalIdentifier} of navigation command menu item ${legacyFlatCommandMenuItem.id} is already held by another command menu item in workspace ${workspaceId}, keeping its identifier`);
            } else {
                update.universalIdentifier = derivedUniversalIdentifier;
            }
            if (Object.keys(update).length > 0) {
                commandMenuItemUpdates.push({
                    id: legacyFlatCommandMenuItem.id,
                    update
                });
            }
        }
        return commandMenuItemUpdates;
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationRunnerService, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    commandMenuItemRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.commandMenuItemRepository = commandMenuItemRepository;
    }
};
ReownObjectNavigationCommandMenuItemsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1788166853000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:reown-object-navigation-command-menu-items',
        description: 'Move the object navigation command menu items off the retired v5 namespace derivation, which was keyed on the object alone, onto the derived (application, object) universal identifier. Walks objects rather than command menu items and takes only the row sitting on the legacy identifier of the object and belonging to the same application as that object, so a command an application authored for an object is never adopted. Only universalIdentifier changes, plus isSystemSideEffect for rows the 2.12 backfill left false because they belong to the workspace custom application: position, isPinned, hotKeys and overrides are untouched so the re-own is workspace-invisible. Idempotent, since a converged object no longer has a row on its legacy identifier. A derived identifier already held by another row keeps its holder, the legacy row keeps its identifier with a warning, and the flag is still reconciled.'
    }),
    _ts_param(3, (0, _typeorm.InjectRepository)(_commandmenuitementity.CommandMenuItemEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ReownObjectNavigationCommandMenuItemsCommand);

//# sourceMappingURL=2-38-workspace-command-1788166853000-reown-object-navigation-command-menu-items.command.js.map