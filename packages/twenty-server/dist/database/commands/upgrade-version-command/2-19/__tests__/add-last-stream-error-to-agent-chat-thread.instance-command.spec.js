"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _219instancecommandfast1782996657000addlaststreamerrortoagentchatthread = require("../2-19-instance-command-fast-1782996657000-add-last-stream-error-to-agent-chat-thread");
describe('AddLastStreamErrorToAgentChatThreadFastInstanceCommand', ()=>{
    let command;
    beforeEach(()=>{
        command = new _219instancecommandfast1782996657000addlaststreamerrortoagentchatthread.AddLastStreamErrorToAgentChatThreadFastInstanceCommand();
    });
    describe('up', ()=>{
        it('adds the lastStreamError column without mutating data', async ()=>{
            const query = jest.fn().mockResolvedValue(undefined);
            const queryRunner = {
                query
            };
            await command.up(queryRunner);
            expect(query.mock.calls.map((call)=>call[0])).toEqual([
                'ALTER TABLE "core"."agentChatThread" ADD COLUMN IF NOT EXISTS "lastStreamError" jsonb'
            ]);
        });
    });
    describe('down', ()=>{
        it('drops the lastStreamError column', async ()=>{
            const query = jest.fn().mockResolvedValue(undefined);
            const queryRunner = {
                query
            };
            await command.down(queryRunner);
            expect(query.mock.calls.map((call)=>call[0])).toEqual([
                'ALTER TABLE "core"."agentChatThread" DROP COLUMN IF EXISTS "lastStreamError"'
            ]);
        });
    });
});

//# sourceMappingURL=add-last-stream-error-to-agent-chat-thread.instance-command.spec.js.map