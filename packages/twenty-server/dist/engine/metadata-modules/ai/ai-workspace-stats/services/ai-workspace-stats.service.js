"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiWorkspaceStatsService", {
    enumerable: true,
    get: function() {
        return AiWorkspaceStatsService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _toolregistryservice = require("../../../../core-modules/tool-provider/services/tool-registry.service");
const _agentchatthreadentity = require("../../ai-chat/entities/agent-chat-thread.entity");
const _workspacemanyorallflatentitymapscacheservice = require("../../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _injectworkspacescopedrepositorydecorator = require("../../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AiWorkspaceStatsService = class AiWorkspaceStatsService {
    async computeStats(workspaceId, roleId) {
        const [conversationsCount, flatMaps, toolIndex] = await Promise.all([
            this.threadRepository.count(workspaceId),
            this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId,
                flatMapsKeys: [
                    'flatSkillMaps'
                ]
            }),
            // Count the full tool catalog the user can see (built-in tools + custom
            // logic-function tools), matching the Tools tab rather than only the
            // custom subset. The catalog is role-scoped, like the tab.
            this.toolRegistryService.buildToolIndex(workspaceId, roleId)
        ]);
        const skillsCount = Object.values(flatMaps.flatSkillMaps.byUniversalIdentifier).filter(_utils.isDefined).length;
        return {
            conversationsCount,
            skillsCount,
            toolsCount: toolIndex.length
        };
    }
    constructor(threadRepository, flatEntityMapsCacheService, toolRegistryService){
        this.threadRepository = threadRepository;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.toolRegistryService = toolRegistryService;
    }
};
AiWorkspaceStatsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_agentchatthreadentity.AgentChatThreadEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _toolregistryservice.ToolRegistryService === "undefined" ? Object : _toolregistryservice.ToolRegistryService
    ])
], AiWorkspaceStatsService);

//# sourceMappingURL=ai-workspace-stats.service.js.map