"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_38_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_38_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _238workspacecommand1787935130000normalizecompanydomainnamescommand = require("./2-38-workspace-command-1787935130000-normalize-company-domain-names.command");
const _238workspacecommand1787933689056addblocklistscopefieldcommand = require("./2-38-workspace-command-1787933689056-add-blocklist-scope-field.command");
const _238workspacecommand1787982276903addcalendareventrelationsviewfieldcommand = require("./2-38-workspace-command-1787982276903-add-calendar-event-relations-view-field.command");
const _238workspacecommand1787906715270enableeditlayoutacrossappcommand = require("./2-38-workspace-command-1787906715270-enable-edit-layout-across-app.command");
const _238workspacecommand1787914663665backfilllinkedtimelineactivityhappensatcommand = require("./2-38-workspace-command-1787914663665-backfill-linked-timeline-activity-happens-at.command");
const _238workspacecommand1787918663365configuretimelineactivityhappensatcommand = require("./2-38-workspace-command-1787918663365-configure-timeline-activity-happens-at.command");
const _238workspacecommand1787938100000pinaskaicommandmenuitemcommand = require("./2-38-workspace-command-1787938100000-pin-ask-ai-command-menu-item.command");
const _238workspacecommand1788200701000syncmessagecampaignschemacommand = require("./2-38-workspace-command-1788200701000-sync-message-campaign-schema.command");
const _238workspacecommand1788279414849dropmessagedeliverystatuscommand = require("./2-38-workspace-command-1788279414849-drop-message-delivery-status.command");
const _238workspacecommand1788166853000reownobjectnavigationcommandmenuitemscommand = require("./2-38-workspace-command-1788166853000-reown-object-navigation-command-menu-items.command");
const _238workspacecommand1788181550000provisionmissingobjectnavigationcommandmenuitemscommand = require("./2-38-workspace-command-1788181550000-provision-missing-object-navigation-command-menu-items.command");
const _238workspacecommand1788197000000enablestandardactivitytargetfieldscommand = require("./2-38-workspace-command-1788197000000-enable-standard-activity-target-fields.command");
const _238workspacecommand1788299312343simplifystandardtasknotelayoutscommand = require("./2-38-workspace-command-1788299312343-simplify-standard-task-note-layouts.command");
const _238workspacecommand1788266912940provisionmissingobjectsystemrelationscommand = require("./2-38-workspace-command-1788266912940-provision-missing-object-system-relations.command");
const _238workspacecommand1788266562942hideaskaiinsidepanelcommand = require("./2-38-workspace-command-1788266562942-hide-ask-ai-in-side-panel.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _commandmenuitementity = require("../../../../engine/metadata-modules/command-menu-item/entities/command-menu-item.entity");
const _workspaceschemamanagermodule = require("../../../../engine/twenty-orm/workspace-schema-manager/workspace-schema-manager.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_38_UpgradeVersionCommandModule = class V2_38_UpgradeVersionCommandModule {
};
V2_38_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _typeorm.TypeOrmModule.forFeature([
                _commandmenuitementity.CommandMenuItemEntity
            ]),
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspaceschemamanagermodule.WorkspaceSchemaManagerModule
        ],
        providers: [
            _238workspacecommand1787935130000normalizecompanydomainnamescommand.NormalizeCompanyDomainNamesCommand,
            _238workspacecommand1787933689056addblocklistscopefieldcommand.AddBlocklistScopeFieldCommand,
            _238workspacecommand1787982276903addcalendareventrelationsviewfieldcommand.AddCalendarEventRelationsViewFieldCommand,
            _238workspacecommand1787906715270enableeditlayoutacrossappcommand.EnableEditLayoutAcrossAppCommand,
            _238workspacecommand1787914663665backfilllinkedtimelineactivityhappensatcommand.BackfillLinkedTimelineActivityHappensAtCommand,
            _238workspacecommand1787918663365configuretimelineactivityhappensatcommand.ConfigureTimelineActivityHappensAtCommand,
            _238workspacecommand1787938100000pinaskaicommandmenuitemcommand.PinAskAiCommandMenuItemCommand,
            _238workspacecommand1788200701000syncmessagecampaignschemacommand.SyncMessageCampaignSchemaCommand,
            _238workspacecommand1788279414849dropmessagedeliverystatuscommand.DropMessageDeliveryStatusCommand,
            _238workspacecommand1788166853000reownobjectnavigationcommandmenuitemscommand.ReownObjectNavigationCommandMenuItemsCommand,
            _238workspacecommand1788181550000provisionmissingobjectnavigationcommandmenuitemscommand.ProvisionMissingObjectNavigationCommandMenuItemsCommand,
            _238workspacecommand1788197000000enablestandardactivitytargetfieldscommand.EnableStandardActivityTargetFieldsCommand,
            _238workspacecommand1788299312343simplifystandardtasknotelayoutscommand.SimplifyStandardTaskNoteLayoutsCommand,
            _238workspacecommand1788266912940provisionmissingobjectsystemrelationscommand.ProvisionMissingObjectSystemRelationsCommand,
            _238workspacecommand1788266562942hideaskaiinsidepanelcommand.HideAskAiInSidePanelCommand
        ]
    })
], V2_38_UpgradeVersionCommandModule);

//# sourceMappingURL=2-38-upgrade-version-command.module.js.map