"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSummaryTabPosition", {
    enumerable: true,
    get: function() {
        return computeSummaryTabPosition;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _computecallrecordingtabpositionutil = require("../../2-31/utils/compute-call-recording-tab-position.util");
const _tabpositiongapconstant = require("./tab-position-gap.constant");
const CALL_RECORDING_TAB_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.callRecording.universalIdentifier;
const computeSummaryTabPosition = ({ existingPageLayoutTabs })=>{
    const existingNonDeletedPageLayoutTabs = existingPageLayoutTabs.filter((pageLayoutTab)=>!(0, _utils.isDefined)(pageLayoutTab.deletedAt));
    const callRecordingTab = existingNonDeletedPageLayoutTabs.find((pageLayoutTab)=>pageLayoutTab.universalIdentifier === CALL_RECORDING_TAB_UNIVERSAL_IDENTIFIER && pageLayoutTab.isActive);
    if (!(0, _utils.isDefined)(callRecordingTab)) {
        return (0, _computecallrecordingtabpositionutil.computeCallRecordingTabPosition)({
            existingPageLayoutTabs
        });
    }
    const previousTab = existingNonDeletedPageLayoutTabs.filter((pageLayoutTab)=>pageLayoutTab.position < callRecordingTab.position).sort((leftPageLayoutTab, rightPageLayoutTab)=>rightPageLayoutTab.position - leftPageLayoutTab.position)[0];
    if (!(0, _utils.isDefined)(previousTab)) {
        return callRecordingTab.position - _tabpositiongapconstant.TAB_POSITION_GAP;
    }
    return (previousTab.position + callRecordingTab.position) / 2;
};

//# sourceMappingURL=compute-summary-tab-position.util.js.map