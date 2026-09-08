"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildagentrolepermissionconfigutil = require("../build-agent-role-permission-config.util");
describe('buildAgentRolePermissionConfig', ()=>{
    it('keeps the agent role alone when there is no run-as role', ()=>{
        expect((0, _buildagentrolepermissionconfigutil.buildAgentRolePermissionConfig)({
            agentRoleId: 'agent-role-id'
        })).toEqual({
            intersectionOf: [
                'agent-role-id'
            ]
        });
    });
    it('uses the member role alone in run-as mode', ()=>{
        expect((0, _buildagentrolepermissionconfigutil.buildAgentRolePermissionConfig)({
            agentRoleId: 'agent-role-id',
            runAsRoleId: 'run-as-role-id'
        })).toEqual({
            intersectionOf: [
                'run-as-role-id'
            ]
        });
    });
    it('does not involve the agent role even when the member holds it', ()=>{
        expect((0, _buildagentrolepermissionconfigutil.buildAgentRolePermissionConfig)({
            agentRoleId: 'agent-role-id',
            runAsRoleId: 'agent-role-id'
        })).toEqual({
            intersectionOf: [
                'agent-role-id'
            ]
        });
    });
});

//# sourceMappingURL=build-agent-role-permission-config.util.spec.js.map