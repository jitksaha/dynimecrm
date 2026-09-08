"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _types = require("twenty-shared/types");
const _typeorm = require("typeorm");
const _226workspacecommand1785255690000demoteandbackfillapplicationindexviewcommand = require("../2-26-workspace-command-1785255690000-demote-and-backfill-application-index-view.command");
const WORKSPACE_ID = '20202020-0000-4000-8000-000000000001';
const STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000ad';
const CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000aa';
const EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000ae';
const OBJECT_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000bb';
const FIELD_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000cc';
const DERIVED_VIEW_UNIVERSAL_IDENTIFIER = (0, _application.getSystemViewUniversalIdentifier)({
    objectMetadataApplicationUniversalIdentifier: EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
    viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
});
// An external application object with one displayable field.
const OBJECT_METADATA = {
    universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER,
    labelIdentifierFieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER,
    fieldUniversalIdentifiers: [
        FIELD_UNIVERSAL_IDENTIFIER
    ]
};
const FIELD_METADATA = {
    universalIdentifier: FIELD_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER,
    name: 'name',
    type: _types.FieldMetadataType.TEXT
};
const buildByUniversalIdentifierMap = (flatEntities)=>({
        byUniversalIdentifier: Object.fromEntries(flatEntities.map((flatEntity)=>[
                flatEntity.universalIdentifier,
                flatEntity
            ]))
    });
const buildFlatView = (view)=>({
        applicationUniversalIdentifier: EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER,
        deletedAt: null,
        isSystemSideEffect: false,
        objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
        ...view
    });
describe('DemoteAndBackfillApplicationIndexViewCommand', ()=>{
    let command;
    let getOrRecomputeMock;
    let invalidateCacheMock;
    let viewUpdateMock;
    let validateBuildAndRunWorkspaceMigrationMock;
    beforeEach(()=>{
        jest.clearAllMocks();
        getOrRecomputeMock = jest.fn();
        invalidateCacheMock = jest.fn().mockResolvedValue(undefined);
        viewUpdateMock = jest.fn().mockResolvedValue(undefined);
        validateBuildAndRunWorkspaceMigrationMock = jest.fn().mockResolvedValue({
            status: 'success'
        });
        const viewRepositoryMock = {
            update: viewUpdateMock
        };
        command = new _226workspacecommand1785255690000demoteandbackfillapplicationindexviewcommand.DemoteAndBackfillApplicationIndexViewCommand({}, {
            getOrRecompute: getOrRecomputeMock
        }, {
            invalidateCache: invalidateCacheMock
        }, {
            findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
                twentyStandardFlatApplication: {
                    universalIdentifier: STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
                },
                workspaceCustomFlatApplication: {
                    universalIdentifier: CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
                }
            })
        }, {
            validateBuildAndRunLegacyWorkspaceMigration: validateBuildAndRunWorkspaceMigrationMock
        }, viewRepositoryMock);
    });
    const mockWorkspaceCache = ({ views = [], viewFields = [] })=>{
        getOrRecomputeMock.mockResolvedValue({
            flatViewMaps: buildByUniversalIdentifierMap(views),
            flatViewFieldMaps: buildByUniversalIdentifierMap(viewFields),
            flatObjectMetadataMaps: buildByUniversalIdentifierMap([
                OBJECT_METADATA
            ]),
            flatFieldMetadataMaps: buildByUniversalIdentifierMap([
                FIELD_METADATA
            ])
        });
    };
    const runOnWorkspace = (dryRun = false)=>command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            options: {
                dryRun
            },
            index: 0,
            total: 1
        });
    it('demotes the application INDEX view and backfills the engine-owned one', async ()=>{
        mockWorkspaceCache({
            views: [
                buildFlatView({
                    id: 'app-view-id',
                    universalIdentifier: 'app-view-uid',
                    key: _types.ViewKey.INDEX
                })
            ]
        });
        await runOnWorkspace();
        // The app view becomes a plain additional view under its manifest
        // identifier.
        expect(viewUpdateMock).toHaveBeenCalledTimes(1);
        expect(viewUpdateMock).toHaveBeenCalledWith({
            id: (0, _typeorm.In)([
                'app-view-id'
            ]),
            workspaceId: WORKSPACE_ID
        }, {
            key: null
        });
        // Demotions are visible to the backfill pipeline validators.
        expect(invalidateCacheMock).toHaveBeenCalledTimes(1);
        // Two-phase: every application's views are committed before any view
        // field, so cross-application view fields always find their parent view.
        expect(validateBuildAndRunWorkspaceMigrationMock).toHaveBeenCalledTimes(2);
        const [viewPayload, viewFieldPayload] = validateBuildAndRunWorkspaceMigrationMock.mock.calls.map(([payload])=>payload);
        expect(viewPayload.applicationUniversalIdentifier).toBe(EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER);
        expect(viewPayload.allFlatEntityOperationByMetadataName.view.flatEntityToCreate).toEqual([
            expect.objectContaining({
                universalIdentifier: DERIVED_VIEW_UNIVERSAL_IDENTIFIER,
                key: _types.ViewKey.INDEX,
                isSystemSideEffect: true
            })
        ]);
        expect(viewPayload.allFlatEntityOperationByMetadataName.viewField).toBeUndefined();
        expect(viewFieldPayload.applicationUniversalIdentifier).toBe(EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER);
        expect(viewFieldPayload.allFlatEntityOperationByMetadataName.view).toBeUndefined();
        expect(viewFieldPayload.allFlatEntityOperationByMetadataName.viewField.flatEntityToCreate).toEqual([
            expect.objectContaining({
                universalIdentifier: (0, _application.getSystemViewFieldUniversalIdentifier)({
                    fieldMetadataApplicationUniversalIdentifier: EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER,
                    viewUniversalIdentifier: DERIVED_VIEW_UNIVERSAL_IDENTIFIER,
                    fieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER
                }),
                fieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER,
                isVisible: true,
                position: 0,
                isSystemSideEffect: true
            })
        ]);
    });
    it('backfills an application object that never had an INDEX view', async ()=>{
        mockWorkspaceCache({
            views: []
        });
        await runOnWorkspace();
        expect(viewUpdateMock).not.toHaveBeenCalled();
        expect(invalidateCacheMock).not.toHaveBeenCalled();
        expect(validateBuildAndRunWorkspaceMigrationMock).toHaveBeenCalledTimes(2);
    });
    it('is idempotent: a fully backfilled object is neither demoted nor re-backfilled', async ()=>{
        mockWorkspaceCache({
            views: [
                buildFlatView({
                    id: 'engine-view-id',
                    universalIdentifier: DERIVED_VIEW_UNIVERSAL_IDENTIFIER,
                    key: _types.ViewKey.INDEX,
                    isSystemSideEffect: true
                })
            ],
            viewFields: [
                {
                    universalIdentifier: (0, _application.getSystemViewFieldUniversalIdentifier)({
                        fieldMetadataApplicationUniversalIdentifier: EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER,
                        viewUniversalIdentifier: DERIVED_VIEW_UNIVERSAL_IDENTIFIER,
                        fieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER
                    })
                }
            ]
        });
        await runOnWorkspace();
        expect(viewUpdateMock).not.toHaveBeenCalled();
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
        expect(invalidateCacheMock).not.toHaveBeenCalled();
    });
    it('backfills the missing view fields of an already-committed engine INDEX view', async ()=>{
        mockWorkspaceCache({
            views: [
                buildFlatView({
                    id: 'engine-view-id',
                    universalIdentifier: DERIVED_VIEW_UNIVERSAL_IDENTIFIER,
                    key: _types.ViewKey.INDEX,
                    isSystemSideEffect: true
                })
            ]
        });
        await runOnWorkspace();
        expect(viewUpdateMock).not.toHaveBeenCalled();
        expect(validateBuildAndRunWorkspaceMigrationMock).toHaveBeenCalledTimes(1);
        const [payload] = validateBuildAndRunWorkspaceMigrationMock.mock.calls[0];
        expect(payload.allFlatEntityOperationByMetadataName.view).toBeUndefined();
        expect(payload.allFlatEntityOperationByMetadataName.viewField.flatEntityToCreate).toEqual([
            expect.objectContaining({
                universalIdentifier: (0, _application.getSystemViewFieldUniversalIdentifier)({
                    fieldMetadataApplicationUniversalIdentifier: EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER,
                    viewUniversalIdentifier: DERIVED_VIEW_UNIVERSAL_IDENTIFIER,
                    fieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER
                }),
                viewUniversalIdentifier: DERIVED_VIEW_UNIVERSAL_IDENTIFIER,
                isSystemSideEffect: true
            })
        ]);
    });
    it('does not write in dry-run mode', async ()=>{
        mockWorkspaceCache({
            views: [
                buildFlatView({
                    id: 'app-view-id',
                    universalIdentifier: 'app-view-uid',
                    key: _types.ViewKey.INDEX
                })
            ]
        });
        await runOnWorkspace(true);
        expect(viewUpdateMock).not.toHaveBeenCalled();
        expect(validateBuildAndRunWorkspaceMigrationMock).not.toHaveBeenCalled();
        expect(invalidateCacheMock).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-26-workspace-command-1785255690000-demote-and-backfill-application-index-view.command.spec.js.map