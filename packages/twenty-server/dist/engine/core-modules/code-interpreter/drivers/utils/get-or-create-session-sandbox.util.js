"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getOrCreateSessionSandbox", {
    enumerable: true,
    get: function() {
        return getOrCreateSessionSandbox;
    }
});
const _utils = require("twenty-shared/utils");
const _sessionsandboxmetadatakeyconstant = require("../../constants/session-sandbox-metadata-key.constant");
const listSandboxesForSession = async (sandboxApi, apiKey, sessionId)=>{
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
    // Re-check the tag client-side so a loose server-side match can never reuse
    // another tenant's sandbox.
    return sandboxes.filter((sandbox)=>sandbox.metadata?.[_sessionsandboxmetadatakeyconstant.SESSION_SANDBOX_METADATA_KEY] === sessionId);
};
const connectAndKeepAlive = async (sandboxApi, apiKey, sandboxId, timeoutMs)=>{
    const sandbox = await sandboxApi.connect(sandboxId, {
        apiKey
    }).catch(()=>undefined);
    if (!(0, _utils.isDefined)(sandbox)) {
        return undefined;
    }
    try {
        await sandbox.setTimeout(timeoutMs);
        return sandbox;
    } catch  {
        // Couldn't refresh the timeout — kill it instead of leaking a running sandbox.
        await sandbox.kill().catch(()=>undefined);
        return undefined;
    }
};
const killSandboxById = (sandboxApi, apiKey, sandboxId)=>sandboxApi.kill(sandboxId, {
        apiKey
    }).catch(()=>undefined);
const createSessionSandbox = (sandboxApi, apiKey, sessionId, timeoutMs)=>sandboxApi.create({
        apiKey,
        timeoutMs,
        lifecycle: {
            onTimeout: 'pause',
            autoResume: true
        },
        metadata: {
            [_sessionsandboxmetadatakeyconstant.SESSION_SANDBOX_METADATA_KEY]: sessionId
        }
    });
const getOrCreateSessionSandbox = async ({ sandboxApi, apiKey, sessionId, timeoutMs, idleTimeoutMs })=>{
    // The sandbox must outlive a single execution and the idle window before it
    // auto-pauses, so take the larger of the two.
    const aliveTimeoutMs = Math.max(timeoutMs, idleTimeoutMs);
    const sessionSandboxes = await listSandboxesForSession(sandboxApi, apiKey, sessionId);
    let reusedSandbox;
    let reusedSandboxId;
    for (const { sandboxId } of sessionSandboxes){
        const sandbox = await connectAndKeepAlive(sandboxApi, apiKey, sandboxId, aliveTimeoutMs);
        if ((0, _utils.isDefined)(sandbox)) {
            reusedSandbox = sandbox;
            reusedSandboxId = sandboxId;
            break;
        }
    }
    if ((0, _utils.isDefined)(reusedSandbox)) {
        await Promise.all(sessionSandboxes.filter(({ sandboxId })=>sandboxId !== reusedSandboxId).map(({ sandboxId })=>killSandboxById(sandboxApi, apiKey, sandboxId)));
        return {
            sandbox: reusedSandbox,
            isReused: true
        };
    }
    const sandbox = await createSessionSandbox(sandboxApi, apiKey, sessionId, aliveTimeoutMs);
    return {
        sandbox,
        isReused: false
    };
};

//# sourceMappingURL=get-or-create-session-sandbox.util.js.map