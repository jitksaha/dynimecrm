"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCursorPage", {
    enumerable: true,
    get: function() {
        return buildCursorPage;
    }
});
const buildCursorPage = ({ fetchedItems, limit, direction, hasAfterCursor = false, hasBeforeCursor = false })=>{
    const hasMoreItems = fetchedItems.length > limit;
    const items = fetchedItems.slice(0, limit);
    if (direction === 'backward') {
        items.reverse();
    }
    return {
        items,
        pageInfo: {
            hasNextPage: direction === 'backward' ? hasBeforeCursor : hasMoreItems,
            hasPreviousPage: direction === 'backward' ? hasMoreItems : hasAfterCursor
        }
    };
};

//# sourceMappingURL=build-cursor-page.util.js.map