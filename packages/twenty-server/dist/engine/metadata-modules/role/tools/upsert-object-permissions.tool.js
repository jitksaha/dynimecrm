"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createUpsertObjectPermissionsTool", {
    enumerable: true,
    get: function() {
        return createUpsertObjectPermissionsTool;
    }
});
const _zod = require("zod");
const _torolesummaryutil = require("./utils/to-role-summary.util");
const _toroletoolerrormessageutil = require("./utils/to-role-tool-error-message.util");
const upsertObjectPermissionsSchema = _zod.z.object({
    roleId: _zod.z.uuid().describe('Id of the role to set overrides on'),
    objectPermissions: _zod.z.array(_zod.z.object({
        objectMetadataId: _zod.z.uuid().describe('Id of the object metadata the override applies to'),
        canReadObjectRecords: _zod.z.boolean().optional().describe('Override read access for this object'),
        canUpdateObjectRecords: _zod.z.boolean().optional().describe('Override update access for this object'),
        canSoftDeleteObjectRecords: _zod.z.boolean().optional().describe('Override soft-delete access for this object'),
        canDestroyObjectRecords: _zod.z.boolean().optional().describe('Override destroy access for this object')
    })).min(1).describe("The complete set of per-object overrides to keep on the role. Overrides for objects omitted from this list are removed and fall back to the role's global permissions.")
});
const createUpsertObjectPermissionsTool = (deps, context)=>({
        name: 'upsert_object_permissions',
        description: `Set per-object permission overrides on a role, e.g. make an object read-only for that role.

IMPORTANT: this replaces the role's full override list. Include every override you want to keep; objects omitted from the list revert to the role's global permissions (canReadAllObjectRecords, ...). Use list_roles first to see current overrides.
Example read-only override: { objectMetadataId, canReadObjectRecords: true, canUpdateObjectRecords: false, canSoftDeleteObjectRecords: false, canDestroyObjectRecords: false }.
Granting write access without read access is rejected. System-managed roles (like Admin) cannot be changed.`,
        inputSchema: upsertObjectPermissionsSchema,
        execute: async (parameters)=>{
            try {
                const objectPermissions = await deps.objectPermissionService.upsertObjectPermissions({
                    workspaceId: context.workspaceId,
                    input: {
                        roleId: parameters.roleId,
                        objectPermissions: parameters.objectPermissions
                    }
                });
                return {
                    success: true,
                    message: 'Object permissions updated',
                    result: {
                        roleId: parameters.roleId,
                        objectPermissions: objectPermissions.map(_torolesummaryutil.toObjectPermissionSummary)
                    }
                };
            } catch (error) {
                const message = (0, _toroletoolerrormessageutil.toRoleToolErrorMessage)(error);
                return {
                    success: false,
                    message: `Failed to upsert object permissions: ${message}`,
                    error: message
                };
            }
        }
    });

//# sourceMappingURL=upsert-object-permissions.tool.js.map