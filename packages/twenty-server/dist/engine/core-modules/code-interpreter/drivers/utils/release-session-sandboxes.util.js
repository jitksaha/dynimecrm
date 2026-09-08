"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "releaseSessionSandboxes", {
    enumerable: true,
    get: function() {
        return releaseSessionSandboxes;
    }
});
const _sessionsandboxmetadatakeyconstant = require("../../constants/session-sandbox-metadata-key.constant");
const releaseSessionSandboxes = async (sandboxApi, apiKey, sessionId)=>{
    const paginator = sandboxApi.list({
        apiKey,
        query: {
            state: [
                'running',
                'paused'
            ],
            metadata: {
                [_sessionsandboxmetadatakeyconstant.SESSION_SANDBOX_METADATA_KEY]: sessionId
            }
        }
    });
    const sandboxes = [];
    while(paginator.hasNext){
        sandboxes.push(...await paginator.nextItems());
    }
    await Promise.all(sandboxes.filter((sandbox)=>sandbox.metadata?.[_sessionsandboxmetadatakeyconstant.SESSION_SANDBOX_METADATA_KEY] === sessionId).map((sandbox)=>sandboxApi.kill(sandbox.sandboxId, {
            apiKey
        }).catch(()=>undefined)));
};

//# sourceMappingURL=release-session-sandboxes.util.js.map