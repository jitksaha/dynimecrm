"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_33_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_33_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _233workspacecommand1787123540000backfillactivitytargetsjunctiontargetcommand = require("./2-33-workspace-command-1787123540000-backfill-activity-targets-junction-target.command");
const _233workspacecommand1787127900000migratecommandmenuitemlabelstoplaceholderscommand = require("./2-33-workspace-command-1787127900000-migrate-command-menu-item-labels-to-placeholders.command");
const _233workspacecommand1787400001000replacetimelineactivitynamewithtypecommand = require("./2-33-workspace-command-1787400001000-replace-timeline-activity-name-with-type.command");
const _233workspacecommand1787138325228marksearchvectorfieldssystemcommand = require("./2-33-workspace-command-1787138325228-mark-search-vector-fields-system.command");
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
let V2_33_UpgradeVersionCommandModule = class V2_33_UpgradeVersionCommandModule {
};
V2_33_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _fieldmetadataentity.FieldMetadataEntity
            ]),
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _233workspacecommand1787123540000backfillactivitytargetsjunctiontargetcommand.BackfillActivityTargetsJunctionTargetCommand,
            _233workspacecommand1787138325228marksearchvectorfieldssystemcommand.MarkSearchVectorFieldsSystemCommand,
            _233workspacecommand1787127900000migratecommandmenuitemlabelstoplaceholderscommand.MigrateCommandMenuItemLabelsToPlaceholdersCommand,
            _233workspacecommand1787400001000replacetimelineactivitynamewithtypecommand.ReplaceTimelineActivityNameWithTypeCommand
        ]
    })
], V2_33_UpgradeVersionCommandModule);

//# sourceMappingURL=2-33-upgrade-version-command.module.js.map