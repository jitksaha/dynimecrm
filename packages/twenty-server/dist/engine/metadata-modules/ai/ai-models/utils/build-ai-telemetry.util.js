"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildAiTelemetry", {
    enumerable: true,
    get: function() {
        return buildAiTelemetry;
    }
});
const _guards = require("@sniptt/guards");
const _aitelemetryconst = require("../constants/ai-telemetry.const");
const buildAiTelemetry = ({ functionId, workspaceId, userWorkspaceId, agentId, threadId, turnId, streamId })=>({
        ..._aitelemetryconst.AI_TELEMETRY_CONFIG,
        functionId,
        metadata: {
            ...(0, _guards.isNonEmptyString)(workspaceId) && {
                workspaceId
            },
            ...(0, _guards.isNonEmptyString)(userWorkspaceId) && {
                userWorkspaceId
            },
            ...(0, _guards.isNonEmptyString)(agentId) && {
                agentId
            },
            ...(0, _guards.isNonEmptyString)(threadId) && {
                threadId
            },
            ...(0, _guards.isNonEmptyString)(turnId) && {
                turnId
            },
            ...(0, _guards.isNonEmptyString)(streamId) && {
                streamId
            }
        }
    });

//# sourceMappingURL=build-ai-telemetry.util.js.map