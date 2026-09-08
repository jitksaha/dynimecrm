"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSystemRecordPageLayoutToCreate", {
    enumerable: true,
    get: function() {
        return computeSystemRecordPageLayoutToCreate;
    }
});
const _application = require("twenty-shared/application");
const _widgetconfigurationtypetype = require("../../../page-layout-widget/enums/widget-configuration-type.type");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../../../workspace-manager/twenty-standard-application/constants/standard-page-layout-tabs.template");
const DEFAULT_RECORD_PAGE_TAB_DEFINITIONS = [
    {
        key: 'home',
        widgetKey: 'fields',
        widgetConfigurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS
    },
    {
        key: 'timeline',
        widgetKey: 'timeline',
        widgetConfigurationType: _widgetconfigurationtypetype.WidgetConfigurationType.TIMELINE
    },
    {
        key: 'tasks',
        widgetKey: 'tasks',
        widgetConfigurationType: _widgetconfigurationtypetype.WidgetConfigurationType.TASKS
    },
    {
        key: 'notes',
        widgetKey: 'notes',
        widgetConfigurationType: _widgetconfigurationtypetype.WidgetConfigurationType.NOTES
    },
    {
        key: 'files',
        widgetKey: 'files',
        widgetConfigurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FILES
    }
];
const computeSystemRecordPageLayoutToCreate = ({ objectMetadata, applicationUniversalIdentifier, recordPageFieldsViewUniversalIdentifier })=>{
    const now = new Date().toISOString();
    const pageLayoutUniversalIdentifier = (0, _application.getSystemRecordPageLayoutUniversalIdentifier)({
        objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
        objectUniversalIdentifier: objectMetadata.universalIdentifier
    });
    const pageLayoutTabs = [];
    const pageLayoutWidgets = [];
    for (const { key, widgetKey, widgetConfigurationType } of DEFAULT_RECORD_PAGE_TAB_DEFINITIONS){
        const tabProps = _standardpagelayouttabstemplate.TAB_PROPS[key];
        const widgetProps = _standardpagelayouttabstemplate.WIDGET_PROPS[widgetKey];
        const tabUniversalIdentifier = (0, _application.getSystemPageLayoutTabUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
            pageLayoutUniversalIdentifier,
            title: tabProps.title
        });
        const widgetUniversalIdentifier = (0, _application.getSystemPageLayoutWidgetUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
            pageLayoutTabUniversalIdentifier: tabUniversalIdentifier,
            title: widgetProps.title
        });
        pageLayoutTabs.push({
            universalIdentifier: tabUniversalIdentifier,
            applicationUniversalIdentifier,
            title: tabProps.title,
            position: tabProps.position,
            pageLayoutUniversalIdentifier,
            widgetUniversalIdentifiers: [
                widgetUniversalIdentifier
            ],
            isActive: true,
            isSystemSideEffect: true,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            icon: tabProps.icon,
            layoutMode: tabProps.layoutMode,
            overrides: null
        });
        const universalConfiguration = widgetConfigurationType === _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS ? {
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS,
            viewUniversalIdentifier: recordPageFieldsViewUniversalIdentifier,
            newFieldDefaultVisibility: true
        } : {
            configurationType: widgetConfigurationType
        };
        pageLayoutWidgets.push({
            universalIdentifier: widgetUniversalIdentifier,
            applicationUniversalIdentifier,
            pageLayoutTabUniversalIdentifier: tabUniversalIdentifier,
            title: widgetProps.title,
            type: widgetProps.type,
            position: widgetProps.position,
            // @ts-expect-error - configurationType is validated but TS can't match to discriminated union
            universalConfiguration,
            objectMetadataUniversalIdentifier: objectMetadata.universalIdentifier,
            isActive: true,
            isSystemSideEffect: true,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            conditionalDisplay: null,
            universalOverrides: null
        });
    }
    const pageLayout = {
        universalIdentifier: pageLayoutUniversalIdentifier,
        applicationUniversalIdentifier,
        name: `Default ${objectMetadata.labelSingular} Layout`,
        type: _types.PageLayoutType.RECORD_PAGE,
        objectMetadataUniversalIdentifier: objectMetadata.universalIdentifier,
        tabUniversalIdentifiers: pageLayoutTabs.map((tab)=>tab.universalIdentifier),
        isSystemSideEffect: true,
        isFirstTabPinned: true,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier: null
    };
    return {
        pageLayouts: [
            pageLayout
        ],
        pageLayoutTabs,
        pageLayoutWidgets
    };
};

//# sourceMappingURL=compute-system-record-page-layout-to-create.util.js.map