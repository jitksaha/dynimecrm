"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_34_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_34_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _234workspacecommand1787471608319addtimelineactivitytypesnapshotcommand = require("./2-34-workspace-command-1787471608319-add-timeline-activity-type-snapshot.command");
const _234workspacecommand1787471608317configuretimelineactivityroutingcommand = require("./2-34-workspace-command-1787471608317-configure-timeline-activity-routing.command");
const _234workspacecommand1787471608318configurestandardtimelinerendererscommand = require("./2-34-workspace-command-1787471608318-configure-standard-timeline-renderers.command");
const _234workspacecommand1787471738599addattachmenttimelineactivitytypescommand = require("./2-34-workspace-command-1787471738599-add-attachment-timeline-activity-types.command");
const _234workspacecommand1787461587487repairactivitytargetsjunctiontargetcommand = require("./2-34-workspace-command-1787461587487-repair-activity-targets-junction-target.command");
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
let V2_34_UpgradeVersionCommandModule = class V2_34_UpgradeVersionCommandModule {
};
V2_34_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _typeorm.TypeOrmModule.forFeature([
                _fieldmetadataentity.FieldMetadataEntity
            ]),
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _234workspacecommand1787471608319addtimelineactivitytypesnapshotcommand.AddTimelineActivityTypeSnapshotCommand,
            _234workspacecommand1787471608317configuretimelineactivityroutingcommand.ConfigureTimelineActivityRoutingCommand,
            _234workspacecommand1787471608318configurestandardtimelinerendererscommand.ConfigureStandardTimelineRenderersCommand,
            _234workspacecommand1787471738599addattachmenttimelineactivitytypescommand.AddAttachmentTimelineActivityTypesCommand,
            _234workspacecommand1787461587487repairactivitytargetsjunctiontargetcommand.RepairActivityTargetsJunctionTargetCommand
        ]
    })
], V2_34_UpgradeVersionCommandModule);

//# sourceMappingURL=2-34-upgrade-version-command.module.js.map