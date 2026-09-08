"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_20_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_20_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _220workspacecommand1783499671542backfillactorsourceenumvaluescommand = require("./2-20-workspace-command-1783499671542-backfill-actor-source-enum-values.command");
const _220workspacecommand1783525261000addmessagecampaignstatfieldscommand = require("./2-20-workspace-command-1783525261000-add-message-campaign-stat-fields.command");
const _220workspacecommand1783525261001createmessagelistviewcommand = require("./2-20-workspace-command-1783525261001-create-message-list-view.command");
const _220workspacecommand1783526282685backfillworkflowversiontocorecommand = require("./2-20-workspace-command-1783526282685-backfill-workflow-version-to-core.command");
const _220workspacecommand1783529458169reconcilesearchvectorginindexuniversalidentifiercommand = require("./2-20-workspace-command-1783529458169-reconcile-search-vector-gin-index-universal-identifier.command");
const _220workspacecommand1783529458170reconcilesearchfieldmetadatacommand = require("./2-20-workspace-command-1783529458170-reconcile-search-field-metadata.command");
const _220workspacecommand1783529458171rebuildinstalledappsearchvectorscommand = require("./2-20-workspace-command-1783529458171-rebuild-installed-app-search-vectors.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workflowversioncoremodule = require("../../../../engine/core-modules/workflow/workflow-version-core.module");
const _indexmetadataentity = require("../../../../engine/metadata-modules/index-metadata/index-metadata.entity");
const _searchfieldmetadataentity = require("../../../../engine/metadata-modules/search-field-metadata/search-field-metadata.entity");
const _workspacemetadataversionmodule = require("../../../../engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module");
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
let V2_20_UpgradeVersionCommandModule = class V2_20_UpgradeVersionCommandModule {
};
V2_20_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _typeorm.TypeOrmModule.forFeature([
                _indexmetadataentity.IndexMetadataEntity,
                _searchfieldmetadataentity.SearchFieldMetadataEntity
            ]),
            _workflowversioncoremodule.WorkflowVersionCoreModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemetadataversionmodule.WorkspaceMetadataVersionModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspaceschemamanagermodule.WorkspaceSchemaManagerModule
        ],
        providers: [
            _220workspacecommand1783525261000addmessagecampaignstatfieldscommand.AddMessageCampaignStatFieldsCommand,
            _220workspacecommand1783525261001createmessagelistviewcommand.CreateMessageListViewCommand,
            _220workspacecommand1783499671542backfillactorsourceenumvaluescommand.BackfillActorSourceEnumValuesCommand,
            _220workspacecommand1783526282685backfillworkflowversiontocorecommand.BackfillWorkflowVersionToCoreCommand,
            _220workspacecommand1783529458169reconcilesearchvectorginindexuniversalidentifiercommand.ReconcileSearchVectorGinIndexUniversalIdentifierCommand,
            _220workspacecommand1783529458170reconcilesearchfieldmetadatacommand.ReconcileSearchFieldMetadataCommand,
            _220workspacecommand1783529458171rebuildinstalledappsearchvectorscommand.RebuildInstalledAppSearchVectorsCommand
        ]
    })
], V2_20_UpgradeVersionCommandModule);

//# sourceMappingURL=2-20-upgrade-version-command.module.js.map