"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "paginateMetadataOrderedItems", {
    enumerable: true,
    get: function() {
        return paginateMetadataOrderedItems;
    }
});
const _utils = require("twenty-shared/utils");
const _buildmetadatacursorpageutil = require("./build-metadata-cursor-page.util");
const paginateMetadataOrderedItems = ({ items, pagination })=>{
    const cursorId = pagination.afterId ?? pagination.beforeId;
    // Cursors are accepted in any UUID casing, so identity is matched
    // case-insensitively against the canonical lowercase ids.
    const normalizedCursorId = cursorId?.toLowerCase();
    const cursorIndex = (0, _utils.isDefined)(normalizedCursorId) ? items.findIndex(({ id })=>id.toLowerCase() === normalizedCursorId) : undefined;
    if (cursorIndex === -1) {
        return (0, _buildmetadatacursorpageutil.buildMetadataCursorPage)({
            fetchedItems: [],
            pagination
        });
    }
    const fetchedItems = pagination.direction === 'backward' ? items.slice(0, cursorIndex ?? items.length).reverse().slice(0, pagination.limit + 1) : items.slice((cursorIndex ?? -1) + 1, (cursorIndex ?? -1) + pagination.limit + 2);
    return (0, _buildmetadatacursorpageutil.buildMetadataCursorPage)({
        fetchedItems,
        pagination
    });
};

//# sourceMappingURL=paginate-metadata-ordered-items.util.js.map