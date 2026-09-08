"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _238workspacecommand1787914663665backfilllinkedtimelineactivityhappensatcommand = require("../2-38-workspace-command-1787914663665-backfill-linked-timeline-activity-happens-at.command");
const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const buildWorkspaceCacheService = ()=>({
        getOrRecompute: jest.fn().mockResolvedValue({
            flatTimelineActivityTypeMaps: {
                byUniversalIdentifier: {
                    'message-linked-type-uid': {
                        id: 'message-linked-type-id',
                        action: 'linked',
                        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.message.universalIdentifier
                    },
                    'calendar-event-linked-type-uid': {
                        id: 'calendar-event-linked-type-id',
                        action: 'linked',
                        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier
                    }
                }
            }
        })
    });
const PROVISIONED_TABLES = [
    {
        timelineActivity: 'workspace.timelineActivity',
        message: 'workspace.message',
        calendarEvent: 'workspace.calendarEvent'
    }
];
describe('BackfillLinkedTimelineActivityHappensAtCommand', ()=>{
    it('skips workspaces without a data source', async ()=>{
        const command = new _238workspacecommand1787914663665backfilllinkedtimelineactivityhappensatcommand.BackfillLinkedTimelineActivityHappensAtCommand({}, buildWorkspaceCacheService());
        jest.spyOn(command['logger'], 'warn').mockImplementation();
        await expect(command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            options: {},
            dataSource: undefined,
            index: 0,
            total: 1
        })).resolves.toBeUndefined();
        expect(command['logger'].warn).toHaveBeenCalledWith(`Skipping linked timeline activity happensAt backfill for workspace ${WORKSPACE_ID}: no workspace data source`);
    });
    it('skips workspaces whose tables were not provisioned', async ()=>{
        const query = jest.fn().mockResolvedValue([
            {
                timelineActivity: null,
                message: null,
                calendarEvent: null
            }
        ]);
        const command = new _238workspacecommand1787914663665backfilllinkedtimelineactivityhappensatcommand.BackfillLinkedTimelineActivityHappensAtCommand({}, buildWorkspaceCacheService());
        jest.spyOn(command['logger'], 'warn').mockImplementation();
        await command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            options: {},
            dataSource: {
                query
            },
            index: 0,
            total: 1
        });
        expect(query).toHaveBeenCalledTimes(1);
        expect(command['logger'].warn).toHaveBeenCalledWith(`Skipping linked timeline activity happensAt backfill for workspace ${WORKSPACE_ID}: tables are not provisioned`);
    });
    it('only counts candidates on a dry run', async ()=>{
        const query = jest.fn().mockResolvedValueOnce(PROVISIONED_TABLES).mockResolvedValueOnce([
            {
                count: 12
            }
        ]).mockResolvedValueOnce([
            {
                count: 3
            }
        ]);
        const command = new _238workspacecommand1787914663665backfilllinkedtimelineactivityhappensatcommand.BackfillLinkedTimelineActivityHappensAtCommand({}, buildWorkspaceCacheService());
        jest.spyOn(command['logger'], 'log').mockImplementation();
        await command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            options: {
                dryRun: true
            },
            dataSource: {
                query
            },
            index: 0,
            total: 1
        });
        expect(query).toHaveBeenCalledTimes(3);
        expect(command['logger'].log).toHaveBeenCalledWith(`[DRY RUN] Would rewrite happensAt on 12 message timeline activities for workspace ${WORKSPACE_ID}`);
        expect(command['logger'].log).toHaveBeenCalledWith(`[DRY RUN] Would rewrite happensAt on 3 calendar event timeline activities for workspace ${WORKSPACE_ID}`);
    });
    it('keeps rewriting batches until one comes back partial', async ()=>{
        const query = jest.fn().mockResolvedValueOnce(PROVISIONED_TABLES).mockResolvedValueOnce([
            [],
            5_000
        ]).mockResolvedValueOnce([
            [],
            42
        ]).mockResolvedValueOnce([
            [],
            0
        ]);
        const command = new _238workspacecommand1787914663665backfilllinkedtimelineactivityhappensatcommand.BackfillLinkedTimelineActivityHappensAtCommand({}, buildWorkspaceCacheService());
        jest.spyOn(command['logger'], 'log').mockImplementation();
        await command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            options: {},
            dataSource: {
                query
            },
            index: 0,
            total: 1
        });
        expect(query).toHaveBeenCalledTimes(4);
        expect(command['logger'].log).toHaveBeenCalledWith(`Rewrote happensAt on 5042 message timeline activities for workspace ${WORKSPACE_ID}`);
        expect(command['logger'].log).toHaveBeenCalledWith(`Rewrote happensAt on 0 calendar event timeline activities for workspace ${WORKSPACE_ID}`);
    });
});

//# sourceMappingURL=2-38-workspace-command-1787914663665-backfill-linked-timeline-activity-happens-at.command.spec.js.map