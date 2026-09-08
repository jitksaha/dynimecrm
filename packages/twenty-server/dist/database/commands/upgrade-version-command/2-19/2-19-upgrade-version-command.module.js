"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_19_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_19_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _219workspacecommand1782853718000backfillworkspacecustomapplicationregistrationcommand = require("./2-19-workspace-command-1782853718000-backfill-workspace-custom-application-registration.command");
const _219workspacecommand1783093620000backfillsystemuniqueindexuniversalidentifiercommand = require("./2-19-workspace-command-1783093620000-backfill-system-unique-index-universal-identifier.command");
const _219workspacecommand1783100000000backfilldeterministicfielduniversalidentifierscommand = require("./2-19-workspace-command-1783100000000-backfill-deterministic-field-universal-identifiers.command");
const _applicationentity = require("../../../../engine/core-modules/application/application.entity");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _indexmetadataentity = require("../../../../engine/metadata-modules/index-metadata/index-metadata.entity");
const _workspacemetadataversionmodule = require("../../../../engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_19_UpgradeVersionCommandModule = class V2_19_UpgradeVersionCommandModule {
};
V2_19_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity,
                _applicationentity.ApplicationEntity,
                _fieldmetadataentity.FieldMetadataEntity,
                _indexmetadataentity.IndexMetadataEntity
            ]),
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemetadataversionmodule.WorkspaceMetadataVersionModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule
        ],
        providers: [
            _219workspacecommand1782853718000backfillworkspacecustomapplicationregistrationcommand.BackfillWorkspaceCustomApplicationRegistrationCommand,
            _219workspacecommand1783093620000backfillsystemuniqueindexuniversalidentifiercommand.BackfillSystemUniqueIndexUniversalIdentifierCommand,
            _219workspacecommand1783100000000backfilldeterministicfielduniversalidentifierscommand.BackfillDeterministicFieldUniversalIdentifiersCommand
        ]
    })
], V2_19_UpgradeVersionCommandModule);

//# sourceMappingURL=2-19-upgrade-version-command.module.js.map