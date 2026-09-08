"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCursorKeysetCondition", {
    enumerable: true,
    get: function() {
        return buildCursorKeysetCondition;
    }
});
const _geteffectivescanorderutils = require("./get-effective-scan-order.utils");
function buildCursorKeysetCondition({ cursorValue, orderByDirection, isForwardPagination, isEqualityCondition, canFieldHoldNullValue, buildLeafCondition, // The strict operators compare exactly: the empty-value widening of 'is'
// and 'eq' does not mirror the SQL scan order the cursor continues
buildNullCheckCondition = (isNull)=>buildLeafCondition({
        isStrictly: isNull ? 'NULL' : 'NOT_NULL'
    }) }) {
    if (isEqualityCondition) {
        return cursorValue === null ? buildNullCheckCondition(true) : buildLeafCondition({
            eqStrict: cursorValue
        });
    }
    const { isAscending, areNullsScannedLast } = (0, _geteffectivescanorderutils.getEffectiveScanOrder)(orderByDirection, isForwardPagination);
    if (cursorValue === null) {
        // Inside the leading NULL block only the tie-breaking keys can advance the
        // scan; inside the trailing one nothing sorts after on this key at all
        return areNullsScannedLast ? null : buildNullCheckCondition(false);
    }
    const mainCondition = buildLeafCondition({
        [isAscending ? 'gt' : 'lt']: cursorValue
    });
    if (areNullsScannedLast && canFieldHoldNullValue) {
        return {
            or: [
                mainCondition,
                buildNullCheckCondition(true)
            ]
        };
    }
    return mainCondition;
}

//# sourceMappingURL=build-cursor-keyset-condition.utils.js.map