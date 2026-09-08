"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _238workspacecommand1788299312343simplifystandardtasknotelayoutscommand = require("../2-38-workspace-command-1788299312343-simplify-standard-task-note-layouts.command");
const _computestandardtasknotelayoutmigrationoperationsutil = require("../utils/compute-standard-task-note-layout-migration-operations.util");
const _workspacemigrationbuilderexception = require("../../../../../engine/workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
jest.mock('src/database/commands/upgrade-version-command/2-38/utils/compute-standard-task-note-layout-migration-operations.util');
const computeOperationsMock = _computestandardtasknotelayoutmigrationoperationsutil.computeStandardTaskNoteLayoutMigrationOperations;
const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const STANDARD_APPLICATION = {
    id: '20202020-0000-0000-0000-0000000000aa',
    universalIdentifier: '20202020-0000-0000-0000-0000000000bb'
};
const MIGRATION_OPERATIONS = {
    pageLayoutTabsToDelete: [
        {
            universalIdentifier: 'tab'
        }
    ],
    skippedLayouts: [],
    viewFieldGroupsToDelete: [
        {
            universalIdentifier: 'group'
        }
    ],
    viewFieldsToDelete: [
        {
            universalIdentifier: 'field'
        }
    ]
};
describe('SimplifyStandardTaskNoteLayoutsCommand', ()=>{
    let command;
    let validateBuildAndRunWorkspaceMigrationMock;
    beforeEach(()=>{
        jest.clearAllMocks();
        computeOperationsMock.mockReturnValue(MIGRATION_OPERATIONS);
        validateBuildAndRunWorkspaceMigrationMock = jest.fn().mockResolvedValue({
            status: 'success'
        });
        command = new _238workspacecommand1788299312343simplifystandardtasknotelayoutscommand.SimplifyStandardTaskNoteLayoutsCommand({}, {
            findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
                twentyStandardFlatApplication: STANDARD_APPLICATION
            })
        }, {
            getOrRecompute: jest.fn().mockResolvedValue({})
        }, {
            validateBuildAndRunLegacyWorkspaceMigration: validateBuildAndRunWorkspaceMigrationMock
        });
    });
    const runOnWorkspace = (dryRun = false)=>command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            options: {
                dryRun
            },
            index: 0,
            total: 1
        });
    it('runs the computed operations through the workspace migration service', async ()=>{
        await runOnWorkspace();
        expect(validateBuildAndRunWorkspaceMigrationMock).toHaveBeenCalledWith(expect.objectContaining({
            allFlatEntityOperationByMetadataName: {
                pageLayoutTab: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: MIGRATION_OPERATIONS.pageLayoutTabsToDelete,
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: MIGRATION_OPERATIONS.viewFieldsToDelete,
                    flatEntityToUpdate: []
                },
                viewFieldGroup: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: MIGRATION_OPERATIONS.viewFieldGroupsToDelete,
                    flatEntityToUpdate: []
                }
            }
        }));
    });
    it('does not write metadata in dry-run mode', async ()=>{
        await runOnWorkspace(true);
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
    });
    it('throws a workspace migration builder exception when the migration fails', async ()=>{
        validateBuildAndRunWorkspaceMigrationMock.mockResolvedValue({
            status: 'fail'
        });
        await expect(runOnWorkspace()).rejects.toBeInstanceOf(_workspacemigrationbuilderexception.WorkspaceMigrationBuilderException);
    });
});

//# sourceMappingURL=2-38-workspace-command-1788299312343-simplify-standard-task-note-layouts.command.spec.js.map