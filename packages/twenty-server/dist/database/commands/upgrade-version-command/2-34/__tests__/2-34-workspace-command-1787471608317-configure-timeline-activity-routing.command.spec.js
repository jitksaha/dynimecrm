"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _234workspacecommand1787471608317configuretimelineactivityroutingcommand = require("../2-34-workspace-command-1787471608317-configure-timeline-activity-routing.command");
const WORKSPACE_ID = '00000000-0000-4000-8000-000000000001';
const STANDARD_APPLICATION_ID = '00000000-0000-4000-8000-000000000002';
const getOrRecomputeWithTimelineActivity = ()=>jest.fn().mockResolvedValue({
        flatObjectMetadataMaps: {
            byUniversalIdentifier: {
                [_metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier]: {}
            }
        }
    });
const createTransactionalDataSource = (query)=>{
    const queryRunner = {
        isTransactionActive: true,
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        rollbackTransaction: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined)
    };
    return {
        dataSource: {
            query,
            createQueryRunner: jest.fn(()=>queryRunner)
        },
        queryRunner
    };
};
describe('ConfigureTimelineActivityRoutingCommand', ()=>{
    it('backfills standard types and participant junctions into the generic contract', async ()=>{
        const query = jest.fn().mockResolvedValueOnce([
            [],
            8
        ]).mockResolvedValueOnce([
            [],
            2
        ]);
        const { dataSource, queryRunner } = createTransactionalDataSource(query);
        const invalidateAndRecompute = jest.fn().mockResolvedValue(undefined);
        const command = new _234workspacecommand1787471608317configuretimelineactivityroutingcommand.ConfigureTimelineActivityRoutingCommand({}, {
            findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
                twentyStandardFlatApplication: {
                    id: STANDARD_APPLICATION_ID
                }
            })
        }, {
            getOrRecompute: getOrRecomputeWithTimelineActivity(),
            invalidateAndRecompute
        });
        await command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            dataSource,
            options: {},
            index: 0,
            total: 1
        });
        expect(query).toHaveBeenCalledTimes(2);
        expect(query.mock.calls[0][0]).toContain('"targetRelationFieldUniversalIdentifier"');
        expect(query.mock.calls[0][0]).toContain('"triggerFieldUniversalIdentifiers"');
        expect(query.mock.calls[0][0]).toContain('timeline_activity_type."applicationId" = $2');
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining([
            WORKSPACE_ID,
            STANDARD_APPLICATION_ID,
            _metadata.STANDARD_OBJECTS.note.fields.noteTargets.universalIdentifier,
            _metadata.STANDARD_OBJECTS.message.fields.messageParticipants.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventParticipants.universalIdentifier
        ]));
        expect(query.mock.calls[0][1]).toContainEqual([
            _metadata.STANDARD_OBJECTS.note.fields.title.universalIdentifier
        ]);
        expect(query.mock.calls[1][0]).toContain('junctionTargetFieldId');
        expect(query.mock.calls[1][1]).toEqual(expect.arrayContaining([
            _metadata.STANDARD_OBJECTS.messageParticipant.fields.person.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEventParticipant.fields.person.universalIdentifier
        ]));
        expect(invalidateAndRecompute).toHaveBeenCalledWith(WORKSPACE_ID, [
            'flatTimelineActivityTypeMaps',
            'flatFieldMetadataMaps'
        ]);
        expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
        expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });
    it('does not block the fleet when optional standard metadata is missing', async ()=>{
        const invalidateAndRecompute = jest.fn().mockResolvedValue(undefined);
        const { dataSource } = createTransactionalDataSource(jest.fn().mockResolvedValueOnce([
            [],
            7
        ]).mockResolvedValueOnce([
            [],
            2
        ]));
        const command = new _234workspacecommand1787471608317configuretimelineactivityroutingcommand.ConfigureTimelineActivityRoutingCommand({}, {
            findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
                twentyStandardFlatApplication: {
                    id: STANDARD_APPLICATION_ID
                }
            })
        }, {
            getOrRecompute: getOrRecomputeWithTimelineActivity(),
            invalidateAndRecompute
        });
        await command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            dataSource,
            options: {},
            index: 0,
            total: 1
        });
        expect(invalidateAndRecompute).toHaveBeenCalledTimes(1);
    });
    it('rolls back both routing updates when the junction update fails', async ()=>{
        const query = jest.fn().mockResolvedValueOnce([
            [],
            8
        ]).mockRejectedValueOnce(new Error('junction update failed'));
        const { dataSource, queryRunner } = createTransactionalDataSource(query);
        const invalidateAndRecompute = jest.fn();
        const command = new _234workspacecommand1787471608317configuretimelineactivityroutingcommand.ConfigureTimelineActivityRoutingCommand({}, {
            findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
                twentyStandardFlatApplication: {
                    id: STANDARD_APPLICATION_ID
                }
            })
        }, {
            getOrRecompute: getOrRecomputeWithTimelineActivity(),
            invalidateAndRecompute
        });
        await expect(command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            dataSource,
            options: {},
            index: 0,
            total: 1
        })).rejects.toThrow('junction update failed');
        expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
        expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalledTimes(1);
        expect(invalidateAndRecompute).not.toHaveBeenCalled();
    });
    it('skips workspaces without timeline metadata', async ()=>{
        const query = jest.fn();
        const findStandardApplication = jest.fn();
        const command = new _234workspacecommand1787471608317configuretimelineactivityroutingcommand.ConfigureTimelineActivityRoutingCommand({}, {
            findWorkspaceTwentyStandardAndCustomApplicationOrThrow: findStandardApplication
        }, {
            getOrRecompute: jest.fn().mockResolvedValue({
                flatObjectMetadataMaps: {
                    byUniversalIdentifier: {}
                }
            })
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
        expect(query).not.toHaveBeenCalled();
        expect(findStandardApplication).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-34-workspace-command-1787471608317-configure-timeline-activity-routing.command.spec.js.map