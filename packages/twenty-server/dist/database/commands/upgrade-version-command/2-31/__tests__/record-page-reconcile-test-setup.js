"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CUSTOM_APPLICATION_ID () {
        return CUSTOM_APPLICATION_ID;
    },
    get CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER () {
        return CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER;
    },
    get EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER () {
        return EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER;
    },
    get FIELD_UNIVERSAL_IDENTIFIER () {
        return FIELD_UNIVERSAL_IDENTIFIER;
    },
    get STANDARD_APPLICATION_ID () {
        return STANDARD_APPLICATION_ID;
    },
    get STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER () {
        return STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER;
    },
    get WORKSPACE_ID () {
        return WORKSPACE_ID;
    },
    get buildByUniversalIdentifierMap () {
        return buildByUniversalIdentifierMap;
    },
    get buildDerivedRecordPageStackUniversalIdentifiers () {
        return buildDerivedRecordPageStackUniversalIdentifiers;
    },
    get buildUnderivedRecordPageStack () {
        return buildUnderivedRecordPageStack;
    }
});
const _application = require("twenty-shared/application");
const _types = require("twenty-shared/types");
const _widgetconfigurationtypetype = require("../../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const WORKSPACE_ID = '20202020-0000-4000-8000-000000000001';
const STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000ad';
const STANDARD_APPLICATION_ID = 'standard-application-db-id';
const CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000aa';
const CUSTOM_APPLICATION_ID = 'custom-application-db-id';
const EXTERNAL_APPLICATION_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000ae';
const FIELD_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000cc';
const buildDerivedRecordPageStackUniversalIdentifiers = ({ applicationUniversalIdentifier, objectUniversalIdentifier, fieldApplicationUniversalIdentifier = applicationUniversalIdentifier, fieldUniversalIdentifier = FIELD_UNIVERSAL_IDENTIFIER })=>{
    const pageLayout = (0, _application.getSystemRecordPageLayoutUniversalIdentifier)({
        objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
        objectUniversalIdentifier
    });
    const homeTab = (0, _application.getSystemPageLayoutTabUniversalIdentifier)({
        objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
        pageLayoutUniversalIdentifier: pageLayout,
        title: 'Home'
    });
    const fieldsWidget = (0, _application.getSystemPageLayoutWidgetUniversalIdentifier)({
        objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
        pageLayoutTabUniversalIdentifier: homeTab,
        title: 'Fields'
    });
    const view = (0, _application.getSystemViewUniversalIdentifier)({
        objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
        objectUniversalIdentifier,
        viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
    });
    const viewField = (0, _application.getSystemViewFieldUniversalIdentifier)({
        fieldMetadataApplicationUniversalIdentifier: fieldApplicationUniversalIdentifier,
        viewUniversalIdentifier: view,
        fieldMetadataUniversalIdentifier: fieldUniversalIdentifier
    });
    const generalGroup = (0, _application.getSystemViewFieldGroupUniversalIdentifier)({
        objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
        viewUniversalIdentifier: view,
        name: 'General'
    });
    return {
        pageLayout,
        homeTab,
        fieldsWidget,
        view,
        viewField,
        generalGroup
    };
};
const buildUnderivedRecordPageStack = ({ idPrefix, objectUniversalIdentifier, applicationUniversalIdentifier, isSystemSideEffect = true, withGroup = false })=>{
    const view = {
        id: `${idPrefix}-view-db-id`,
        universalIdentifier: `${idPrefix}-view-universal-identifier`,
        key: null,
        isSystemSideEffect,
        deletedAt: null,
        objectMetadataUniversalIdentifier: objectUniversalIdentifier,
        applicationUniversalIdentifier,
        viewFieldUniversalIdentifiers: [
            `${idPrefix}-view-field-universal-identifier`
        ],
        viewFieldGroupUniversalIdentifiers: withGroup ? [
            `${idPrefix}-group-universal-identifier`
        ] : []
    };
    const viewField = {
        id: `${idPrefix}-view-field-db-id`,
        universalIdentifier: `${idPrefix}-view-field-universal-identifier`,
        fieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER,
        isSystemSideEffect: false,
        deletedAt: null,
        applicationUniversalIdentifier
    };
    const viewFieldGroup = {
        id: `${idPrefix}-group-db-id`,
        universalIdentifier: `${idPrefix}-group-universal-identifier`,
        name: 'General',
        isSystemSideEffect: false,
        deletedAt: null,
        applicationUniversalIdentifier
    };
    const fieldsWidget = {
        id: `${idPrefix}-widget-db-id`,
        universalIdentifier: `${idPrefix}-widget-universal-identifier`,
        title: 'Fields',
        isSystemSideEffect,
        deletedAt: null,
        applicationUniversalIdentifier,
        configuration: {
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS,
            viewId: view.id,
            newFieldDefaultVisibility: true
        }
    };
    const homeTab = {
        id: `${idPrefix}-tab-db-id`,
        universalIdentifier: `${idPrefix}-tab-universal-identifier`,
        title: 'Home',
        isSystemSideEffect,
        deletedAt: null,
        applicationUniversalIdentifier,
        widgetUniversalIdentifiers: [
            fieldsWidget.universalIdentifier
        ]
    };
    const pageLayout = {
        id: `${idPrefix}-page-layout-db-id`,
        universalIdentifier: `${idPrefix}-page-layout-universal-identifier`,
        type: _types.PageLayoutType.RECORD_PAGE,
        isSystemSideEffect,
        deletedAt: null,
        objectMetadataUniversalIdentifier: objectUniversalIdentifier,
        applicationUniversalIdentifier,
        tabUniversalIdentifiers: [
            homeTab.universalIdentifier
        ]
    };
    return {
        pageLayout,
        homeTab,
        fieldsWidget,
        view,
        viewField,
        viewFieldGroup: withGroup ? viewFieldGroup : undefined
    };
};
const buildByUniversalIdentifierMap = (flatEntities)=>({
        byUniversalIdentifier: Object.fromEntries(flatEntities.map((flatEntity)=>[
                flatEntity.universalIdentifier,
                flatEntity
            ])),
        universalIdentifierById: Object.fromEntries(flatEntities.filter((flatEntity)=>flatEntity.id !== undefined).map((flatEntity)=>[
                flatEntity.id,
                flatEntity.universalIdentifier
            ]))
    });

//# sourceMappingURL=record-page-reconcile-test-setup.js.map