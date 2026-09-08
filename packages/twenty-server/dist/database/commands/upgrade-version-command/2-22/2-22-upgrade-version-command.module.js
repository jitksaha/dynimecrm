"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_22_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_22_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _222workspacecommand1783959648000backfillcompanypersonimageidentifierfieldmetadataidcommand = require("./2-22-workspace-command-1783959648000-backfill-company-person-image-identifier-field-metadata-id.command");
const _222workspacecommand1783960128000migratepersonavatarurltoavatarfilecommand = require("./2-22-workspace-command-1783960128000-migrate-person-avatar-url-to-avatar-file.command");
const _222workspacecommand1784193206000addworkflowversioncoresoftreffieldcommand = require("./2-22-workspace-command-1784193206000-add-workflow-version-core-soft-ref-field.command");
const _222workspacecommand1784193207000backfillworkflowversioncorelinkscommand = require("./2-22-workspace-command-1784193207000-backfill-workflow-version-core-links.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _filesfieldmodule = require("../../../../engine/core-modules/file/files-field/files-field.module");
const _securehttpclientmodule = require("../../../../engine/core-modules/secure-http-client/secure-http-client.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_22_UpgradeVersionCommandModule = class V2_22_UpgradeVersionCommandModule {
};
V2_22_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _filesfieldmodule.FilesFieldModule,
            _securehttpclientmodule.SecureHttpClientModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspaceiteratormodule.WorkspaceIteratorModule
        ],
        providers: [
            _222workspacecommand1783959648000backfillcompanypersonimageidentifierfieldmetadataidcommand.BackfillCompanyPersonImageIdentifierFieldMetadataIdCommand,
            _222workspacecommand1783960128000migratepersonavatarurltoavatarfilecommand.MigratePersonAvatarUrlToAvatarFileCommand,
            _222workspacecommand1784193206000addworkflowversioncoresoftreffieldcommand.AddWorkflowVersionCoreSoftRefFieldCommand,
            _222workspacecommand1784193207000backfillworkflowversioncorelinkscommand.BackfillWorkflowVersionCoreLinksCommand
        ]
    })
], V2_22_UpgradeVersionCommandModule);

//# sourceMappingURL=2-22-upgrade-version-command.module.js.map