"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCursorLeafWhereCondition", {
    enumerable: true,
    get: function() {
        return buildCursorLeafWhereCondition;
    }
});
const _buildcursorkeysetconditionutils = require("./build-cursor-keyset-condition.utils");
// SQL NULL can sit in any nullable column whatever its type: write-side
// normalization stores empty TEXT-like values as NULL, and rows written
// without the field hold NULL too, so they all sort into the NULL block.
// Composite sub-columns and joined columns carry no own nullability metadata
// and are treated as nullable; a needless IS NULL branch matches nothing.
const checkIfLeafCanHoldNullValue = (leaf)=>leaf.kind === 'scalar' ? leaf.fieldMetadata.isNullable !== false : true;
function buildCursorLeafWhereCondition({ leaf, cursorValue, isForwardPagination, isEqualityCondition }) {
    return (0, _buildcursorkeysetconditionutils.buildCursorKeysetCondition)({
        cursorValue,
        orderByDirection: leaf.direction,
        isForwardPagination,
        isEqualityCondition,
        canFieldHoldNullValue: checkIfLeafCanHoldNullValue(leaf),
        buildLeafCondition: (leafFilter)=>leaf.path.reduceRight((nested, key)=>({
                    [key]: nested
                }), leafFilter)
    });
}

//# sourceMappingURL=build-cursor-leaf-where-condition.utils.js.map