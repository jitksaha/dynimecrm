"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeCallRecordingTabPosition", {
    enumerable: true,
    get: function() {
        return computeCallRecordingTabPosition;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const HOME_TAB_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.home.universalIdentifier;
const TAB_POSITION_GAP = 10;
const computeCallRecordingTabPosition = ({ existingPageLayoutTabs })=>{
    const existingNonDeletedPageLayoutTabs = existingPageLayoutTabs.filter((pageLayoutTab)=>!(0, _utils.isDefined)(pageLayoutTab.deletedAt));
    const homeTab = existingNonDeletedPageLayoutTabs.find((pageLayoutTab)=>pageLayoutTab.universalIdentifier === HOME_TAB_UNIVERSAL_IDENTIFIER && pageLayoutTab.isActive);
    if (!(0, _utils.isDefined)(homeTab)) {
        return Math.max(...existingNonDeletedPageLayoutTabs.map((pageLayoutTab)=>pageLayoutTab.position), 0) + TAB_POSITION_GAP;
    }
    const nextTab = existingNonDeletedPageLayoutTabs.filter((pageLayoutTab)=>pageLayoutTab.position > homeTab.position).sort((a, b)=>a.position - b.position)[0];
    if (!(0, _utils.isDefined)(nextTab)) {
        return homeTab.position + TAB_POSITION_GAP;
    }
    return (homeTab.position + nextTab.position) / 2;
};

//# sourceMappingURL=compute-call-recording-tab-position.util.js.map