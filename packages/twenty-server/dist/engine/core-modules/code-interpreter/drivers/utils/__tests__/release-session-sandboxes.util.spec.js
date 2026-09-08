"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _sessionsandboxmetadatakeyconstant = require("../../../constants/session-sandbox-metadata-key.constant");
const _releasesessionsandboxesutil = require("../release-session-sandboxes.util");
const apiKey = 'test-api-key';
const sessionId = 'workspace-1:thread-1';
const paginatorOf = (items)=>{
    let fetched = false;
    return {
        get hasNext () {
            return !fetched;
        },
        nextItems: async ()=>{
            fetched = true;
            return items;
        }
    };
};
const buildApi = (items)=>{
    const kill = jest.fn().mockResolvedValue(true);
    const list = jest.fn(()=>paginatorOf(items));
    return {
        api: {
            list,
            kill
        },
        kill,
        list
    };
};
const sandboxInfo = (sandboxId, { tag = sessionId } = {})=>({
        sandboxId,
        metadata: tag === null ? {} : {
            [_sessionsandboxmetadatakeyconstant.SESSION_SANDBOX_METADATA_KEY]: tag
        },
        startedAt: new Date().toISOString()
    });
describe('releaseSessionSandboxes', ()=>{
    it('kills every sandbox tagged for the session', async ()=>{
        const { api, kill, list } = buildApi([
            sandboxInfo('sbx-1'),
            sandboxInfo('sbx-2')
        ]);
        await (0, _releasesessionsandboxesutil.releaseSessionSandboxes)(api, apiKey, sessionId);
        expect(list).toHaveBeenCalledWith({
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
        expect(kill).toHaveBeenCalledWith('sbx-1', {
            apiKey
        });
        expect(kill).toHaveBeenCalledWith('sbx-2', {
            apiKey
        });
    });
    it('ignores a sandbox whose tag does not match the session', async ()=>{
        const { api, kill } = buildApi([
            sandboxInfo('sbx-other', {
                tag: 'workspace-2:thread-9'
            })
        ]);
        await (0, _releasesessionsandboxesutil.releaseSessionSandboxes)(api, apiKey, sessionId);
        expect(kill).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=release-session-sandboxes.util.spec.js.map