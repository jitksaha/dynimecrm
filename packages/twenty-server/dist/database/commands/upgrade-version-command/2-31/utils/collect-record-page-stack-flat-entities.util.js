"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "collectRecordPageStackFlatEntities", {
    enumerable: true,
    get: function() {
        return collectRecordPageStackFlatEntities;
    }
});
const _utils = require("twenty-shared/utils");
const _collectrecordpagestacktreeutil = require("./collect-record-page-stack-tree.util");
const collectRecordPageStackFlatEntities = ({ flatPageLayout, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps })=>{
    const stackTree = (0, _collectrecordpagestacktreeutil.collectRecordPageStackTree)({
        flatPageLayout,
        flatViewMaps,
        flatViewFieldMaps,
        flatViewFieldGroupMaps,
        flatPageLayoutTabMaps,
        flatPageLayoutWidgetMaps
    });
    const stack = {
        pageLayouts: [
            flatPageLayout
        ],
        pageLayoutTabs: [],
        pageLayoutWidgets: [],
        views: [],
        viewFields: [],
        viewFieldGroups: []
    };
    for (const { flatPageLayoutTab, widgets } of stackTree.tabs){
        stack.pageLayoutTabs.push(flatPageLayoutTab);
        for (const { flatPageLayoutWidget, fieldsView } of widgets){
            stack.pageLayoutWidgets.push(flatPageLayoutWidget);
            if (!(0, _utils.isDefined)(fieldsView) || stack.views.some((view)=>view.id === fieldsView.flatView.id)) {
                continue;
            }
            stack.views.push(fieldsView.flatView);
            stack.viewFields.push(...fieldsView.flatViewFields);
            stack.viewFieldGroups.push(...fieldsView.flatViewFieldGroups);
        }
    }
    return stack;
};

//# sourceMappingURL=collect-record-page-stack-flat-entities.util.js.map