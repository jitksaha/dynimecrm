"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _sessionsandboxmetadatakeyconstant = require("../../../constants/session-sandbox-metadata-key.constant");
const _sweepexpiredsessionsandboxesutil = require("../sweep-expired-session-sandboxes.util");
const apiKey = 'test-api-key';
const sessionId = 'workspace-1:thread-1';
const dayMs = 24 * 60 * 60 * 1000;
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
const sandboxInfo = (sandboxId, { tag = sessionId, ageMs = 0 } = {})=>({
        sandboxId,
        metadata: tag === null ? {} : {
            [_sessionsandboxmetadatakeyconstant.SESSION_SANDBOX_METADATA_KEY]: tag
        },
        startedAt: new Date(Date.now() - ageMs).toISOString()
    });
describe('sweepExpiredSessionSandboxes', ()=>{
    it('kills only session sandboxes older than the max age', async ()=>{
        const { api, kill } = buildApi([
            sandboxInfo('sbx-old', {
                ageMs: 2 * dayMs
            }),
            sandboxInfo('sbx-fresh', {
                ageMs: 60 * 1000
            }),
            sandboxInfo('sbx-untagged', {
                tag: null,
                ageMs: 5 * dayMs
            })
        ]);
        const killed = await (0, _sweepexpiredsessionsandboxesutil.sweepExpiredSessionSandboxes)(api, apiKey, dayMs);
        expect(killed).toBe(1);
        expect(kill).toHaveBeenCalledWith('sbx-old', {
            apiKey
        });
        expect(kill).not.toHaveBeenCalledWith('sbx-fresh', {
            apiKey
        });
        expect(kill).not.toHaveBeenCalledWith('sbx-untagged', {
            apiKey
        });
    });
    it('lists both running and paused sandboxes', async ()=>{
        const { api, list } = buildApi([]);
        await (0, _sweepexpiredsessionsandboxesutil.sweepExpiredSessionSandboxes)(api, apiKey, 1000);
        expect(list).toHaveBeenCalledWith({
            apiKey,
            query: {
                state: [
                    'running',
                    'paused'
                ]
            }
        });
    });
});

//# sourceMappingURL=sweep-expired-session-sandboxes.util.spec.js.map