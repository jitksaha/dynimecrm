"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardBlocklistViews", {
    enumerable: true,
    get: function() {
        return computeStandardBlocklistViews;
    }
});
const _types = require("twenty-shared/types");
const _indexviewnameconstant = require("../../../../metadata-modules/view/constants/index-view-name.constant");
const _createstandardviewflatmetadatautil = require("./create-standard-view-flat-metadata.util");
const computeStandardBlocklistViews = (args)=>{
    return {
        allBlocklists: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'blocklist',
            context: {
                viewName: 'allBlocklists',
                name: _indexviewnameconstant.INDEX_VIEW_NAME,
                type: _types.ViewType.TABLE,
                key: _types.ViewKey.INDEX,
                position: 0,
                icon: 'IconTable'
            }
        }),
        blocklistRecordPageFields: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'blocklist',
            context: {
                viewName: 'blocklistRecordPageFields',
                name: 'Blocklist Record Page Fields',
                type: _types.ViewType.FIELDS_WIDGET,
                key: null,
                position: 0,
                icon: 'IconListDetails'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-blocklist-views.util.js.map