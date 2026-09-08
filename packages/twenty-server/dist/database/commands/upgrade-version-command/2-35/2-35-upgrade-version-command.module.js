"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_35_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_35_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _235workspacecommand1787561579075repairattachmenttimelineactivitytypescommand = require("./2-35-workspace-command-1787561579075-repair-attachment-timeline-activity-types.command");
const _235workspacecommand1787572700000backfillcommandmenuitemtargetobjectmetadatacommand = require("./2-35-workspace-command-1787572700000-backfill-command-menu-item-target-object-metadata.command");
const _235workspacecommand1787582101000restorestandarddefaultrelationfieldscommand = require("./2-35-workspace-command-1787582101000-restore-standard-default-relation-fields.command");
const _235workspacecommand1787641226000repairtimelineactivitytargetfieldnamescommand = require("./2-35-workspace-command-1787641226000-repair-timeline-activity-target-field-names.command");
const _235workspacecommand1787648000000contracttimelineactivitycompatibilitycommand = require("./2-35-workspace-command-1787648000000-contract-timeline-activity-compatibility.command");
const _235workspacecommand1787749300000backfilltimelineactivitysearchfieldmetadatacommand = require("./2-35-workspace-command-1787749300000-backfill-timeline-activity-search-field-metadata.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_35_UpgradeVersionCommandModule = class V2_35_UpgradeVersionCommandModule {
};
V2_35_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _235workspacecommand1787561579075repairattachmenttimelineactivitytypescommand.RepairAttachmentTimelineActivityTypesCommand,
            _235workspacecommand1787572700000backfillcommandmenuitemtargetobjectmetadatacommand.BackfillCommandMenuItemTargetObjectMetadataCommand,
            _235workspacecommand1787582101000restorestandarddefaultrelationfieldscommand.RestoreStandardDefaultRelationFieldsCommand,
            _235workspacecommand1787641226000repairtimelineactivitytargetfieldnamescommand.RepairTimelineActivityTargetFieldNamesCommand,
            _235workspacecommand1787648000000contracttimelineactivitycompatibilitycommand.ContractTimelineActivityCompatibilityCommand,
            _235workspacecommand1787749300000backfilltimelineactivitysearchfieldmetadatacommand.BackfillTimelineActivitySearchFieldMetadataCommand
        ]
    })
], V2_35_UpgradeVersionCommandModule);

//# sourceMappingURL=2-35-upgrade-version-command.module.js.map