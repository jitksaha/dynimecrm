"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _238workspacecommand1787982276903addcalendareventrelationsviewfieldcommand = require("../2-38-workspace-command-1787982276903-add-calendar-event-relations-view-field.command");
const _workspacemigrationbuilderexception = require("../../../../../engine/workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
jest.mock('src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant');
const computeTwentyStandardApplicationAllFlatEntityMapsMock = _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps;
const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const VIEW_ID = '20202020-0000-0000-0000-000000000002';
const STANDARD_APPLICATION = {
    id: '20202020-0000-0000-0000-0000000000aa',
    universalIdentifier: '20202020-0000-0000-0000-0000000000bb'
};
const CALENDAR_EVENT_RECORD_PAGE_FIELDS_VIEW_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.universalIdentifier;
const RELATIONS_VIEW_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.viewFields.calendarEventTargets.universalIdentifier;
const CALENDAR_EVENT_TARGETS_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventTargets.universalIdentifier;
const buildByUniversalIdentifierMap = (flatEntities)=>({
        byUniversalIdentifier: Object.fromEntries(flatEntities.map((flatEntity)=>[
                flatEntity.universalIdentifier,
                flatEntity
            ]))
    });
describe('AddCalendarEventRelationsViewFieldCommand', ()=>{
    let command;
    let getOrRecomputeMock;
    let validateBuildAndRunWorkspaceMigrationMock;
    beforeEach(()=>{
        jest.clearAllMocks();
        getOrRecomputeMock = jest.fn();
        validateBuildAndRunWorkspaceMigrationMock = jest.fn().mockResolvedValue({
            status: 'success'
        });
        computeTwentyStandardApplicationAllFlatEntityMapsMock.mockReturnValue({
            allFlatEntityMaps: {
                flatViewFieldMaps: buildByUniversalIdentifierMap([
                    {
                        universalIdentifier: RELATIONS_VIEW_FIELD_UNIVERSAL_IDENTIFIER
                    }
                ])
            }
        });
        command = new _238workspacecommand1787982276903addcalendareventrelationsviewfieldcommand.AddCalendarEventRelationsViewFieldCommand({}, {
            findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
                twentyStandardFlatApplication: STANDARD_APPLICATION
            })
        }, {
            getOrRecompute: getOrRecomputeMock
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
    const mockWorkspaceCache = ({ viewExists = true, targetsFieldExists = true, viewFields = [] })=>{
        getOrRecomputeMock.mockResolvedValue({
            flatFieldMetadataMaps: buildByUniversalIdentifierMap(targetsFieldExists ? [
                {
                    universalIdentifier: CALENDAR_EVENT_TARGETS_FIELD_UNIVERSAL_IDENTIFIER
                }
            ] : []),
            flatViewMaps: buildByUniversalIdentifierMap(viewExists ? [
                {
                    id: VIEW_ID,
                    universalIdentifier: CALENDAR_EVENT_RECORD_PAGE_FIELDS_VIEW_UNIVERSAL_IDENTIFIER
                }
            ] : []),
            flatViewFieldMaps: buildByUniversalIdentifierMap(viewFields)
        });
    };
    it('creates the Relations view field', async ()=>{
        mockWorkspaceCache({});
        await runOnWorkspace();
        const [payload] = validateBuildAndRunWorkspaceMigrationMock.mock.calls[0];
        expect(payload.allFlatEntityOperationByMetadataName.viewField.flatEntityToCreate).toEqual([
            expect.objectContaining({
                universalIdentifier: RELATIONS_VIEW_FIELD_UNIVERSAL_IDENTIFIER
            })
        ]);
    });
    it('is idempotent when the Relations view field already exists', async ()=>{
        mockWorkspaceCache({
            viewFields: [
                {
                    universalIdentifier: RELATIONS_VIEW_FIELD_UNIVERSAL_IDENTIFIER
                }
            ]
        });
        await runOnWorkspace();
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
    });
    it('skips workspaces without a Calendar Event record page fields view', async ()=>{
        mockWorkspaceCache({
            viewExists: false
        });
        await runOnWorkspace();
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
    });
    it('skips workspaces where calendarEventTargets does not exist yet', async ()=>{
        mockWorkspaceCache({
            targetsFieldExists: false
        });
        await runOnWorkspace();
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
    });
    it('throws a workspace migration builder exception when the migration fails', async ()=>{
        mockWorkspaceCache({});
        validateBuildAndRunWorkspaceMigrationMock.mockResolvedValue({
            status: 'fail'
        });
        await expect(runOnWorkspace()).rejects.toBeInstanceOf(_workspacemigrationbuilderexception.WorkspaceMigrationBuilderException);
    });
    it('does not write metadata in dry-run mode', async ()=>{
        mockWorkspaceCache({});
        await runOnWorkspace(true);
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-38-workspace-command-1787982276903-add-calendar-event-relations-view-field.command.spec.js.map