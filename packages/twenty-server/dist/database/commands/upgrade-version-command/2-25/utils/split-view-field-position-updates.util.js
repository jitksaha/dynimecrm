"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "splitViewFieldPositionUpdates", {
    enumerable: true,
    get: function() {
        return splitViewFieldPositionUpdates;
    }
});
const splitViewFieldPositionUpdates = (positionUpdates)=>{
    if (positionUpdates.length <= 1) {
        return {
            others: [],
            lowest: positionUpdates
        };
    }
    const lowestPosition = Math.min(...positionUpdates.map(({ position })=>position));
    const lowestIndex = positionUpdates.findIndex(({ position })=>position === lowestPosition);
    return {
        others: positionUpdates.filter((_, index)=>index !== lowestIndex),
        lowest: [
            positionUpdates[lowestIndex]
        ]
    };
};

//# sourceMappingURL=split-view-field-position-updates.util.js.map