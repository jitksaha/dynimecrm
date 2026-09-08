"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _messagingongoingstalecronjob = require("../messaging-ongoing-stale.cron.job");
const _messagingongoingstalejob = require("../../../jobs/messaging-ongoing-stale.job");
describe('MessagingOngoingStaleCronJob', ()=>{
    let messageChannelRepository;
    let messageQueueService;
    let job;
    beforeEach(()=>{
        messageChannelRepository = {
            find: jest.fn().mockResolvedValue([
                {
                    workspaceId: 'workspace-1'
                },
                {
                    workspaceId: 'workspace-1'
                },
                {
                    workspaceId: 'workspace-2'
                }
            ])
        };
        messageQueueService = {
            add: jest.fn()
        };
        job = new _messagingongoingstalecronjob.MessagingOngoingStaleCronJob(messageChannelRepository, messageQueueService, {
            captureExceptions: jest.fn()
        });
    });
    it('enqueues recovery once per workspace with a stale channel', async ()=>{
        await job.handle();
        expect(messageQueueService.add).toHaveBeenCalledTimes(2);
        expect(messageQueueService.add).toHaveBeenNthCalledWith(1, _messagingongoingstalejob.MessagingOngoingStaleJob.name, {
            workspaceId: 'workspace-1'
        });
        expect(messageQueueService.add).toHaveBeenNthCalledWith(2, _messagingongoingstalejob.MessagingOngoingStaleJob.name, {
            workspaceId: 'workspace-2'
        });
    });
    it('does not enqueue recovery when no workspace has a stale channel', async ()=>{
        messageChannelRepository.find.mockResolvedValue([]);
        await job.handle();
        expect(messageQueueService.add).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=messaging-ongoing-stale.cron.job.spec.js.map