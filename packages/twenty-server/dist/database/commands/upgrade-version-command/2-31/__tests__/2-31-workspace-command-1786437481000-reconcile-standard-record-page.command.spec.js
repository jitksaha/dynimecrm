"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _231workspacecommand1786437481000reconcilestandardrecordpagecommand = require("../2-31-workspace-command-1786437481000-reconcile-standard-record-page.command");
const _pre231standardrecordpagelayoutuniversalidentifierbyobjectuniversalidentifierconstant = require("../constants/pre-2-31-standard-record-page-layout-universal-identifier-by-object-universal-identifier.constant");
const _recordpagereconciletestsetup = require("./record-page-reconcile-test-setup");
const _pagelayouttabentity = require("../../../../../engine/metadata-modules/page-layout-tab/entities/page-layout-tab.entity");
const _pagelayoutwidgetentity = require("../../../../../engine/metadata-modules/page-layout-widget/entities/page-layout-widget.entity");
const _pagelayoutentity = require("../../../../../engine/metadata-modules/page-layout/entities/page-layout.entity");
const _viewfieldgroupentity = require("../../../../../engine/metadata-modules/view-field-group/entities/view-field-group.entity");
const _viewfieldentity = require("../../../../../engine/metadata-modules/view-field/entities/view-field.entity");
const _viewentity = require("../../../../../engine/metadata-modules/view/entities/view.entity");
const COMPANY_OBJECT_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company;
const COMPANY_PRE_2_31_LAYOUT_UNIVERSAL_IDENTIFIER = _pre231standardrecordpagelayoutuniversalidentifierbyobjectuniversalidentifierconstant.PRE_2_31_STANDARD_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER_BY_OBJECT_UNIVERSAL_IDENTIFIER[COMPANY_OBJECT_UNIVERSAL_IDENTIFIER];
const CUSTOM_OBJECT_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000bb';
const DERIVED = (0, _recordpagereconciletestsetup.buildDerivedRecordPageStackUniversalIdentifiers)({
    applicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: COMPANY_OBJECT_UNIVERSAL_IDENTIFIER
});
// The curated company stack, still on its pre-2.31 pinned literal.
const CURATED_STACK = (()=>{
    const stack = (0, _recordpagereconciletestsetup.buildUnderivedRecordPageStack)({
        idPrefix: 'company',
        objectUniversalIdentifier: COMPANY_OBJECT_UNIVERSAL_IDENTIFIER,
        applicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        withGroup: true
    });
    return {
        ...stack,
        pageLayout: {
            ...stack.pageLayout,
            universalIdentifier: COMPANY_PRE_2_31_LAYOUT_UNIVERSAL_IDENTIFIER
        }
    };
})();
// A 1-23-era stack: custom object, whole stack authored under twenty-standard.
const ONE_23_ERA_STACK = (0, _recordpagereconciletestsetup.buildUnderivedRecordPageStack)({
    idPrefix: 'legacy-custom',
    objectUniversalIdentifier: CUSTOM_OBJECT_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    isSystemSideEffect: false
});
const COMPANY_OBJECT_METADATA = {
    universalIdentifier: COMPANY_OBJECT_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
};
const CUSTOM_OBJECT_METADATA = {
    universalIdentifier: CUSTOM_OBJECT_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
};
const FIELD_METADATA = {
    universalIdentifier: _recordpagereconciletestsetup.FIELD_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
};
describe('ReconcileStandardRecordPageCommand', ()=>{
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
        command = new _231workspacecommand1786437481000reconcilestandardrecordpagecommand.ReconcileStandardRecordPageCommand({}, {
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
        COMPANY_OBJECT_METADATA
    ], views = [
        CURATED_STACK.view
    ], viewFields = [
        CURATED_STACK.viewField
    ], viewFieldGroups = CURATED_STACK.viewFieldGroup ? [
        CURATED_STACK.viewFieldGroup
    ] : [], pageLayouts = [
        CURATED_STACK.pageLayout
    ], pageLayoutTabs = [
        CURATED_STACK.homeTab
    ], pageLayoutWidgets = [
        CURATED_STACK.fieldsWidget
    ] } = {})=>{
        getOrRecomputeMock.mockResolvedValue({
            flatViewMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(views),
            flatViewFieldMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(viewFields),
            flatViewFieldGroupMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(viewFieldGroups),
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
    it('re-owns the curated stack located by its pre-2.31 literal', async ()=>{
        mockWorkspaceCache();
        await runOnWorkspace();
        expect(updateMocksByEntity.get(_pagelayoutentity.PageLayoutEntity)).toHaveBeenCalledWith({
            id: CURATED_STACK.pageLayout.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.pageLayout
        });
        expect(updateMocksByEntity.get(_pagelayouttabentity.PageLayoutTabEntity)).toHaveBeenCalledWith({
            id: CURATED_STACK.homeTab.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.homeTab
        });
        expect(updateMocksByEntity.get(_pagelayoutwidgetentity.PageLayoutWidgetEntity)).toHaveBeenCalledWith({
            id: CURATED_STACK.fieldsWidget.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.fieldsWidget
        });
        expect(updateMocksByEntity.get(_viewentity.ViewEntity)).toHaveBeenCalledWith({
            id: CURATED_STACK.view.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.view
        });
        expect(updateMocksByEntity.get(_viewfieldentity.ViewFieldEntity)).toHaveBeenCalledWith({
            id: CURATED_STACK.viewField.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.viewField,
            isSystemSideEffect: true
        });
        expect(updateMocksByEntity.get(_viewfieldgroupentity.ViewFieldGroupEntity)).toHaveBeenCalledWith({
            id: CURATED_STACK.viewFieldGroup?.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED.generalGroup,
            isSystemSideEffect: true
        });
        expect(invalidateCacheMock).toHaveBeenCalled();
    });
    it('is idempotent: a fully derived stack yields no update', async ()=>{
        mockWorkspaceCache({
            views: [
                {
                    ...CURATED_STACK.view,
                    universalIdentifier: DERIVED.view,
                    viewFieldUniversalIdentifiers: [
                        DERIVED.viewField
                    ],
                    viewFieldGroupUniversalIdentifiers: [
                        DERIVED.generalGroup
                    ]
                }
            ],
            viewFields: [
                {
                    ...CURATED_STACK.viewField,
                    universalIdentifier: DERIVED.viewField,
                    isSystemSideEffect: true
                }
            ],
            viewFieldGroups: [
                {
                    ...CURATED_STACK.viewFieldGroup,
                    universalIdentifier: DERIVED.generalGroup,
                    isSystemSideEffect: true
                }
            ],
            pageLayouts: [
                {
                    ...CURATED_STACK.pageLayout,
                    universalIdentifier: DERIVED.pageLayout,
                    tabUniversalIdentifiers: [
                        DERIVED.homeTab
                    ]
                }
            ],
            pageLayoutTabs: [
                {
                    ...CURATED_STACK.homeTab,
                    universalIdentifier: DERIVED.homeTab,
                    widgetUniversalIdentifiers: [
                        DERIVED.fieldsWidget
                    ]
                }
            ],
            pageLayoutWidgets: [
                {
                    ...CURATED_STACK.fieldsWidget,
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
    it('de-owns a 1-23-era custom-object stack to workspace-custom without touching identifiers', async ()=>{
        mockWorkspaceCache({
            objects: [
                CUSTOM_OBJECT_METADATA
            ],
            views: [
                ONE_23_ERA_STACK.view
            ],
            viewFields: [
                ONE_23_ERA_STACK.viewField
            ],
            viewFieldGroups: [],
            pageLayouts: [
                ONE_23_ERA_STACK.pageLayout
            ],
            pageLayoutTabs: [
                ONE_23_ERA_STACK.homeTab
            ],
            pageLayoutWidgets: [
                ONE_23_ERA_STACK.fieldsWidget
            ]
        });
        await runOnWorkspace();
        expect(updateMocksByEntity.get(_pagelayoutentity.PageLayoutEntity)).toHaveBeenCalledWith({
            id: ONE_23_ERA_STACK.pageLayout.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            applicationId: _recordpagereconciletestsetup.CUSTOM_APPLICATION_ID
        });
        expect(updateMocksByEntity.get(_pagelayouttabentity.PageLayoutTabEntity)).toHaveBeenCalledWith({
            id: ONE_23_ERA_STACK.homeTab.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            applicationId: _recordpagereconciletestsetup.CUSTOM_APPLICATION_ID
        });
        expect(updateMocksByEntity.get(_pagelayoutwidgetentity.PageLayoutWidgetEntity)).toHaveBeenCalledWith({
            id: ONE_23_ERA_STACK.fieldsWidget.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            applicationId: _recordpagereconciletestsetup.CUSTOM_APPLICATION_ID
        });
        expect(updateMocksByEntity.get(_viewentity.ViewEntity)).toHaveBeenCalledWith({
            id: ONE_23_ERA_STACK.view.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            applicationId: _recordpagereconciletestsetup.CUSTOM_APPLICATION_ID
        });
        expect(updateMocksByEntity.get(_viewfieldentity.ViewFieldEntity)).toHaveBeenCalledWith({
            id: ONE_23_ERA_STACK.viewField.id,
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID
        }, {
            applicationId: _recordpagereconciletestsetup.CUSTOM_APPLICATION_ID
        });
        // Identifiers stay untouched: the workspace-custom reconcile re-owns them.
        expect(updateMocksByEntity.get(_pagelayoutentity.PageLayoutEntity)).not.toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
            universalIdentifier: expect.anything()
        }));
    });
    it('leaves workspace-custom-owned layouts alone', async ()=>{
        const customOwnedStack = (0, _recordpagereconciletestsetup.buildUnderivedRecordPageStack)({
            idPrefix: 'custom-owned',
            objectUniversalIdentifier: CUSTOM_OBJECT_UNIVERSAL_IDENTIFIER,
            applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
        });
        mockWorkspaceCache({
            objects: [
                CUSTOM_OBJECT_METADATA
            ],
            views: [
                customOwnedStack.view
            ],
            viewFields: [
                customOwnedStack.viewField
            ],
            viewFieldGroups: [],
            pageLayouts: [
                customOwnedStack.pageLayout
            ],
            pageLayoutTabs: [
                customOwnedStack.homeTab
            ],
            pageLayoutWidgets: [
                customOwnedStack.fieldsWidget
            ]
        });
        await runOnWorkspace();
        for (const updateMock of updateMocksByEntity.values()){
            expect(updateMock).not.toHaveBeenCalled();
        }
    });
    it('skips every write in dry-run mode', async ()=>{
        mockWorkspaceCache();
        await runOnWorkspace(true);
        for (const updateMock of updateMocksByEntity.values()){
            expect(updateMock).not.toHaveBeenCalled();
        }
        expect(invalidateCacheMock).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-31-workspace-command-1786437481000-reconcile-standard-record-page.command.spec.js.map