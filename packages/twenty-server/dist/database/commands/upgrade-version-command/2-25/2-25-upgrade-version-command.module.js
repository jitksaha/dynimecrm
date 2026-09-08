"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_25_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_25_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _225workspacecommand1784567000000backfillmessagelistmembersjunctiontargetcommand = require("./2-25-workspace-command-1784567000000-backfill-message-list-members-junction-target.command");
const _225workspacecommand1785229940000addmessagecampaigncomposertabcommand = require("./2-25-workspace-command-1785229940000-add-message-campaign-composer-tab.command");
const _225workspacecommand1785229960000configuremessagecampaigncommandmenucommand = require("./2-25-workspace-command-1785229960000-configure-message-campaign-command-menu.command");
const _225workspacecommand1785229970000addmessagecampaignnamefieldcommand = require("./2-25-workspace-command-1785229970000-add-message-campaign-name-field.command");
const _225workspacecommand1785332550000removemessagecampaignnavigationmenuitemcommand = require("./2-25-workspace-command-1785332550000-remove-message-campaign-navigation-menu-item.command");
const _225workspacecommand1785332560000alignmessagecampaignviewfieldpositionscommand = require("./2-25-workspace-command-1785332560000-align-message-campaign-view-field-positions.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_25_UpgradeVersionCommandModule = class V2_25_UpgradeVersionCommandModule {
};
V2_25_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _fieldmetadataentity.FieldMetadataEntity
            ]),
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspaceiteratormodule.WorkspaceIteratorModule
        ],
        providers: [
            _225workspacecommand1784567000000backfillmessagelistmembersjunctiontargetcommand.BackfillMessageListMembersJunctionTargetCommand,
            _225workspacecommand1785229940000addmessagecampaigncomposertabcommand.AddMessageCampaignComposerTabCommand,
            _225workspacecommand1785229960000configuremessagecampaigncommandmenucommand.ConfigureMessageCampaignCommandMenuCommand,
            _225workspacecommand1785229970000addmessagecampaignnamefieldcommand.AddMessageCampaignNameFieldCommand,
            _225workspacecommand1785332550000removemessagecampaignnavigationmenuitemcommand.RemoveMessageCampaignNavigationMenuItemCommand,
            _225workspacecommand1785332560000alignmessagecampaignviewfieldpositionscommand.AlignMessageCampaignViewFieldPositionsCommand
        ]
    })
], V2_25_UpgradeVersionCommandModule);

//# sourceMappingURL=2-25-upgrade-version-command.module.js.map