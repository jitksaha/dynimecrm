"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_23_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_23_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _223workspacecommand1784286706000addworkflowcoresoftreffieldcommand = require("./2-23-workspace-command-1784286706000-add-workflow-core-soft-ref-field.command");
const _223workspacecommand1784286707000backfillworkflowcorelinkscommand = require("./2-23-workspace-command-1784286707000-backfill-workflow-core-links.command");
const _223workspacecommand1784565136000reconcilesystemrelationfielduniversalidentifiercommand = require("./2-23-workspace-command-1784565136000-reconcile-system-relation-field-universal-identifier.command");
const _223workspacecommand1784565137000upgradepeopledatalabsapplicationcommand = require("./2-23-workspace-command-1784565137000-upgrade-people-data-labs-application.command");
const _223workspacecommand1784566000000fixgotorolessettingscommandmenuitempathcommand = require("./2-23-workspace-command-1784566000000-fix-go-to-roles-settings-command-menu-item-path.command");
const _applicationupgrademodule = require("../../../../engine/core-modules/application/application-upgrade/application-upgrade.module");
const _applicationentity = require("../../../../engine/core-modules/application/application.entity");
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
let V2_23_UpgradeVersionCommandModule = class V2_23_UpgradeVersionCommandModule {
};
V2_23_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _fieldmetadataentity.FieldMetadataEntity,
                _applicationentity.ApplicationEntity
            ]),
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _applicationupgrademodule.ApplicationUpgradeModule
        ],
        providers: [
            _223workspacecommand1784286706000addworkflowcoresoftreffieldcommand.AddWorkflowCoreSoftRefFieldCommand,
            _223workspacecommand1784286707000backfillworkflowcorelinkscommand.BackfillWorkflowCoreLinksCommand,
            _223workspacecommand1784565136000reconcilesystemrelationfielduniversalidentifiercommand.ReconcileSystemRelationFieldUniversalIdentifierCommand,
            _223workspacecommand1784565137000upgradepeopledatalabsapplicationcommand.UpgradePeopleDataLabsApplicationCommand,
            _223workspacecommand1784566000000fixgotorolessettingscommandmenuitempathcommand.FixGoToRolesSettingsCommandMenuItemPathCommand
        ]
    })
], V2_23_UpgradeVersionCommandModule);

//# sourceMappingURL=2-23-upgrade-version-command.module.js.map