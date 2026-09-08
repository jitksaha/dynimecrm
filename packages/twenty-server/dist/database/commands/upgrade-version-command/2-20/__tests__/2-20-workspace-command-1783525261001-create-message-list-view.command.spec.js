"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _220workspacecommand1783525261001createmessagelistviewcommand = require("../2-20-workspace-command-1783525261001-create-message-list-view.command");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
jest.mock('src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant');
const computeTwentyStandardApplicationAllFlatEntityMapsMock = _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps;
const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const STANDARD_APPLICATION = {
    id: '20202020-0000-0000-0000-0000000000aa',
    universalIdentifier: '20202020-0000-0000-0000-0000000000bb'
};
const LIST = _metadata.STANDARD_OBJECTS.messageList;
const LIST_VIEW_UNIVERSAL_IDENTIFIER = LIST.views.allMessageLists.universalIdentifier;
const LIST_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = Object.values(LIST.views.allMessageLists.viewFields).map((viewField)=>viewField.universalIdentifier);
const buildByUniversalIdentifierMap = (universalIdentifiers)=>({
        byUniversalIdentifier: Object.fromEntries(universalIdentifiers.map((universalIdentifier)=>[
                universalIdentifier,
                {
                    universalIdentifier
                }
            ]))
    });
describe('CreateMessageListViewCommand', ()=>{
    let command;
    let findApplicationMock;
    let getOrRecomputeMock;
    let validateBuildAndRunWorkspaceMigrationMock;
    beforeEach(()=>{
        jest.clearAllMocks();
        findApplicationMock = jest.fn().mockResolvedValue({
            twentyStandardFlatApplication: STANDARD_APPLICATION
        });
        getOrRecomputeMock = jest.fn();
        validateBuildAndRunWorkspaceMigrationMock = jest.fn().mockResolvedValue({
            status: 'success'
        });
        computeTwentyStandardApplicationAllFlatEntityMapsMock.mockReturnValue({
            allFlatEntityMaps: {
                flatViewMaps: buildByUniversalIdentifierMap([
                    LIST_VIEW_UNIVERSAL_IDENTIFIER
                ]),
                flatViewFieldMaps: buildByUniversalIdentifierMap(LIST_VIEW_FIELD_UNIVERSAL_IDENTIFIERS)
            }
        });
        command = new _220workspacecommand1783525261001createmessagelistviewcommand.CreateMessageListViewCommand({}, {
            findWorkspaceTwentyStandardAndCustomApplicationOrThrow: findApplicationMock
        }, {
            getOrRecompute: getOrRecomputeMock
        }, {
            validateBuildAndRunWorkspaceMigration: validateBuildAndRunWorkspaceMigrationMock
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
    const mockWorkspaceCache = ({ existingViews = [], existingViewFields = [] })=>{
        getOrRecomputeMock.mockResolvedValue({
            flatObjectMetadataMaps: buildByUniversalIdentifierMap([
                LIST.universalIdentifier
            ]),
            flatViewMaps: buildByUniversalIdentifierMap(existingViews),
            flatViewFieldMaps: buildByUniversalIdentifierMap(existingViewFields)
        });
    };
    it('creates the message list view and all view fields when missing', async ()=>{
        mockWorkspaceCache({});
        await runOnWorkspace();
        expect(validateBuildAndRunWorkspaceMigrationMock).toHaveBeenCalledWith({
            isSystemBuild: true,
            workspaceId: WORKSPACE_ID,
            applicationUniversalIdentifier: STANDARD_APPLICATION.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                view: {
                    flatEntityToCreate: [
                        expect.objectContaining({
                            universalIdentifier: LIST_VIEW_UNIVERSAL_IDENTIFIER
                        })
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: expect.arrayContaining(LIST_VIEW_FIELD_UNIVERSAL_IDENTIFIERS.map((universalIdentifier)=>expect.objectContaining({
                            universalIdentifier
                        }))),
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        expect(validateBuildAndRunWorkspaceMigrationMock.mock.calls[0][0].allFlatEntityOperationByMetadataName.viewField.flatEntityToCreate).toHaveLength(LIST_VIEW_FIELD_UNIVERSAL_IDENTIFIERS.length);
    });
    it('creates missing view fields when the view already exists', async ()=>{
        mockWorkspaceCache({
            existingViews: [
                LIST_VIEW_UNIVERSAL_IDENTIFIER
            ],
            existingViewFields: [
                LIST.views.allMessageLists.viewFields.name.universalIdentifier
            ]
        });
        await runOnWorkspace();
        const payload = validateBuildAndRunWorkspaceMigrationMock.mock.calls[0][0].allFlatEntityOperationByMetadataName;
        expect(payload.view.flatEntityToCreate).toEqual([]);
        expect(payload.viewField.flatEntityToCreate).toEqual(expect.arrayContaining(LIST_VIEW_FIELD_UNIVERSAL_IDENTIFIERS.slice(1).map((universalIdentifier)=>expect.objectContaining({
                universalIdentifier
            }))));
        expect(payload.viewField.flatEntityToCreate).toHaveLength(LIST_VIEW_FIELD_UNIVERSAL_IDENTIFIERS.length - 1);
    });
    it('does nothing when the view and view fields already exist', async ()=>{
        mockWorkspaceCache({
            existingViews: [
                LIST_VIEW_UNIVERSAL_IDENTIFIER
            ],
            existingViewFields: LIST_VIEW_FIELD_UNIVERSAL_IDENTIFIERS
        });
        await runOnWorkspace();
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
    });
    it('does not write metadata in dry-run mode', async ()=>{
        mockWorkspaceCache({});
        await runOnWorkspace(true);
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
    });
    it('skips workspaces where the messageList object is absent', async ()=>{
        getOrRecomputeMock.mockResolvedValue({
            flatObjectMetadataMaps: buildByUniversalIdentifierMap([]),
            flatViewMaps: buildByUniversalIdentifierMap([]),
            flatViewFieldMaps: buildByUniversalIdentifierMap([])
        });
        await runOnWorkspace();
        expect(findApplicationMock).not.toHaveBeenCalled();
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-20-workspace-command-1783525261001-create-message-list-view.command.spec.js.map