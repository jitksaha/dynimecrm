"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_10_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_10_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _210workspacecommand1799000050000addinactivegenericstandardfieldscommand = require("./2-10-workspace-command-1799000050000-add-inactive-generic-standard-fields.command");
const _210workspacecommand1799000040000movedemotedstandardfieldstocustomapplicationcommand = require("./2-10-workspace-command-1799000040000-move-demoted-standard-fields-to-custom-application.command");
const _210workspacecommand1799000045000renameconflictingcustomfieldscommand = require("./2-10-workspace-command-1799000045000-rename-conflicting-custom-fields.command");
const _210workspacecommand1799000055000synccallrecordingstandardobjectscommand = require("./2-10-workspace-command-1799000055000-sync-call-recording-standard-objects.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _workspacemetadataversionmodule = require("../../../../engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_10_UpgradeVersionCommandModule = class V2_10_UpgradeVersionCommandModule {
};
V2_10_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _typeorm.TypeOrmModule.forFeature([
                _fieldmetadataentity.FieldMetadataEntity
            ]),
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemetadataversionmodule.WorkspaceMetadataVersionModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _210workspacecommand1799000040000movedemotedstandardfieldstocustomapplicationcommand.MoveDemotedStandardFieldsToCustomApplicationCommand,
            _210workspacecommand1799000045000renameconflictingcustomfieldscommand.RenameConflictingCustomFieldsCommand,
            _210workspacecommand1799000050000addinactivegenericstandardfieldscommand.AddInactiveGenericStandardFieldsCommand,
            _210workspacecommand1799000055000synccallrecordingstandardobjectscommand.SyncCallRecordingStandardObjectsCommand
        ]
    })
], V2_10_UpgradeVersionCommandModule);

//# sourceMappingURL=2-10-upgrade-version-command.module.js.map