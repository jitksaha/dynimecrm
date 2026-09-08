"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiAgentRoleService", {
    enumerable: true,
    get: function() {
        return AiAgentRoleService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _aiexception = require("../ai.exception");
const _agententity = require("../ai-agent/entities/agent.entity");
const _roletargetentity = require("../../role-target/role-target.entity");
const _roletargetservice = require("../../role-target/services/role-target.service");
const _roleentity = require("../../role/role.entity");
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
let AiAgentRoleService = class AiAgentRoleService {
    async assignRoleToAgent({ workspaceId, agentId, roleId }) {
        const validationResult = await this.validateAssignRoleInput({
            agentId,
            workspaceId,
            roleId
        });
        if (validationResult?.roleToAssignIsSameAsCurrentRole) {
            return;
        }
        await this.roleTargetService.create({
            createRoleTargetInput: {
                roleId,
                targetId: agentId,
                targetMetadataForeignKey: 'agentId'
            },
            workspaceId
        });
    }
    async removeRoleFromAgent({ workspaceId, agentId }) {
        const existingRoleTarget = await this.roleTargetRepository.findOne(workspaceId, {
            where: {
                agentId
            }
        });
        if (!(0, _utils.isDefined)(existingRoleTarget)) {
            throw new _aiexception.AiException(`Role target not found for agent ${agentId}`, _aiexception.AiExceptionCode.ROLE_NOT_FOUND);
        }
        await this.roleTargetService.delete({
            id: existingRoleTarget.id,
            workspaceId
        });
    }
    async getAgentsAssignedToRole(roleId, workspaceId) {
        const roleTargets = await this.roleTargetRepository.find(workspaceId, {
            where: {
                roleId,
                agentId: (0, _typeorm.Not)((0, _typeorm.IsNull)())
            }
        });
        const agentIds = roleTargets.map((roleTarget)=>roleTarget.agentId).filter((agentId)=>agentId !== null);
        if (!agentIds.length) {
            return [];
        }
        const agents = await this.agentRepository.find(workspaceId, {
            where: {
                id: (0, _typeorm.In)(agentIds)
            }
        });
        return agents;
    }
    async validateAssignRoleInput({ agentId, workspaceId, roleId }) {
        const agent = await this.agentRepository.findOne(workspaceId, {
            where: {
                id: agentId
            }
        });
        if (!agent) {
            throw new _aiexception.AiException(`Agent with id ${agentId} not found in workspace`, _aiexception.AiExceptionCode.AGENT_NOT_FOUND);
        }
        const role = await this.roleRepository.findOne(workspaceId, {
            where: {
                id: roleId
            }
        });
        if (!role) {
            throw new _aiexception.AiException(`Role with id ${roleId} not found in workspace`, _aiexception.AiExceptionCode.ROLE_NOT_FOUND);
        }
        if (!role.canBeAssignedToAgents) {
            throw new _aiexception.AiException(`Role "${role.label}" cannot be assigned to agents`, _aiexception.AiExceptionCode.ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS);
        }
        const existingRoleTarget = await this.roleTargetRepository.findOne(workspaceId, {
            where: {
                agentId,
                roleId
            }
        });
        return {
            roleToAssignIsSameAsCurrentRole: Boolean(existingRoleTarget)
        };
    }
    async deleteAgentOnlyRoleIfUnused({ roleId, roleTargetId, workspaceId }) {
        const role = await this.roleRepository.findOne(workspaceId, {
            where: {
                id: roleId
            }
        });
        if (!(0, _utils.isDefined)(role) || !role.canBeAssignedToAgents || role.canBeAssignedToUsers || role.canBeAssignedToApiKeys) {
            return;
        }
        const remainingAssignments = await this.roleTargetRepository.count(workspaceId, {
            where: {
                roleId,
                id: (0, _typeorm.Not)(roleTargetId)
            }
        });
        if (remainingAssignments === 0) {
            await this.roleRepository.delete(workspaceId, {
                id: roleId
            });
            await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
                'flatRoleMaps',
                'flatRolePermissionFlagMaps'
            ]);
        }
    }
    constructor(agentRepository, roleRepository, roleTargetRepository, roleTargetService, workspaceCacheService){
        this.agentRepository = agentRepository;
        this.roleRepository = roleRepository;
        this.roleTargetRepository = roleTargetRepository;
        this.roleTargetService = roleTargetService;
        this.workspaceCacheService = workspaceCacheService;
    }
};
AiAgentRoleService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_agententity.AgentEntity)),
    _ts_param(1, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_roleentity.RoleEntity)),
    _ts_param(2, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_roletargetentity.RoleTargetEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _roletargetservice.RoleTargetService === "undefined" ? Object : _roletargetservice.RoleTargetService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], AiAgentRoleService);

//# sourceMappingURL=ai-agent-role.service.js.map