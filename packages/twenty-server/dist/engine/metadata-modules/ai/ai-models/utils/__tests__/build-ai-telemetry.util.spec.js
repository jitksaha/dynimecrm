"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _aitelemetryconst = require("../../constants/ai-telemetry.const");
const _buildaitelemetryutil = require("../build-ai-telemetry.util");
describe('buildAiTelemetry', ()=>{
    it('should spread the shared telemetry config and set the functionId', ()=>{
        const telemetry = (0, _buildaitelemetryutil.buildAiTelemetry)({
            functionId: 'ai-chat-stream'
        });
        expect(telemetry).toMatchObject(_aitelemetryconst.AI_TELEMETRY_CONFIG);
        expect(telemetry.functionId).toBe('ai-chat-stream');
    });
    it('should include every provided identifier in metadata', ()=>{
        const telemetry = (0, _buildaitelemetryutil.buildAiTelemetry)({
            functionId: 'agent-execution',
            workspaceId: 'workspace-id',
            userWorkspaceId: 'user-workspace-id',
            agentId: 'agent-id',
            threadId: 'thread-id',
            turnId: 'turn-id',
            streamId: 'stream-id'
        });
        expect(telemetry.metadata).toEqual({
            workspaceId: 'workspace-id',
            userWorkspaceId: 'user-workspace-id',
            agentId: 'agent-id',
            threadId: 'thread-id',
            turnId: 'turn-id',
            streamId: 'stream-id'
        });
    });
    it('should omit undefined, null, and empty identifiers', ()=>{
        const telemetry = (0, _buildaitelemetryutil.buildAiTelemetry)({
            functionId: 'agent-title-generation',
            workspaceId: 'workspace-id',
            userWorkspaceId: null,
            agentId: undefined,
            threadId: ''
        });
        expect(telemetry.metadata).toEqual({
            workspaceId: 'workspace-id'
        });
    });
});

//# sourceMappingURL=build-ai-telemetry.util.spec.js.map