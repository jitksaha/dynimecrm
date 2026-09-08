"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_21_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_21_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _221workspacecommand1783925862946backfillsystemfieldissystemsideeffectcommand = require("./2-21-workspace-command-1783925862946-backfill-system-field-is-system-side-effect.command");
const _applicationentity = require("../../../../engine/core-modules/application/application.entity");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_21_UpgradeVersionCommandModule = class V2_21_UpgradeVersionCommandModule {
};
V2_21_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _applicationentity.ApplicationEntity,
                _fieldmetadataentity.FieldMetadataEntity
            ]),
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule
        ],
        providers: [
            _221workspacecommand1783925862946backfillsystemfieldissystemsideeffectcommand.BackfillSystemFieldIsSystemSideEffectCommand
        ]
    })
], V2_21_UpgradeVersionCommandModule);

//# sourceMappingURL=2-21-upgrade-version-command.module.js.map