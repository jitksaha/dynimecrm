"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _recordpagereconciletestsetup = require("../../__tests__/record-page-reconcile-test-setup");
const _computerecordpagestackreownupdatesutil = require("../compute-record-page-stack-reown-updates.util");
const _countrecordpagereownupdatesutil = require("../count-record-page-reown-updates.util");
const _widgetconfigurationtypetype = require("../../../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const OBJECT_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000bb';
const OBJECT_METADATA = {
    universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
};
const FIELD_METADATA = {
    universalIdentifier: _recordpagereconciletestsetup.FIELD_UNIVERSAL_IDENTIFIER,
    applicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
};
const DERIVED_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = (0, _application.getSystemRecordPageLayoutUniversalIdentifier)({
    objectMetadataApplicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER
});
describe('computeRecordPageStackReownUpdates', ()=>{
    let warnMock;
    beforeEach(()=>{
        jest.clearAllMocks();
        warnMock = jest.fn();
    });
    const buildStack = ()=>(0, _recordpagereconciletestsetup.buildUnderivedRecordPageStack)({
            idPrefix: 'stack',
            objectUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            applicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            withGroup: true
        });
    const runCompute = ({ stack, extraTabs = [], extraWidgets = [], extraViews = [], fieldMetadatas = [
        FIELD_METADATA
    ], pageLayoutOverride = {}, engineOwnedApplicationUniversalIdentifiers = new Set([
        _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
    ]), objectMetadata = OBJECT_METADATA })=>{
        const flatPageLayout = {
            ...stack.pageLayout,
            ...pageLayoutOverride
        };
        return (0, _computerecordpagestackreownupdatesutil.computeRecordPageStackReownUpdates)({
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID,
            logger: {
                warn: warnMock
            },
            flatObjectMetadata: objectMetadata,
            flatPageLayout,
            derivedPageLayoutUniversalIdentifier: (0, _application.getSystemRecordPageLayoutUniversalIdentifier)({
                objectMetadataApplicationUniversalIdentifier: objectMetadata.applicationUniversalIdentifier,
                objectUniversalIdentifier: objectMetadata.universalIdentifier
            }),
            engineOwnedApplicationUniversalIdentifiers,
            twentyStandardApplicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            flatViewMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.view,
                ...extraViews
            ]),
            flatViewFieldMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.viewField
            ]),
            flatViewFieldGroupMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(stack.viewFieldGroup ? [
                stack.viewFieldGroup
            ] : []),
            flatFieldMetadataMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(fieldMetadatas),
            flatPageLayoutMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                flatPageLayout
            ]),
            flatPageLayoutTabMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.homeTab,
                ...extraTabs
            ]),
            flatPageLayoutWidgetMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.fieldsWidget,
                ...extraWidgets
            ])
        });
    };
    it('re-owns the full underived stack without warnings', ()=>{
        const stack = buildStack();
        const reownUpdates = runCompute({
            stack
        });
        expect(warnMock).not.toHaveBeenCalled();
        expect(reownUpdates.pageLayoutUpdates).toHaveLength(1);
        expect(reownUpdates.pageLayoutTabUpdates).toHaveLength(1);
        expect(reownUpdates.pageLayoutWidgetUpdates).toHaveLength(1);
        expect(reownUpdates.viewUpdates).toHaveLength(1);
        expect(reownUpdates.viewFieldUpdates).toHaveLength(1);
        expect(reownUpdates.viewFieldGroupUpdates).toHaveLength(1);
    });
    it('skips the second tab claiming the same title with a warning', ()=>{
        const stack = buildStack();
        const duplicateTab = {
            ...stack.homeTab,
            id: 'duplicate-tab-db-id',
            universalIdentifier: 'duplicate-tab-universal-identifier',
            widgetUniversalIdentifiers: []
        };
        stack.pageLayout.tabUniversalIdentifiers.push(duplicateTab.universalIdentifier);
        const reownUpdates = runCompute({
            stack,
            extraTabs: [
                duplicateTab
            ]
        });
        expect(warnMock).toHaveBeenCalledWith(expect.stringContaining('Duplicate tab title "Home"'));
        expect(reownUpdates.pageLayoutTabUpdates).toHaveLength(1);
        expect(reownUpdates.pageLayoutTabUpdates[0].id).toBe(stack.homeTab.id);
    });
    it('skips the second widget claiming the same title on a tab with a warning', ()=>{
        const stack = buildStack();
        const duplicateWidget = {
            ...stack.fieldsWidget,
            id: 'duplicate-widget-db-id',
            universalIdentifier: 'duplicate-widget-universal-identifier'
        };
        stack.homeTab.widgetUniversalIdentifiers.push(duplicateWidget.universalIdentifier);
        const reownUpdates = runCompute({
            stack,
            extraWidgets: [
                duplicateWidget
            ]
        });
        expect(warnMock).toHaveBeenCalledWith(expect.stringContaining('Duplicate widget title "Fields"'));
        expect(reownUpdates.pageLayoutWidgetUpdates).toHaveLength(1);
        expect(reownUpdates.pageLayoutWidgetUpdates[0].id).toBe(stack.fieldsWidget.id);
    });
    // A stack without a resolvable system view must not be re-owned at all:
    // a derived layout whose FIELDS widget dangles would never be repaired by
    // the backfill, which does not touch widgets of an existing layout.
    it('warns and re-owns nothing when the only FIELDS widget view is dangling', ()=>{
        const stack = buildStack();
        stack.fieldsWidget.configuration.viewId = 'unknown-view-db-id';
        const reownUpdates = runCompute({
            stack
        });
        expect(warnMock).toHaveBeenCalledWith(expect.stringContaining('No resolvable system FIELDS widget view'));
        expect((0, _countrecordpagereownupdatesutil.countRecordPageReownUpdates)(reownUpdates)).toBe(0);
    });
    it('warns and skips a view field whose displayed field is missing', ()=>{
        const stack = buildStack();
        const reownUpdates = runCompute({
            stack,
            fieldMetadatas: []
        });
        expect(warnMock).toHaveBeenCalledWith(expect.stringContaining(`Missing field for record-page view field ${stack.viewField.id}`));
        expect(reownUpdates.viewFieldUpdates).toHaveLength(0);
        expect(reownUpdates.viewUpdates).toHaveLength(1);
    });
    it('warns and skips a row whose derived identifier is already held by another row', ()=>{
        const stack = buildStack();
        const identifierHolderView = {
            ...stack.view,
            id: 'holder-view-db-id',
            universalIdentifier: 'holder-view-universal-identifier',
            viewFieldUniversalIdentifiers: [],
            viewFieldGroupUniversalIdentifiers: []
        };
        // Another row already holds the layout's derived identifier.
        const reownUpdates = runCompute({
            stack,
            extraViews: [
                identifierHolderView
            ],
            pageLayoutOverride: {}
        });
        // Sanity: the standard path stays warning-free; now collide on the layout.
        expect(warnMock).not.toHaveBeenCalled();
        expect((0, _countrecordpagereownupdatesutil.countRecordPageReownUpdates)(reownUpdates)).toBeGreaterThan(0);
        const collidingLayoutHolder = {
            id: 'holder-layout-db-id',
            universalIdentifier: DERIVED_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
        };
        const collidingStack = buildStack();
        const collidingReownUpdates = (0, _computerecordpagestackreownupdatesutil.computeRecordPageStackReownUpdates)({
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID,
            logger: {
                warn: warnMock
            },
            flatObjectMetadata: OBJECT_METADATA,
            flatPageLayout: collidingStack.pageLayout,
            derivedPageLayoutUniversalIdentifier: DERIVED_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
            engineOwnedApplicationUniversalIdentifiers: new Set([
                _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
            ]),
            twentyStandardApplicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            flatViewMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                collidingStack.view
            ]),
            flatViewFieldMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                collidingStack.viewField
            ]),
            flatViewFieldGroupMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)(collidingStack.viewFieldGroup ? [
                collidingStack.viewFieldGroup
            ] : []),
            flatFieldMetadataMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                FIELD_METADATA
            ]),
            flatPageLayoutMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                collidingStack.pageLayout,
                collidingLayoutHolder
            ]),
            flatPageLayoutTabMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                collidingStack.homeTab
            ]),
            flatPageLayoutWidgetMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                collidingStack.fieldsWidget
            ])
        });
        expect(warnMock).toHaveBeenCalledWith(expect.stringContaining(`Derived universal identifier ${DERIVED_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER} is already held by another row`));
        expect(collidingReownUpdates.pageLayoutUpdates).toHaveLength(0);
    });
    const buildUserAddedFieldsWidgetAndView = ()=>{
        const userFieldsView = {
            id: 'user-view-db-id',
            universalIdentifier: 'user-view-universal-identifier',
            key: null,
            isSystemSideEffect: false,
            deletedAt: null,
            objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
            viewFieldUniversalIdentifiers: [],
            viewFieldGroupUniversalIdentifiers: []
        };
        const userFieldsWidget = {
            id: 'user-widget-db-id',
            universalIdentifier: 'user-widget-universal-identifier',
            title: 'My fields',
            isSystemSideEffect: false,
            deletedAt: null,
            applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
            configuration: {
                configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS,
                viewId: userFieldsView.id,
                newFieldDefaultVisibility: true
            }
        };
        return {
            userFieldsView,
            userFieldsWidget
        };
    };
    // A user-added FIELDS widget carries its own view: both views derive the
    // same object-based identifier, so re-owning both would self-collide on the
    // unique index at apply time.
    it('re-owns only the system view when a user-added FIELDS widget carries its own view', ()=>{
        const stack = buildStack();
        const { userFieldsView, userFieldsWidget } = buildUserAddedFieldsWidgetAndView();
        stack.homeTab.widgetUniversalIdentifiers.push(userFieldsWidget.universalIdentifier);
        const reownUpdates = runCompute({
            stack,
            extraWidgets: [
                userFieldsWidget
            ],
            extraViews: [
                userFieldsView
            ],
            engineOwnedApplicationUniversalIdentifiers: new Set([
                _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
                _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
            ])
        });
        expect(reownUpdates.viewUpdates).toHaveLength(1);
        expect(reownUpdates.viewUpdates[0].id).toBe(stack.view.id);
    });
    it('re-owns only the system view when the user-added FIELDS widget comes first in walk order', ()=>{
        const stack = buildStack();
        const { userFieldsView, userFieldsWidget } = buildUserAddedFieldsWidgetAndView();
        stack.homeTab.widgetUniversalIdentifiers = [
            userFieldsWidget.universalIdentifier,
            ...stack.homeTab.widgetUniversalIdentifiers
        ];
        const reownUpdates = runCompute({
            stack,
            extraWidgets: [
                userFieldsWidget
            ],
            extraViews: [
                userFieldsView
            ],
            engineOwnedApplicationUniversalIdentifiers: new Set([
                _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
                _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
            ])
        });
        expect(reownUpdates.viewUpdates).toHaveLength(1);
        expect(reownUpdates.viewUpdates[0].id).toBe(stack.view.id);
    });
    // Custom objects have no pre-2.31 literal and their engine widget is not
    // twenty-standard-owned: selection must not fall back to walk order.
    it('selects the flagged engine view of a custom object even when a user-added FIELDS widget comes first', ()=>{
        const customObjectMetadata = {
            universalIdentifier: '20202020-0000-4000-8000-0000000000cd',
            applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
        };
        const stack = (0, _recordpagereconciletestsetup.buildUnderivedRecordPageStack)({
            idPrefix: 'custom-stack',
            objectUniversalIdentifier: customObjectMetadata.universalIdentifier,
            applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
        });
        const { userFieldsView, userFieldsWidget } = buildUserAddedFieldsWidgetAndView();
        stack.homeTab.widgetUniversalIdentifiers = [
            userFieldsWidget.universalIdentifier,
            ...stack.homeTab.widgetUniversalIdentifiers
        ];
        const reownUpdates = runCompute({
            stack,
            objectMetadata: customObjectMetadata,
            extraWidgets: [
                userFieldsWidget
            ],
            extraViews: [
                userFieldsView
            ],
            engineOwnedApplicationUniversalIdentifiers: new Set([
                _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
                _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
            ])
        });
        expect(reownUpdates.viewUpdates).toHaveLength(1);
        expect(reownUpdates.viewUpdates[0].id).toBe(stack.view.id);
    });
    // Pre-2-15 custom rows are stuck at isSystemSideEffect false, so the engine
    // view and a user-added view are indistinguishable: refuse selection and
    // skip the whole stack, otherwise a re-owned layout would keep a FIELDS
    // widget pointing at an un-reowned view the backfill never repairs.
    it('warns and re-owns nothing when a custom object has several unflagged FIELDS widget views', ()=>{
        const customObjectMetadata = {
            universalIdentifier: '20202020-0000-4000-8000-0000000000cd',
            applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
        };
        const stack = (0, _recordpagereconciletestsetup.buildUnderivedRecordPageStack)({
            idPrefix: 'custom-stack',
            objectUniversalIdentifier: customObjectMetadata.universalIdentifier,
            applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
            isSystemSideEffect: false
        });
        const { userFieldsView, userFieldsWidget } = buildUserAddedFieldsWidgetAndView();
        stack.homeTab.widgetUniversalIdentifiers = [
            userFieldsWidget.universalIdentifier,
            ...stack.homeTab.widgetUniversalIdentifiers
        ];
        const reownUpdates = runCompute({
            stack,
            objectMetadata: customObjectMetadata,
            extraWidgets: [
                userFieldsWidget
            ],
            extraViews: [
                userFieldsView
            ],
            engineOwnedApplicationUniversalIdentifiers: new Set([
                _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
                _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
            ])
        });
        expect(warnMock).toHaveBeenCalledWith(expect.stringContaining('Ambiguous FIELDS widget views'));
        expect((0, _countrecordpagereownupdatesutil.countRecordPageReownUpdates)(reownUpdates)).toBe(0);
    });
    it('skips the second standard group claiming the same name with a warning', ()=>{
        const stack = buildStack();
        const duplicateGroup = {
            ...stack.viewFieldGroup,
            id: 'duplicate-group-db-id',
            universalIdentifier: 'duplicate-group-universal-identifier'
        };
        stack.view.viewFieldGroupUniversalIdentifiers.push(duplicateGroup.universalIdentifier);
        const reownUpdates = (0, _computerecordpagestackreownupdatesutil.computeRecordPageStackReownUpdates)({
            workspaceId: _recordpagereconciletestsetup.WORKSPACE_ID,
            logger: {
                warn: warnMock
            },
            flatObjectMetadata: OBJECT_METADATA,
            flatPageLayout: stack.pageLayout,
            derivedPageLayoutUniversalIdentifier: DERIVED_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
            engineOwnedApplicationUniversalIdentifiers: new Set([
                _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
            ]),
            twentyStandardApplicationUniversalIdentifier: _recordpagereconciletestsetup.STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            flatViewMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.view
            ]),
            flatViewFieldMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.viewField
            ]),
            flatViewFieldGroupMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.viewFieldGroup,
                duplicateGroup
            ]),
            flatFieldMetadataMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                FIELD_METADATA
            ]),
            flatPageLayoutMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.pageLayout
            ]),
            flatPageLayoutTabMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.homeTab
            ]),
            flatPageLayoutWidgetMaps: (0, _recordpagereconciletestsetup.buildByUniversalIdentifierMap)([
                stack.fieldsWidget
            ])
        });
        expect(warnMock).toHaveBeenCalledWith(expect.stringContaining('Duplicate view field group name "General"'));
        expect(reownUpdates.viewFieldGroupUpdates).toHaveLength(1);
        expect(reownUpdates.viewFieldGroupUpdates[0].id).toBe(stack.viewFieldGroup?.id);
    });
    it('leaves app-authored tabs attached to the engine layout untouched', ()=>{
        const stack = buildStack();
        const appAuthoredTab = {
            ...stack.homeTab,
            id: 'app-tab-db-id',
            universalIdentifier: 'app-tab-universal-identifier',
            title: 'Call Recording',
            applicationUniversalIdentifier: _recordpagereconciletestsetup.CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
            widgetUniversalIdentifiers: []
        };
        stack.pageLayout.tabUniversalIdentifiers.push(appAuthoredTab.universalIdentifier);
        const reownUpdates = runCompute({
            stack,
            extraTabs: [
                appAuthoredTab
            ]
        });
        expect(warnMock).not.toHaveBeenCalled();
        expect(reownUpdates.pageLayoutTabUpdates).toHaveLength(1);
        expect(reownUpdates.pageLayoutTabUpdates[0].id).toBe(stack.homeTab.id);
    });
});

//# sourceMappingURL=compute-record-page-stack-reown-updates.util.spec.js.map