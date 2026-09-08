"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageLimitService", {
    enumerable: true,
    get: function() {
        return UsageLimitService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _apikeyentity = require("../../api-key/api-key.entity");
const _applicationentity = require("../../application/application.entity");
const _usagelimitexception = require("../exceptions/usage-limit.exception");
const _usagelimitentity = require("../usage-limit.entity");
const _validateusagelimitagainstdefinitionutil = require("../utils/validate-usage-limit-against-definition.util");
const _userworkspaceentity = require("../../user-workspace/user-workspace.entity");
const _agententity = require("../../../metadata-modules/ai/ai-agent/entities/agent.entity");
const _logicfunctionentity = require("../../../metadata-modules/logic-function/logic-function.entity");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
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
let UsageLimitService = class UsageLimitService {
    async findAll(workspaceId) {
        return this.usageLimitRepository.find(workspaceId);
    }
    async upsert({ workspaceId, input }) {
        (0, _validateusagelimitagainstdefinitionutil.validateUsageLimitAgainstDefinition)(input);
        if ((0, _guards.isNonEmptyString)(input.spenderId)) {
            await this.validateSpenderBelongsToWorkspace({
                workspaceId,
                spenderType: input.spenderType,
                spenderId: input.spenderId
            });
        }
        const scope = {
            resourceType: input.resourceType,
            operationType: input.operationType,
            spenderType: input.spenderType,
            spenderId: input.spenderId ?? '',
            limitKind: input.limitKind,
            windowSeconds: input.windowSeconds
        };
        await this.usageLimitRepository.upsert(workspaceId, {
            workspaceId,
            ...scope,
            limitValueType: 'absolute',
            limitValue: input.limitValue,
            burstValue: input.burstValue ?? null
        }, {
            conflictPaths: [
                'workspaceId',
                ...Object.keys(scope)
            ]
        });
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'usageLimitRules'
        ]);
        return this.usageLimitRepository.findOneOrFail(workspaceId, {
            where: scope
        });
    }
    async delete({ workspaceId, usageLimitId }) {
        const { affected } = await this.usageLimitRepository.delete(workspaceId, {
            id: usageLimitId
        });
        if (!(0, _utils.isDefined)(affected) || affected === 0) {
            return false;
        }
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'usageLimitRules'
        ]);
        return true;
    }
    async validateSpenderBelongsToWorkspace({ workspaceId, spenderType, spenderId }) {
        const spenderExists = await this.spenderExists({
            workspaceId,
            spenderType,
            spenderId
        });
        if (!spenderExists) {
            throw new _usagelimitexception.UsageLimitException(`No ${spenderType} ${spenderId} in this workspace`, _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID);
        }
    }
    async spenderExists({ workspaceId, spenderType, spenderId }) {
        switch(spenderType){
            case 'apiKey':
                return this.apiKeyRepository.existsBy(workspaceId, {
                    id: spenderId
                });
            case 'application':
                return this.applicationRepository.existsBy(workspaceId, {
                    id: spenderId
                });
            case 'userWorkspace':
                return this.userWorkspaceRepository.existsBy(workspaceId, {
                    id: spenderId
                });
            case 'agent':
                return this.agentRepository.existsBy(workspaceId, {
                    id: spenderId
                });
            case 'logicFunction':
                return this.logicFunctionRepository.existsBy(workspaceId, {
                    id: spenderId
                });
            default:
                throw new _usagelimitexception.UsageLimitException(`A ${spenderType} spender id cannot be checked against the workspace`, _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID);
        }
    }
    constructor(usageLimitRepository, apiKeyRepository, applicationRepository, userWorkspaceRepository, agentRepository, logicFunctionRepository, workspaceCacheService){
        this.usageLimitRepository = usageLimitRepository;
        this.apiKeyRepository = apiKeyRepository;
        this.applicationRepository = applicationRepository;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.agentRepository = agentRepository;
        this.logicFunctionRepository = logicFunctionRepository;
        this.workspaceCacheService = workspaceCacheService;
    }
};
UsageLimitService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_usagelimitentity.UsageLimitEntity)),
    _ts_param(1, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_apikeyentity.ApiKeyEntity)),
    _ts_param(2, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_applicationentity.ApplicationEntity)),
    _ts_param(3, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_param(4, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_agententity.AgentEntity)),
    _ts_param(5, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_logicfunctionentity.LogicFunctionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], UsageLimitService);

//# sourceMappingURL=usage-limit.service.js.map