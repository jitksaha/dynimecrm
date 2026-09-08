"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageLimitModule", {
    enumerable: true,
    get: function() {
        return UsageLimitModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _apikeyentity = require("../api-key/api-key.entity");
const _applicationentity = require("../application/application.entity");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _agententity = require("../../metadata-modules/ai/ai-agent/entities/agent.entity");
const _logicfunctionentity = require("../../metadata-modules/logic-function/logic-function.entity");
const _usagelimitspeedservice = require("./services/usage-limit-speed.service");
const _usagelimitresolver = require("./usage-limit.resolver");
const _usagelimitservice = require("./services/usage-limit.service");
const _usagelimitrulescacheservice = require("./services/usage-limit-rules-cache.service");
const _usagelimitentity = require("./usage-limit.entity");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
const _provideworkspacescopedrepository = require("../../twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UsageLimitModule = class UsageLimitModule {
};
UsageLimitModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _usagelimitentity.UsageLimitEntity,
                _apikeyentity.ApiKeyEntity,
                _applicationentity.ApplicationEntity,
                _userworkspaceentity.UserWorkspaceEntity,
                _agententity.AgentEntity,
                _logicfunctionentity.LogicFunctionEntity
            ]),
            _workspacecachemodule.WorkspaceCacheModule,
            _permissionsmodule.PermissionsModule
        ],
        providers: [
            _usagelimitspeedservice.UsageLimitSpeedService,
            _usagelimitrulescacheservice.UsageLimitRulesCacheService,
            _usagelimitservice.UsageLimitService,
            _usagelimitresolver.UsageLimitResolver,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_usagelimitentity.UsageLimitEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_apikeyentity.ApiKeyEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_applicationentity.ApplicationEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_userworkspaceentity.UserWorkspaceEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_agententity.AgentEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_logicfunctionentity.LogicFunctionEntity)
        ],
        exports: [
            _usagelimitspeedservice.UsageLimitSpeedService,
            _usagelimitrulescacheservice.UsageLimitRulesCacheService
        ]
    })
], UsageLimitModule);

//# sourceMappingURL=usage-limit.module.js.map