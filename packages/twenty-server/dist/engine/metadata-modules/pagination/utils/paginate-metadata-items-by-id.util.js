"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "paginateMetadataItemsById", {
    enumerable: true,
    get: function() {
        return paginateMetadataItemsById;
    }
});
const _utils = require("twenty-shared/utils");
const _buildmetadatacursorpageutil = require("./build-metadata-cursor-page.util");
const paginateMetadataItemsById = ({ items, pagination })=>{
    const isBackwardPagination = pagination.direction === 'backward';
    const fetchedItems = items.filter(({ id })=>{
        if ((0, _utils.isDefined)(pagination.afterId)) {
            return id < pagination.afterId;
        }
        if ((0, _utils.isDefined)(pagination.beforeId)) {
            return id > pagination.beforeId;
        }
        return true;
    }).sort(({ id: firstId }, { id: secondId })=>isBackwardPagination ? firstId.localeCompare(secondId) : secondId.localeCompare(firstId)).slice(0, pagination.limit + 1);
    return (0, _buildmetadatacursorpageutil.buildMetadataCursorPage)({
        fetchedItems,
        pagination
    });
};

//# sourceMappingURL=paginate-metadata-items-by-id.util.js.map