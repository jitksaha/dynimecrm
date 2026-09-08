"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeAppendedPageLayoutTabPositions", {
    enumerable: true,
    get: function() {
        return computeAppendedPageLayoutTabPositions;
    }
});
const _utils = require("twenty-shared/utils");
const _tabpositiongapconstant = require("../../2-32/utils/tab-position-gap.constant");
const computeAppendedPageLayoutTabPositions = ({ existingPageLayoutTabs, appendedTabCount })=>{
    const lastPosition = Math.max(...existingPageLayoutTabs.filter((pageLayoutTab)=>!(0, _utils.isDefined)(pageLayoutTab.deletedAt)).map((pageLayoutTab)=>pageLayoutTab.position), 0);
    return Array.from({
        length: appendedTabCount
    }, (_, index)=>lastPosition + (index + 1) * _tabpositiongapconstant.TAB_POSITION_GAP);
};

//# sourceMappingURL=compute-appended-page-layout-tab-positions.util.js.map