"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWorkspaceUninstallHookPayload", {
    enumerable: true,
    get: function() {
        return buildWorkspaceUninstallHookPayload;
    }
});
const buildWorkspaceUninstallHookPayload = ({ applicationVersion, applicationUniversalIdentifier, workspaceId, uninstallRequestedAt })=>({
        version: applicationVersion ?? undefined,
        idempotencyKey: `workspace-deletion:${workspaceId}:${uninstallRequestedAt.toISOString()}:${applicationUniversalIdentifier}`
    });

//# sourceMappingURL=build-workspace-uninstall-hook-payload.util.js.map