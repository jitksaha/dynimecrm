"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _calendarongoingstalecronjob = require("../calendar-ongoing-stale.cron.job");
const _calendarongoingstalejob = require("../../../jobs/calendar-ongoing-stale.job");
describe('CalendarOngoingStaleCronJob', ()=>{
    let calendarChannelRepository;
    let messageQueueService;
    let job;
    beforeEach(()=>{
        calendarChannelRepository = {
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
        job = new _calendarongoingstalecronjob.CalendarOngoingStaleCronJob(calendarChannelRepository, messageQueueService, {
            captureExceptions: jest.fn()
        });
    });
    it('enqueues recovery once per workspace with a stale channel', async ()=>{
        await job.handle();
        expect(messageQueueService.add).toHaveBeenCalledTimes(2);
        expect(messageQueueService.add).toHaveBeenNthCalledWith(1, _calendarongoingstalejob.CalendarOngoingStaleJob.name, {
            workspaceId: 'workspace-1'
        });
        expect(messageQueueService.add).toHaveBeenNthCalledWith(2, _calendarongoingstalejob.CalendarOngoingStaleJob.name, {
            workspaceId: 'workspace-2'
        });
    });
    it('does not enqueue recovery when no workspace has a stale channel', async ()=>{
        calendarChannelRepository.find.mockResolvedValue([]);
        await job.handle();
        expect(messageQueueService.add).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=calendar-ongoing-stale.cron.job.spec.js.map