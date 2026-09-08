"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createCreateRoleTool", {
    enumerable: true,
    get: function() {
        return createCreateRoleTool;
    }
});
const _zod = require("zod");
const _rolepermissionsschema = require("./schemas/role-permissions.schema");
const _torolesummaryutil = require("./utils/to-role-summary.util");
const _toroletoolerrormessageutil = require("./utils/to-role-tool-error-message.util");
const createRoleSchema = _rolepermissionsschema.rolePermissionsSchema.extend({
    label: _zod.z.string().min(1).describe('Display name of the role'),
    description: _zod.z.string().optional().describe('Optional role description'),
    icon: _zod.z.string().optional().describe('Optional icon identifier (e.g. "IconUser")')
});
const createCreateRoleTool = (deps, context)=>({
        name: 'create_role',
        description: `Create a new role in this workspace.

Global record permissions (canReadAllObjectRecords, canUpdateAllObjectRecords, ...) and settings access default to false; assignability to users, agents and API keys defaults to true.
After creating the role, use upsert_object_permissions to set per-object overrides and upsert_row_level_permission_rules to restrict which records are visible.
Granting write access on an object without read access is invalid.`,
        inputSchema: createRoleSchema,
        execute: async (parameters)=>{
            try {
                const { workspaceCustomFlatApplication } = await deps.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
                    workspaceId: context.workspaceId
                });
                const role = await deps.roleService.createRole({
                    workspaceId: context.workspaceId,
                    input: parameters,
                    ownerFlatApplication: workspaceCustomFlatApplication
                });
                return {
                    success: true,
                    message: `Role "${role.label}" created`,
                    result: (0, _torolesummaryutil.toRoleSummary)(role)
                };
            } catch (error) {
                const message = (0, _toroletoolerrormessageutil.toRoleToolErrorMessage)(error);
                return {
                    success: false,
                    message: `Failed to create role: ${message}`,
                    error: message
                };
            }
        }
    });

//# sourceMappingURL=create-role.tool.js.map