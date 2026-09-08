"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "collectRecordPageStackTree", {
    enumerable: true,
    get: function() {
        return collectRecordPageStackTree;
    }
});
const _utils = require("twenty-shared/utils");
const _widgetconfigurationtypetype = require("../../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const collectRecordPageStackTree = ({ flatPageLayout, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps })=>{
    const tabs = [];
    // Several FIELDS widgets of one stack can reference the same view: the
    // materialized node is cached so its fields and groups are walked once.
    const fieldsViewNodeByViewId = new Map();
    for (const tabUniversalIdentifier of flatPageLayout.tabUniversalIdentifiers){
        const flatPageLayoutTab = flatPageLayoutTabMaps.byUniversalIdentifier[tabUniversalIdentifier];
        if (!(0, _utils.isDefined)(flatPageLayoutTab) || (0, _utils.isDefined)(flatPageLayoutTab.deletedAt)) {
            continue;
        }
        const widgets = [];
        for (const widgetUniversalIdentifier of flatPageLayoutTab.widgetUniversalIdentifiers){
            const flatPageLayoutWidget = flatPageLayoutWidgetMaps.byUniversalIdentifier[widgetUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatPageLayoutWidget) || (0, _utils.isDefined)(flatPageLayoutWidget.deletedAt)) {
                continue;
            }
            if (flatPageLayoutWidget.configuration?.configurationType !== _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS) {
                widgets.push({
                    flatPageLayoutWidget
                });
                continue;
            }
            const fieldsWidgetViewId = flatPageLayoutWidget.configuration.viewId;
            const viewUniversalIdentifier = (0, _utils.isDefined)(fieldsWidgetViewId) ? flatViewMaps.universalIdentifierById[fieldsWidgetViewId] : undefined;
            const flatView = (0, _utils.isDefined)(viewUniversalIdentifier) ? flatViewMaps.byUniversalIdentifier[viewUniversalIdentifier] : undefined;
            if (!(0, _utils.isDefined)(flatView) || (0, _utils.isDefined)(flatView.deletedAt)) {
                widgets.push({
                    flatPageLayoutWidget,
                    fieldsWidgetViewId
                });
                continue;
            }
            let fieldsView = fieldsViewNodeByViewId.get(flatView.id);
            if (!(0, _utils.isDefined)(fieldsView)) {
                fieldsView = {
                    flatView,
                    flatViewFields: flatView.viewFieldUniversalIdentifiers.map((viewFieldUniversalIdentifier)=>flatViewFieldMaps.byUniversalIdentifier[viewFieldUniversalIdentifier]).filter(_utils.isDefined).filter((flatViewField)=>!(0, _utils.isDefined)(flatViewField.deletedAt)),
                    flatViewFieldGroups: flatView.viewFieldGroupUniversalIdentifiers.map((viewFieldGroupUniversalIdentifier)=>flatViewFieldGroupMaps.byUniversalIdentifier[viewFieldGroupUniversalIdentifier]).filter(_utils.isDefined).filter((flatViewFieldGroup)=>!(0, _utils.isDefined)(flatViewFieldGroup.deletedAt))
                };
                fieldsViewNodeByViewId.set(flatView.id, fieldsView);
            }
            widgets.push({
                flatPageLayoutWidget,
                fieldsWidgetViewId,
                fieldsView
            });
        }
        tabs.push({
            flatPageLayoutTab,
            widgets
        });
    }
    return {
        flatPageLayout,
        tabs
    };
};

//# sourceMappingURL=collect-record-page-stack-tree.util.js.map