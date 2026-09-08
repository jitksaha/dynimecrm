"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageThreadViews", {
    enumerable: true,
    get: function() {
        return computeStandardMessageThreadViews;
    }
});
const _types = require("twenty-shared/types");
const _indexviewnameconstant = require("../../../../metadata-modules/view/constants/index-view-name.constant");
const _createstandardviewflatmetadatautil = require("./create-standard-view-flat-metadata.util");
const computeStandardMessageThreadViews = (args)=>{
    return {
        allMessageThreads: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'messageThread',
            context: {
                viewName: 'allMessageThreads',
                name: _indexviewnameconstant.INDEX_VIEW_NAME,
                type: _types.ViewType.TABLE,
                key: _types.ViewKey.INDEX,
                position: 0,
                icon: 'IconTable'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-thread-views.util.js.map