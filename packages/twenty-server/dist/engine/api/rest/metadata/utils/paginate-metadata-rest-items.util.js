"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "paginateMetadataRestItems", {
    enumerable: true,
    get: function() {
        return paginateMetadataRestItems;
    }
});
const _parsemetadatarestpaginationutil = require("./parse-metadata-rest-pagination.util");
const _paginatemetadataordereditemsutil = require("../../../../metadata-modules/pagination/utils/paginate-metadata-ordered-items.util");
const paginateMetadataRestItems = ({ items, request })=>{
    const page = (0, _paginatemetadataordereditemsutil.paginateMetadataOrderedItems)({
        items,
        pagination: (0, _parsemetadatarestpaginationutil.parseMetadataRestPagination)(request)
    });
    return {
        data: page.items,
        pageInfo: page.pageInfo,
        totalCount: items.length
    };
};

//# sourceMappingURL=paginate-metadata-rest-items.util.js.map