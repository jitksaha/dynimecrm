"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createAssignRoleToWorkspaceMemberTool", {
    enumerable: true,
    get: function() {
        return createAssignRoleToWorkspaceMemberTool;
    }
});
const _zod = require("zod");
const _toroletoolerrormessageutil = require("./utils/to-role-tool-error-message.util");
const assignRoleToWorkspaceMemberSchema = _zod.z.object({
    workspaceMemberId: _zod.z.uuid().describe('Id of the workspace member to assign the role to'),
    roleId: _zod.z.uuid().describe('Id of the role to assign')
});
const createAssignRoleToWorkspaceMemberTool = (deps, context)=>({
        name: 'assign_role_to_workspace_member',
        description: `Assign a role to a workspace member, replacing their current role.

You cannot change your own role, assign a role that does not allow user assignment (canBeAssignedToUsers=false), or remove the admin role from the last administrator.`,
        inputSchema: assignRoleToWorkspaceMemberSchema,
        execute: async (parameters)=>{
            try {
                const { workspaceMember } = await deps.userRoleService.assignRoleToWorkspaceMember({
                    workspaceId: context.workspaceId,
                    workspaceMemberId: parameters.workspaceMemberId,
                    roleId: parameters.roleId,
                    actingUserWorkspaceId: context.callerUserWorkspaceId
                });
                return {
                    success: true,
                    message: `Role assigned to workspace member ${workspaceMember.name?.firstName ?? ''} ${workspaceMember.name?.lastName ?? ''}`.trim(),
                    result: {
                        workspaceMemberId: parameters.workspaceMemberId,
                        roleId: parameters.roleId
                    }
                };
            } catch (error) {
                const message = (0, _toroletoolerrormessageutil.toRoleToolErrorMessage)(error);
                return {
                    success: false,
                    message: `Failed to assign role: ${message}`,
                    error: message
                };
            }
        }
    });

//# sourceMappingURL=assign-role-to-workspace-member.tool.js.map