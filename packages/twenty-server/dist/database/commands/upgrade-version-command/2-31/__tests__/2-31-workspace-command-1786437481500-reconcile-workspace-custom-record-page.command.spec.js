"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _231workspacecommand1786437481500reconcileworkspacecustomrecordpagecommand = require("../2-31-workspace-command-1786437481500-reconcile-workspace-custom-record-page.command");
const _recordpagereconciletestsetup = require("./record-page-reconcile-test-setup");
const _pagelayouttabentity = require("../../../../../engine/metadata-modules/page-layout-tab/entities/page-layout-tab.entity");
const _pagelayoutwidgetentity = require("../../../../../engine/metadata-modules/page-layout-widget/entities/page-layout-widget.entity");
const _pagelayoutentity = require("../../../../../engine/metadata-modules/page-layout/entities/page-layout.entity");
const _viewfieldgroupentity = require("../../../../../engine/metadata-modules/view-field-group/entities/view-field-group.entity");
const _viewfieldentity = require("../../../../../engine/metadata-modules/view-field/entities/view-field.entity");
const _viewentity = require("../../../../../engine/metadata-modules/view/entities/view.entity");
const CUSTOM_OBJECT_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000bb';
const STANDARD_OBJECT_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000bc';
const DERIVED = (0, _recordpagereconciletestsetup.buildDerivedRecordPageStackUniversalIdentifiers)({
    applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: CUSTOM_OBJECT_UNIVERSAL_IDENTIFIER
});
// The system stack of a custom object: workspace-custom-owned, either from
// the incremental createOneObject path or de-owned from 1-23 by the standard
// reconcile.
const SYSTEM_STACK = (0, _recordpagereconciletestsetup.buildUnderivedRecordPageStack)({
    idPrefix: 'system',
    objectUniversalIdentifier: CUSTOM_OBJECT_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
    isSystemSideEffect: true
});
const CUSTOM_OBJECT_METADATA = {
    universalIdentifier: CUSTOM_OBJECT_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
};
const STANDARD_OBJECT_METADATA = {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
};
const FIELD_METADATA = {
    universalIdentifier: _recordpagereconciletestsetup.FIELD_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
};
describe('ReconcileWorkspaceCustomRecordPageCommand', ()=>{
    let command;
    let getOrRecomputeMock;
    let invalidateCacheMock;
    let updateMocksByEntity;
    beforeEach(()=>{
        jest.clearAllMocks();
        getOrRecomputeMock = jest.fn();
        invalidateCacheMock = jest.fn().mockResolvedValue(undefined);
        updateMocksByEntity = new Map([
            _pagelayoutentity.PageLayoutEntity,
            _pagelayouttabentity.PageLayoutTabEntity,
            _pagelayoutwidgetentity.PageLayoutWidgetEntity,
            _viewentity.ViewEntity,
            _viewfieldentity.ViewFieldEntity,
            _viewfieldgroupentity.ViewFieldGroupEntity
        ].map((entity)=>[
                entity,
                jest.fn().mockResolvedValue(undefined)
            ]));
        const entityManagerMock = {
            getRepository: (entity)=>{
                const updateMock = updateMocksByEntity.get(entity);
                if (updateMock === undefined) {
                    throw new Error('Unexpected repository');
                }
                return {
                    update: updateMock
                };
            }
        };
        const viewRepositoryMock = {
            manager: {
                transaction: jest.fn(async (callback)=>callback(entityManagerMock))
            }
        };
        command = new _231workspacecommand1786437481500reconcileworkspacecustomrecordpagecommand.ReconcileWorkspaceCustomRecordPageCommand({}, {
            getOrRecompute: getOrRecomputeMock
        }, {
            invalidateCache: invalidateCacheMock
        }, {
            findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
                twentyStandardFlatApplication: {
                    id: _recordpagereconciletestsetup.STANDARD_APPLICATION_ID,
                    universalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
                },
                workspaceCustomFlatApplication: {
                    id: _recordpagereconciletestsetup.CUSTOM_APPLICATION_ID,
                    universalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
                }
            })
        }, viewRepositoryMock);
    });
    const mockWorkspaceCache = ({ objects = [
        CUSTOM_OBJECT_METADATA
    ], views = [
        SYSTEM_STACK.view
    ], viewFields = [
        SYSTEM_STACK.viewField
    ], pageLayouts = [
        SYSTEM_STACK.pageLayout
    ], pageLayoutTabs = [
        SYSTEM_STACK.homeTab
    ], pageLayoutWidgets = [
        SYSTEM_STACK.fieldsWidget
    ] } = {})=>{
        getOrRecomputeMock.mockResolvedValue({
            flatViewMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(views),
            flatViewFieldMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(viewFields),
            flatViewFieldGroupMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([]),
            flatObjectMetadataMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(objects),
            flatFieldMetadataMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                FIELD_METADATA
            ]),
            flatPageLayoutMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(pageLayouts),
            flatPageLayoutTabMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(pageLayoutTabs),
            flatPageLayoutWidgetMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(pageLayoutWidgets)
        });
    };
    const runOnWorkspace = (dryRun = false)=>command.runOnWorkspace({
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID,
            options: {
                dryRun
            },
            index: 0,
            total: 1
        });
    it('re-owns the single workspace-custom stack of a custom object', async ()=>{
        mockWorkspaceCache();
        await runOnWorkspace();
        expect(updateMocksByEntity.get(_pagelayoutentity.PageLayoutEntity)).toHaveBeenCalledWith({
            id: SYSTEM_STACK.pageLayout.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.pageLayout
        });
        expect(updateMocksByEntity.get(_viewentity.ViewEntity)).toHaveBeenCalledWith({
            id: SYSTEM_STACK.view.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.view
        });
        expect(updateMocksByEntity.get(_viewfieldentity.ViewFieldEntity)).toHaveBeenCalledWith({
            id: SYSTEM_STACK.viewField.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.viewField,
            isSystemSideEffect: true
        });
        expect(invalidateCacheMock).toHaveBeenCalled();
    });
    it('re-owns an unflagged single stack (pre-2-15 incremental rows)', async ()=>{
        const unflaggedStack = (0, _recordpagereconciletestsetup.buildUnderivedRecordPageStack)({
            idPrefix: 'unflagged',
            objectUniversalIdentifier: CUSTOM_OBJECT_UNIVERSAL_IDENTIFIER,
            applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
            isSystemSideEffect: false
        });
        mockWorkspaceCache({
            views: [
                unflaggedStack.view
            ],
            viewFields: [
                unflaggedStack.viewField
            ],
            pageLayouts: [
                unflaggedStack.pageLayout
            ],
            pageLayoutTabs: [
                unflaggedStack.homeTab
            ],
            pageLayoutWidgets: [
                unflaggedStack.fieldsWidget
            ]
        });
        await runOnWorkspace();
        expect(updateMocksByEntity.get(_pagelayoutentity.PageLayoutEntity)).toHaveBeenCalledWith({
            id: unflaggedStack.pageLayout.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.pageLayout,
            isSystemSideEffect: true
        });
    });
    it('picks the single flagged candidate among several and leaves the custom one untouched', async ()=>{
        const callerCustomLayout = {
            ...SYSTEM_STACK.pageLayout,
            id: 'caller-custom-layout-db-id',
            universalIdentifier: 'caller-custom-layout-universal-identifier',
            isSystemSideEffect: false,
            tabUniversalIdentifiers: []
        };
        mockWorkspaceCache({
            // The caller custom comes first: the flag must decide, not order.
            pageLayouts: [
                callerCustomLayout,
                SYSTEM_STACK.pageLayout
            ]
        });
        await runOnWorkspace();
        expect(updateMocksByEntity.get(_pagelayoutentity.PageLayoutEntity)).toHaveBeenCalledTimes(1);
        expect(updateMocksByEntity.get(_pagelayoutentity.PageLayoutEntity)).toHaveBeenCalledWith({
            id: SYSTEM_STACK.pageLayout.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.pageLayout
        });
    });
    it('skips the object when several candidates are ambiguous', async ()=>{
        const firstUnflaggedLayout = {
            ...SYSTEM_STACK.pageLayout,
            isSystemSideEffect: false
        };
        const secondUnflaggedLayout = {
            ...SYSTEM_STACK.pageLayout,
            id: 'second-layout-db-id',
            universalIdentifier: 'second-layout-universal-identifier',
            isSystemSideEffect: false,
            tabUniversalIdentifiers: []
        };
        mockWorkspaceCache({
            pageLayouts: [
                firstUnflaggedLayout,
                secondUnflaggedLayout
            ]
        });
        await runOnWorkspace();
        for (const updateMock of updateMocksByEntity.values()){
            expect(updateMock).not.toHaveBeenCalled();
        }
    });
    it('leaves workspace-custom layouts of standard objects untouched', async ()=>{
        const customLayoutOnStandardObject = {
            ...SYSTEM_STACK.pageLayout,
            objectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIER
        };
        mockWorkspaceCache({
            objects: [
                STANDARD_OBJECT_METADATA
            ],
            pageLayouts: [
                customLayoutOnStandardObject
            ]
        });
        await runOnWorkspace();
        for (const updateMock of updateMocksByEntity.values()){
            expect(updateMock).not.toHaveBeenCalled();
        }
    });
    it('is idempotent: a fully derived stack yields no update', async ()=>{
        mockWorkspaceCache({
            views: [
                {
                    ...SYSTEM_STACK.view,
                    universalIdentifier: DERIVED.view,
                    viewFieldUniversalIdentifiers: [
                        DERIVED.viewField
                    ]
                }
            ],
            viewFields: [
                {
                    ...SYSTEM_STACK.viewField,
                    universalIdentifier: DERIVED.viewField,
                    isSystemSideEffect: true
                }
            ],
            pageLayouts: [
                {
                    ...SYSTEM_STACK.pageLayout,
                    universalIdentifier: DERIVED.pageLayout,
                    tabUniversalIdentifiers: [
                        DERIVED.homeTab
                    ]
                }
            ],
            pageLayoutTabs: [
                {
                    ...SYSTEM_STACK.homeTab,
                    universalIdentifier: DERIVED.homeTab,
                    widgetUniversalIdentifiers: [
                        DERIVED.fieldsWidget
                    ]
                }
            ],
            pageLayoutWidgets: [
                {
                    ...SYSTEM_STACK.fieldsWidget,
                    universalIdentifier: DERIVED.fieldsWidget
                }
            ]
        });
        await runOnWorkspace();
        for (const updateMock of updateMocksByEntity.values()){
            expect(updateMock).not.toHaveBeenCalled();
        }
        expect(invalidateCacheMock).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-31-workspace-command-1786437481500-reconcile-workspace-custom-record-page.command.spec.js.map