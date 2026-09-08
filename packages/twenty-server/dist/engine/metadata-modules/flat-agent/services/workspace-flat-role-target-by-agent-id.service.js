"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatRoleTargetByAgentIdService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatRoleTargetByAgentIdService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _fromroletargetentitytoflatroletargetutil = require("../../flat-role-target/utils/from-role-target-entity-to-flat-role-target.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_ROLE_TARGET_BY_AGENT_ID_ROWS_REQUIREMENT = {
    roleTarget: {
        columns: true,
        groupBy: [
            'agentId'
        ],
        where: {
            agentId: (0, _typeorm.Not)((0, _typeorm.IsNull)())
        }
    },
    application: [
        'id',
        'universalIdentifier'
    ],
    role: [
        'id',
        'universalIdentifier'
    ],
    agent: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatRoleTargetByAgentIdService = class WorkspaceFlatRoleTargetByAgentIdService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        const { roleTarget: roleTargets, application: applications, role: roles, agent: agents } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const roleIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(roles);
        const agentIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(agents);
        const flatRoleTargetByAgentIdMaps = {};
        for (const [agentId, agentRoleTargets] of roleTargets.byAgentId){
            const roleTargetEntity = agentRoleTargets[agentRoleTargets.length - 1];
            flatRoleTargetByAgentIdMaps[agentId] = (0, _fromroletargetentitytoflatroletargetutil.fromRoleTargetEntityToFlatRoleTarget)({
                entity: roleTargetEntity,
                applicationIdToUniversalIdentifierMap,
                roleIdToUniversalIdentifierMap,
                agentIdToUniversalIdentifierMap
            });
        }
        return flatRoleTargetByAgentIdMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_ROLE_TARGET_BY_AGENT_ID_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatRoleTargetByAgentIdService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatRoleTargetByAgentIdMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatRoleTargetByAgentIdService);

//# sourceMappingURL=workspace-flat-role-target-by-agent-id.service.js.map