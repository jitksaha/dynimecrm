"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_9_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_9_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _29workspacecommand1799000000000migrateaimodelpreferencescommand = require("./2-9-workspace-command-1799000000000-migrate-ai-model-preferences.command");
const _29workspacecommand1799000030000backfillfieldswidgetnewfielddefaultvisibilitycommand = require("./2-9-workspace-command-1799000030000-backfill-fields-widget-new-field-default-visibility.command");
const _29workspacecommand1799000035000addworkflowrunsteplogsfieldcommand = require("./2-9-workspace-command-1799000035000-add-workflow-run-step-logs-field.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _keyvaluepairentity = require("../../../../engine/core-modules/key-value-pair/key-value-pair.entity");
const _fieldmetadatamodule = require("../../../../engine/metadata-modules/field-metadata/field-metadata.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_9_UpgradeVersionCommandModule = class V2_9_UpgradeVersionCommandModule {
};
V2_9_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _keyvaluepairentity.KeyValuePairEntity
            ]),
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _applicationmodule.ApplicationModule,
            _fieldmetadatamodule.FieldMetadataModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _29workspacecommand1799000000000migrateaimodelpreferencescommand.MigrateAiModelPreferencesCommand,
            _29workspacecommand1799000035000addworkflowrunsteplogsfieldcommand.AddWorkflowRunStepLogsFieldCommand,
            _29workspacecommand1799000030000backfillfieldswidgetnewfielddefaultvisibilitycommand.BackfillFieldsWidgetNewFieldDefaultVisibilityCommand
        ]
    })
], V2_9_UpgradeVersionCommandModule);

//# sourceMappingURL=2-9-upgrade-version-command.module.js.map