"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ToolProviderModule", {
    enumerable: true,
    get: function() {
        return ToolProviderModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _fileentity = require("../file/entities/file.entity");
const _filesfieldmodule = require("../file/files-field/files-field.module");
const _recordcrudmodule = require("../record-crud/record-crud.module");
const _toolproviderstoken = require("./constants/tool-providers.token");
const _actiontoolprovider = require("./providers/action-tool.provider");
const _dashboardtoolprovider = require("./providers/dashboard-tool.provider");
const _databasetoolprovider = require("./providers/database-tool.provider");
const _logicfunctiontoolprovider = require("./providers/logic-function-tool.provider");
const _metadatatoolprovider = require("./providers/metadata-tool.provider");
const _navigationmenuitemtoolprovider = require("./providers/navigation-menu-item-tool.provider");
const _roletoolprovider = require("./providers/role-tool.provider");
const _viewtoolprovider = require("./providers/view-tool.provider");
const _webhooktoolprovider = require("./providers/webhook-tool.provider");
const _workflowtoolprovider = require("./providers/workflow-tool.provider");
const _recordfilesresolverservice = require("./services/record-files-resolver.service");
const _toolexecutorservice = require("./services/tool-executor.service");
const _toolmodule = require("../tool/tool.module");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _userentity = require("../user/user.entity");
const _aiagentexecutionmodule = require("../../metadata-modules/ai/ai-agent-execution/ai-agent-execution.module");
const _aimodelsmodule = require("../../metadata-modules/ai/ai-models/ai-models.module");
const _fieldmetadatamodule = require("../../metadata-modules/field-metadata/field-metadata.module");
const _workspacemanyorallflatentitymapscachemodule = require("../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _logicfunctionmodule = require("../../metadata-modules/logic-function/logic-function.module");
const _navigationmenuitemmodule = require("../../metadata-modules/navigation-menu-item/navigation-menu-item.module");
const _objectmetadatamodule = require("../../metadata-modules/object-metadata/object-metadata.module");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
const _rolemodule = require("../../metadata-modules/role/role.module");
const _userrolemodule = require("../../metadata-modules/user-role/user-role.module");
const _viewfieldmodule = require("../../metadata-modules/view-field/view-field.module");
const _viewfiltermodule = require("../../metadata-modules/view-filter/view-filter.module");
const _viewsortmodule = require("../../metadata-modules/view-sort/view-sort.module");
const _viewmodule = require("../../metadata-modules/view/view.module");
const _webhookmodule = require("../../metadata-modules/webhook/webhook.module");
const _provideworkspacescopedrepository = require("../../twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
const _emailingmodule = require("../../../modules/emailing/emailing.module");
const _toolindexresolver = require("./resolvers/tool-index.resolver");
const _toolregistryservice = require("./services/tool-registry.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ToolProviderModule = class ToolProviderModule {
};
ToolProviderModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _toolmodule.ToolModule,
            _recordcrudmodule.RecordCrudModule,
            _filesfieldmodule.FilesFieldModule,
            _aimodelsmodule.AiModelsModule,
            (0, _common.forwardRef)(()=>_aiagentexecutionmodule.AiAgentExecutionModule),
            _objectmetadatamodule.ObjectMetadataModule,
            _fieldmetadatamodule.FieldMetadataModule,
            _permissionsmodule.PermissionsModule,
            _viewmodule.ViewModule,
            _viewfieldmodule.ViewFieldModule,
            _viewfiltermodule.ViewFilterModule,
            _viewsortmodule.ViewSortModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _logicfunctionmodule.LogicFunctionModule,
            _navigationmenuitemmodule.NavigationMenuItemModule,
            _webhookmodule.WebhookModule,
            _rolemodule.RoleModule,
            _userrolemodule.UserRoleModule,
            _emailingmodule.EmailingModule,
            _typeorm.TypeOrmModule.forFeature([
                _userentity.UserEntity,
                _userworkspaceentity.UserWorkspaceEntity,
                _fileentity.FileEntity
            ])
        ],
        providers: [
            _toolindexresolver.ToolIndexResolver,
            _toolexecutorservice.ToolExecutorService,
            _recordfilesresolverservice.RecordFilesResolverService,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_fileentity.FileEntity),
            _actiontoolprovider.ActionToolProvider,
            _dashboardtoolprovider.DashboardToolProvider,
            _databasetoolprovider.DatabaseToolProvider,
            _metadatatoolprovider.MetadataToolProvider,
            _navigationmenuitemtoolprovider.NavigationMenuItemToolProvider,
            _logicfunctiontoolprovider.LogicFunctionToolProvider,
            _roletoolprovider.RoleToolProvider,
            _viewtoolprovider.ViewToolProvider,
            _webhooktoolprovider.WebhookToolProvider,
            _workflowtoolprovider.WorkflowToolProvider,
            {
                // TOOL_PROVIDERS contains only providers implementing ToolProvider
                // (registry tools with descriptors). The native tool binder is a
                // parallel concept and is exported for surfaces that bind SDK-native
                // tools directly into their model ToolSet.
                provide: _toolproviderstoken.TOOL_PROVIDERS,
                useFactory: (actionProvider, databaseProvider, metadataProvider, logicFunctionProvider, navigationMenuItemProvider, roleProvider, viewProvider, webhookProvider, workflowProvider, dashboardProvider)=>[
                        actionProvider,
                        databaseProvider,
                        metadataProvider,
                        logicFunctionProvider,
                        navigationMenuItemProvider,
                        roleProvider,
                        viewProvider,
                        webhookProvider,
                        workflowProvider,
                        dashboardProvider
                    ],
                inject: [
                    _actiontoolprovider.ActionToolProvider,
                    _databasetoolprovider.DatabaseToolProvider,
                    _metadatatoolprovider.MetadataToolProvider,
                    _logicfunctiontoolprovider.LogicFunctionToolProvider,
                    _navigationmenuitemtoolprovider.NavigationMenuItemToolProvider,
                    _roletoolprovider.RoleToolProvider,
                    _viewtoolprovider.ViewToolProvider,
                    _webhooktoolprovider.WebhookToolProvider,
                    _workflowtoolprovider.WorkflowToolProvider,
                    _dashboardtoolprovider.DashboardToolProvider
                ]
            },
            _toolregistryservice.ToolRegistryService
        ],
        exports: [
            _toolregistryservice.ToolRegistryService
        ]
    })
], ToolProviderModule);

//# sourceMappingURL=tool-provider.module.js.map