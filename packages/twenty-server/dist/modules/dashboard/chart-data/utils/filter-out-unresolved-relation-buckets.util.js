"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "filterOutUnresolvedRelationBuckets", {
    enumerable: true,
    get: function() {
        return filterOutUnresolvedRelationBuckets;
    }
});
const _utils = require("twenty-shared/utils");
const filterOutUnresolvedRelationBuckets = ({ rawResults, primaryRelationLabelResolution, secondaryRelationLabelResolution })=>{
    const primaryUnresolvedRecordIds = primaryRelationLabelResolution?.unresolvedRecordIds;
    const secondaryUnresolvedRecordIds = secondaryRelationLabelResolution?.unresolvedRecordIds;
    if (!(0, _utils.isDefined)(primaryUnresolvedRecordIds) && !(0, _utils.isDefined)(secondaryUnresolvedRecordIds)) {
        return rawResults;
    }
    return rawResults.filter((result)=>{
        const dimensionValues = result.groupByDimensionValues;
        const isPrimaryUnresolved = (0, _utils.isDefined)(primaryUnresolvedRecordIds) && primaryUnresolvedRecordIds.has(String(dimensionValues?.[0]));
        const isSecondaryUnresolved = (0, _utils.isDefined)(secondaryUnresolvedRecordIds) && secondaryUnresolvedRecordIds.has(String(dimensionValues?.[1]));
        return !isPrimaryUnresolved && !isSecondaryUnresolved;
    });
};

//# sourceMappingURL=filter-out-unresolved-relation-buckets.util.js.map