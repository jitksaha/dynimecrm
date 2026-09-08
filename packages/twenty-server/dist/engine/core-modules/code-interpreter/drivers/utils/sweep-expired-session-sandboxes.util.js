"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sweepExpiredSessionSandboxes", {
    enumerable: true,
    get: function() {
        return sweepExpiredSessionSandboxes;
    }
});
const _utils = require("twenty-shared/utils");
const _sessionsandboxmetadatakeyconstant = require("../../constants/session-sandbox-metadata-key.constant");
const sweepExpiredSessionSandboxes = async (sandboxApi, apiKey, maxAgeMs)=>{
    const paginator = sandboxApi.list({
        apiKey,
        query: {
            state: [
                'running',
                'paused'
            ]
        }
    });
    const sandboxes = [];
    while(paginator.hasNext){
        sandboxes.push(...await paginator.nextItems());
    }
    const expiredBefore = Date.now() - maxAgeMs;
    const expiredSandboxes = sandboxes.filter((sandbox)=>(0, _utils.isDefined)(sandbox.metadata?.[_sessionsandboxmetadatakeyconstant.SESSION_SANDBOX_METADATA_KEY]) && // startedAt is typed as Date but comes back as an ISO string at runtime.
        new Date(sandbox.startedAt).getTime() < expiredBefore);
    await Promise.all(expiredSandboxes.map((sandbox)=>sandboxApi.kill(sandbox.sandboxId, {
            apiKey
        }).catch(()=>undefined)));
    return expiredSandboxes.length;
};

//# sourceMappingURL=sweep-expired-session-sandboxes.util.js.map