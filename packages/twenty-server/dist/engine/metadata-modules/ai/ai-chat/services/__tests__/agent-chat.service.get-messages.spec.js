"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _agentchatservice = require("../agent-chat.service");
const WORKSPACE_ID = 'workspace-id';
const THREAD_ID = 'thread-id';
const USER_WORKSPACE_ID = 'user-workspace-id';
const buildService = ()=>{
    const threadRepository = {
        findOne: jest.fn().mockResolvedValue({
            id: THREAD_ID
        })
    };
    const messageRepository = {
        find: jest.fn().mockResolvedValue([])
    };
    const service = new _agentchatservice.AgentChatService(threadRepository, {}, messageRepository, {}, {}, {}, {}, {});
    return {
        service,
        messageRepository
    };
};
describe('AgentChatService getMessagesForThread', ()=>{
    afterEach(()=>{
        jest.clearAllMocks();
    });
    it('excludes hidden messages by default', async ()=>{
        const { service, messageRepository } = buildService();
        await service.getMessagesForThread({
            threadId: THREAD_ID,
            userWorkspaceId: USER_WORKSPACE_ID,
            workspaceId: WORKSPACE_ID
        });
        expect(messageRepository.find).toHaveBeenCalledWith(WORKSPACE_ID, expect.objectContaining({
            where: {
                threadId: THREAD_ID,
                isHidden: false
            }
        }));
    });
    it('includes hidden messages when includeHidden is set', async ()=>{
        const { service, messageRepository } = buildService();
        await service.getMessagesForThread({
            threadId: THREAD_ID,
            userWorkspaceId: USER_WORKSPACE_ID,
            workspaceId: WORKSPACE_ID,
            includeHidden: true
        });
        expect(messageRepository.find).toHaveBeenCalledWith(WORKSPACE_ID, expect.objectContaining({
            where: {
                threadId: THREAD_ID
            }
        }));
    });
});

//# sourceMappingURL=agent-chat.service.get-messages.spec.js.map