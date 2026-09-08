"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createUpdateRoleTool", {
    enumerable: true,
    get: function() {
        return createUpdateRoleTool;
    }
});
const _zod = require("zod");
const _rolepermissionsschema = require("./schemas/role-permissions.schema");
const _torolesummaryutil = require("./utils/to-role-summary.util");
const _toroletoolerrormessageutil = require("./utils/to-role-tool-error-message.util");
const updateRoleSchema = _zod.z.object({
    roleId: _zod.z.uuid().describe('Id of the role to update'),
    update: _rolepermissionsschema.rolePermissionsSchema.extend({
        label: _zod.z.string().min(1).optional().describe('New display name'),
        description: _zod.z.string().optional().describe('New description'),
        icon: _zod.z.string().optional().describe('New icon identifier')
    }).describe('Fields to change; omitted fields are left untouched')
});
const createUpdateRoleTool = (deps, context)=>({
        name: 'update_role',
        description: `Update an existing role's label, description, icon, global record permissions, settings access, or assignability.

System-managed roles (isEditable=false, like Admin) cannot be updated. Updates that would remove your own access to role management are rejected.`,
        inputSchema: updateRoleSchema,
        execute: async (parameters)=>{
            try {
                const role = await deps.roleService.updateRole({
                    workspaceId: context.workspaceId,
                    input: {
                        id: parameters.roleId,
                        update: parameters.update
                    },
                    actingRoleIds: context.callerRoleIds
                });
                return {
                    success: true,
                    message: `Role "${role.label}" updated`,
                    result: (0, _torolesummaryutil.toRoleSummary)(role)
                };
            } catch (error) {
                const message = (0, _toroletoolerrormessageutil.toRoleToolErrorMessage)(error);
                return {
                    success: false,
                    message: `Failed to update role: ${message}`,
                    error: message
                };
            }
        }
    });

//# sourceMappingURL=update-role.tool.js.map