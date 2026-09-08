"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeViewFieldPositionsAlignedToStandard", {
    enumerable: true,
    get: function() {
        return computeViewFieldPositionsAlignedToStandard;
    }
});
const computeViewFieldPositionsAlignedToStandard = ({ existingViewFields, standardPositionByUniversalIdentifier })=>{
    const standardPositions = Object.values(standardPositionByUniversalIdentifier);
    if (standardPositions.length === 0) {
        return [];
    }
    const highestStandardPosition = Math.max(...standardPositions);
    const customUniversalIdentifiers = existingViewFields.filter(({ universalIdentifier })=>standardPositionByUniversalIdentifier[universalIdentifier] === undefined).sort((a, b)=>a.position - b.position).map(({ universalIdentifier })=>universalIdentifier);
    return existingViewFields.flatMap(({ universalIdentifier, position })=>{
        const standardPosition = standardPositionByUniversalIdentifier[universalIdentifier];
        const targetPosition = standardPosition ?? highestStandardPosition + 1 + customUniversalIdentifiers.indexOf(universalIdentifier);
        return targetPosition === position ? [] : [
            {
                universalIdentifier,
                position: targetPosition
            }
        ];
    });
};

//# sourceMappingURL=compute-view-field-positions-aligned-to-standard.util.js.map