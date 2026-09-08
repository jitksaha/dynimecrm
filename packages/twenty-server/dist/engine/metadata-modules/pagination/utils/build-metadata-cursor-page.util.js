"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMetadataCursorPage", {
    enumerable: true,
    get: function() {
        return buildMetadataCursorPage;
    }
});
const _utils = require("twenty-shared/utils");
const _buildcursorpageutil = require("../../../api/utils/build-cursor-page.util");
const buildMetadataCursorPage = ({ fetchedItems, pagination })=>{
    const { items, pageInfo } = (0, _buildcursorpageutil.buildCursorPage)({
        fetchedItems,
        limit: pagination.limit,
        direction: pagination.direction,
        hasAfterCursor: (0, _utils.isDefined)(pagination.afterId),
        hasBeforeCursor: (0, _utils.isDefined)(pagination.beforeId)
    });
    return {
        items,
        pageInfo: {
            ...pageInfo,
            startCursor: items[0]?.id ?? null,
            endCursor: items[items.length - 1]?.id ?? null
        }
    };
};

//# sourceMappingURL=build-metadata-cursor-page.util.js.map