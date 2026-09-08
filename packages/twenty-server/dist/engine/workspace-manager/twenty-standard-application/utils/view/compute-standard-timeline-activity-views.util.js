"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardTimelineActivityViews", {
    enumerable: true,
    get: function() {
        return computeStandardTimelineActivityViews;
    }
});
const _types = require("twenty-shared/types");
const _indexviewnameconstant = require("../../../../metadata-modules/view/constants/index-view-name.constant");
const _createstandardviewflatmetadatautil = require("./create-standard-view-flat-metadata.util");
const computeStandardTimelineActivityViews = (args)=>{
    return {
        allTimelineActivities: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'timelineActivity',
            context: {
                viewName: 'allTimelineActivities',
                name: _indexviewnameconstant.INDEX_VIEW_NAME,
                type: _types.ViewType.TABLE,
                key: _types.ViewKey.INDEX,
                position: 0,
                icon: 'IconTable'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-timeline-activity-views.util.js.map