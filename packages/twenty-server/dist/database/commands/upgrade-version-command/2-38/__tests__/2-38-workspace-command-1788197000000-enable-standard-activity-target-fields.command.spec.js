"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _238workspacecommand1788197000000enablestandardactivitytargetfieldscommand = require("../2-38-workspace-command-1788197000000-enable-standard-activity-target-fields.command");
const WORKSPACE_ID = '00000000-0000-4000-8000-000000000001';
const STANDARD_APPLICATION_ID = '00000000-0000-4000-8000-000000000002';
const EXPECTED_FIELD_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.company.fields.taskTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.company.fields.noteTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.person.fields.taskTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.person.fields.noteTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.opportunity.fields.taskTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.opportunity.fields.noteTargets.universalIdentifier
];
const buildCommand = ({ invalidateAndRecompute })=>new _238workspacecommand1788197000000enablestandardactivitytargetfieldscommand.EnableStandardActivityTargetFieldsCommand({}, {
        findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
            twentyStandardFlatApplication: {
                id: STANDARD_APPLICATION_ID
            }
        })
    }, {
        invalidateAndRecompute
    });
const runCommand = async ({ command, query, dryRun = false })=>command.runOnWorkspace({
        workspaceId: WORKSPACE_ID,
        dataSource: {
            query
        },
        options: {
            dryRun
        },
        index: 0,
        total: 1
    });
describe('EnableStandardActivityTargetFieldsCommand', ()=>{
    it('updates only the six standard inverse fields in the workspace standard application', async ()=>{
        const query = jest.fn().mockResolvedValue([
            [],
            6
        ]);
        const invalidateAndRecompute = jest.fn().mockResolvedValue(undefined);
        const command = buildCommand({
            invalidateAndRecompute
        });
        await runCommand({
            command,
            query
        });
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][1]).toEqual([
            WORKSPACE_ID,
            STANDARD_APPLICATION_ID,
            EXPECTED_FIELD_UNIVERSAL_IDENTIFIERS
        ]);
        expect(invalidateAndRecompute).toHaveBeenCalledWith(WORKSPACE_ID, [
            'flatFieldMetadataMaps'
        ]);
    });
    it('is safe to rerun after the fields have already converged', async ()=>{
        const query = jest.fn().mockResolvedValueOnce([
            [],
            6
        ]).mockResolvedValueOnce([
            [],
            0
        ]);
        const invalidateAndRecompute = jest.fn().mockResolvedValue(undefined);
        const command = buildCommand({
            invalidateAndRecompute
        });
        jest.spyOn(command['logger'], 'log').mockImplementation();
        await runCommand({
            command,
            query
        });
        await runCommand({
            command,
            query
        });
        expect(query).toHaveBeenCalledTimes(2);
        expect(query.mock.calls[1]).toEqual(query.mock.calls[0]);
        expect(invalidateAndRecompute).toHaveBeenCalledTimes(2);
        expect(command['logger'].log).toHaveBeenLastCalledWith(`Made 0 standard activity target field(s) editable for workspace ${WORKSPACE_ID}`);
    });
    it('does not read or write metadata during a dry run', async ()=>{
        const query = jest.fn();
        const invalidateAndRecompute = jest.fn();
        const command = buildCommand({
            invalidateAndRecompute
        });
        jest.spyOn(command['logger'], 'log').mockImplementation();
        await runCommand({
            command,
            query,
            dryRun: true
        });
        expect(query).not.toHaveBeenCalled();
        expect(invalidateAndRecompute).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-38-workspace-command-1788197000000-enable-standard-activity-target-fields.command.spec.js.map