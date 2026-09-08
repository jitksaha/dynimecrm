"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _238workspacecommand1787918663365configuretimelineactivityhappensatcommand = require("../2-38-workspace-command-1787918663365-configure-timeline-activity-happens-at.command");
const WORKSPACE_ID = '00000000-0000-4000-8000-000000000001';
const STANDARD_APPLICATION_ID = '00000000-0000-4000-8000-000000000002';
const buildCommand = ({ invalidateAndRecompute })=>new _238workspacecommand1787918663365configuretimelineactivityhappensatcommand.ConfigureTimelineActivityHappensAtCommand({}, {
        findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
            twentyStandardFlatApplication: {
                id: STANDARD_APPLICATION_ID
            }
        })
    }, {
        invalidateAndRecompute
    });
describe('ConfigureTimelineActivityHappensAtCommand', ()=>{
    it('points the standard linked types at their semantic timestamp fields', async ()=>{
        const query = jest.fn().mockResolvedValueOnce([
            [],
            2
        ]);
        const invalidateAndRecompute = jest.fn().mockResolvedValue(undefined);
        const command = buildCommand({
            invalidateAndRecompute
        });
        await command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            dataSource: {
                query
            },
            options: {},
            index: 0,
            total: 1
        });
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toContain('"happensAtFieldUniversalIdentifier"');
        expect(query.mock.calls[0][0]).toContain('timeline_activity_type."applicationId" = $2');
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining([
            WORKSPACE_ID,
            STANDARD_APPLICATION_ID,
            _metadata.STANDARD_OBJECTS.message.fields.receivedAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.startsAt.universalIdentifier
        ]));
        expect(invalidateAndRecompute).toHaveBeenCalledWith(WORKSPACE_ID, [
            'flatTimelineActivityTypeMaps'
        ]);
    });
    it('does not block the fleet when optional standard metadata is missing', async ()=>{
        const query = jest.fn().mockResolvedValueOnce([
            [],
            1
        ]);
        const invalidateAndRecompute = jest.fn().mockResolvedValue(undefined);
        const command = buildCommand({
            invalidateAndRecompute
        });
        jest.spyOn(command['logger'], 'warn').mockImplementation();
        await command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            dataSource: {
                query
            },
            options: {},
            index: 0,
            total: 1
        });
        expect(invalidateAndRecompute).toHaveBeenCalledTimes(1);
        expect(command['logger'].warn).toHaveBeenCalled();
    });
    it('only logs on a dry run', async ()=>{
        const query = jest.fn();
        const invalidateAndRecompute = jest.fn();
        const command = buildCommand({
            invalidateAndRecompute
        });
        jest.spyOn(command['logger'], 'log').mockImplementation();
        await command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            dataSource: {
                query
            },
            options: {
                dryRun: true
            },
            index: 0,
            total: 1
        });
        expect(query).not.toHaveBeenCalled();
        expect(invalidateAndRecompute).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-38-workspace-command-1787918663365-configure-timeline-activity-happens-at.command.spec.js.map