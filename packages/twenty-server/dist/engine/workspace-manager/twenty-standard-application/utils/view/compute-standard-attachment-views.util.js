"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardAttachmentViews", {
    enumerable: true,
    get: function() {
        return computeStandardAttachmentViews;
    }
});
const _types = require("twenty-shared/types");
const _indexviewnameconstant = require("../../../../metadata-modules/view/constants/index-view-name.constant");
const _createstandardviewflatmetadatautil = require("./create-standard-view-flat-metadata.util");
const computeStandardAttachmentViews = (args)=>{
    return {
        allAttachments: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'attachment',
            context: {
                viewName: 'allAttachments',
                name: _indexviewnameconstant.INDEX_VIEW_NAME,
                type: _types.ViewType.TABLE,
                key: _types.ViewKey.INDEX,
                position: 0,
                icon: 'IconTable'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-attachment-views.util.js.map