"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createDeleteRoleTool", {
    enumerable: true,
    get: function() {
        return createDeleteRoleTool;
    }
});
const _zod = require("zod");
const _toroletoolerrormessageutil = require("./utils/to-role-tool-error-message.util");
const deleteRoleSchema = _zod.z.object({
    roleId: _zod.z.uuid().describe('Id of the role to delete')
});
const createDeleteRoleTool = (deps, context)=>({
        name: 'delete_role',
        description: `Delete a role. Members, agents and API keys assigned to it are reassigned to the workspace default role.

System-managed roles (isEditable=false, like Admin), the workspace default role, and roles you are assigned to cannot be deleted.`,
        inputSchema: deleteRoleSchema,
        execute: async (parameters)=>{
            try {
                const deletedRole = await deps.roleService.deleteRole({
                    roleId: parameters.roleId,
                    workspaceId: context.workspaceId,
                    actingRoleIds: context.callerRoleIds
                });
                return {
                    success: true,
                    message: `Role "${deletedRole.label}" deleted`,
                    result: {
                        id: deletedRole.id,
                        label: deletedRole.label
                    }
                };
            } catch (error) {
                const message = (0, _toroletoolerrormessageutil.toRoleToolErrorMessage)(error);
                return {
                    success: false,
                    message: `Failed to delete role: ${message}`,
                    error: message
                };
            }
        }
    });

//# sourceMappingURL=delete-role.tool.js.map