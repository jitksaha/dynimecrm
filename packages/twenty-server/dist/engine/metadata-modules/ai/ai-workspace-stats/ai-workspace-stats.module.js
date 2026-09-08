"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiWorkspaceStatsModule", {
    enumerable: true,
    get: function() {
        return AiWorkspaceStatsModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _toolprovidermodule = require("../../../core-modules/tool-provider/tool-provider.module");
const _agentchatthreadentity = require("../ai-chat/entities/agent-chat-thread.entity");
const _aiworkspacestatsresolver = require("./resolvers/ai-workspace-stats.resolver");
const _aiworkspacestatsservice = require("./services/ai-workspace-stats.service");
const _workspacemanyorallflatentitymapscachemodule = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _permissionsmodule = require("../../permissions/permissions.module");
const _userrolemodule = require("../../user-role/user-role.module");
const _provideworkspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AiWorkspaceStatsModule = class AiWorkspaceStatsModule {
};
AiWorkspaceStatsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _agentchatthreadentity.AgentChatThreadEntity
            ]),
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _permissionsmodule.PermissionsModule,
            _toolprovidermodule.ToolProviderModule,
            _userrolemodule.UserRoleModule
        ],
        providers: [
            _aiworkspacestatsresolver.AiWorkspaceStatsResolver,
            _aiworkspacestatsservice.AiWorkspaceStatsService,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_agentchatthreadentity.AgentChatThreadEntity)
        ],
        exports: [
            _aiworkspacestatsservice.AiWorkspaceStatsService
        ]
    })
], AiWorkspaceStatsModule);

//# sourceMappingURL=ai-workspace-stats.module.js.map