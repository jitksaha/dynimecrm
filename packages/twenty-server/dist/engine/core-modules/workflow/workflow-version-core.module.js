"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowVersionCoreModule", {
    enumerable: true,
    get: function() {
        return WorkflowVersionCoreModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workflowversionentity = require("./entities/workflow-version.entity");
const _workflowversioncoresyncservice = require("./services/workflow-version-core-sync.service");
const _workspaceworkflowautomatedtriggermapcacheservice = require("./services/workspace-workflow-automated-trigger-map-cache.service");
const _workspaceentity = require("../workspace/workspace.entity");
const _provideworkspacescopedrepository = require("../../twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WorkflowVersionCoreModule = class WorkflowVersionCoreModule {
};
WorkflowVersionCoreModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _workflowversionentity.WorkflowVersionEntity,
                _workspaceentity.WorkspaceEntity
            ]),
            _workspacecachemodule.WorkspaceCacheModule
        ],
        providers: [
            _workspaceworkflowautomatedtriggermapcacheservice.WorkspaceWorkflowAutomatedTriggerMapCacheService,
            _workflowversioncoresyncservice.WorkflowVersionCoreSyncService,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_workflowversionentity.WorkflowVersionEntity)
        ],
        exports: [
            _typeorm.TypeOrmModule,
            _workspaceworkflowautomatedtriggermapcacheservice.WorkspaceWorkflowAutomatedTriggerMapCacheService,
            _workflowversioncoresyncservice.WorkflowVersionCoreSyncService
        ]
    })
], WorkflowVersionCoreModule);

//# sourceMappingURL=workflow-version-core.module.js.map