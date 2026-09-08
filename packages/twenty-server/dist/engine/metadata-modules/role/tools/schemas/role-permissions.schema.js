"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "rolePermissionsSchema", {
    enumerable: true,
    get: function() {
        return rolePermissionsSchema;
    }
});
const _zod = require("zod");
const rolePermissionsSchema = _zod.z.object({
    canUpdateAllSettings: _zod.z.boolean().optional().describe('Grants full settings/admin access'),
    canAccessAllTools: _zod.z.boolean().optional().describe('Grants access to all workspace tools'),
    canReadAllObjectRecords: _zod.z.boolean().optional().describe('Default read access on all objects'),
    canUpdateAllObjectRecords: _zod.z.boolean().optional().describe('Default update access on all objects'),
    canSoftDeleteAllObjectRecords: _zod.z.boolean().optional().describe('Default soft-delete access on all objects'),
    canDestroyAllObjectRecords: _zod.z.boolean().optional().describe('Default destroy access on all objects'),
    canBeAssignedToUsers: _zod.z.boolean().optional().describe('Whether the role can be assigned to users'),
    canBeAssignedToAgents: _zod.z.boolean().optional().describe('Whether the role can be assigned to AI agents'),
    canBeAssignedToApiKeys: _zod.z.boolean().optional().describe('Whether the role can be assigned to API keys')
});

//# sourceMappingURL=role-permissions.schema.js.map