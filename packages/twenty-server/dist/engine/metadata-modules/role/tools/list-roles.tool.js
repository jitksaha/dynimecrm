"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createListRolesTool", {
    enumerable: true,
    get: function() {
        return createListRolesTool;
    }
});
const _zod = require("zod");
const _torolesummaryutil = require("./utils/to-role-summary.util");
const _toroletoolerrormessageutil = require("./utils/to-role-tool-error-message.util");
const listRolesSchema = _zod.z.object({
    includeRowLevelPermissionRules: _zod.z.boolean().optional().describe("When true, include each role's row-level permission predicates and predicate groups (enterprise feature; empty when disabled).")
});
const createListRolesTool = (deps, context)=>({
        name: 'list_roles',
        description: `List all roles of this workspace with their permissions.

Returns for each role: global record permissions (canReadAllObjectRecords, ...), settings access (canUpdateAllSettings), per-object permission overrides, permission flags, and assignability (users, agents, API keys).
Roles with isEditable=false (like Admin) are system-managed and cannot be changed.`,
        inputSchema: listRolesSchema,
        execute: async (parameters)=>{
            try {
                if (!parameters.includeRowLevelPermissionRules) {
                    const roles = await deps.roleService.getWorkspaceRoles(context.workspaceId);
                    return {
                        success: true,
                        message: `Found ${roles.length} role${roles.length === 1 ? '' : 's'}`,
                        result: {
                            roles: roles.map(_torolesummaryutil.toRoleSummary)
                        }
                    };
                }
                const [roles, allPredicates, allPredicateGroups] = await Promise.all([
                    deps.roleService.getWorkspaceRoles(context.workspaceId),
                    deps.rowLevelPermissionPredicateService.findByWorkspaceId(context.workspaceId),
                    deps.rowLevelPermissionPredicateGroupService.findByWorkspaceId(context.workspaceId)
                ]);
                const rolesWithRules = roles.map((role)=>({
                        ...(0, _torolesummaryutil.toRoleSummary)(role),
                        rowLevelPermissionPredicates: allPredicates.filter((predicate)=>predicate.roleId === role.id),
                        rowLevelPermissionPredicateGroups: allPredicateGroups.filter((predicateGroup)=>predicateGroup.roleId === role.id)
                    }));
                return {
                    success: true,
                    message: `Found ${roles.length} role${roles.length === 1 ? '' : 's'}`,
                    result: {
                        roles: rolesWithRules
                    }
                };
            } catch (error) {
                const message = (0, _toroletoolerrormessageutil.toRoleToolErrorMessage)(error);
                return {
                    success: false,
                    message: `Failed to list roles: ${message}`,
                    error: message
                };
            }
        }
    });

//# sourceMappingURL=list-roles.tool.js.map