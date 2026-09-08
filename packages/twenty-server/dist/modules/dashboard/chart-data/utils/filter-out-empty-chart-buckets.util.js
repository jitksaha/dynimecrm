"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "filterOutEmptyChartBuckets", {
    enumerable: true,
    get: function() {
        return filterOutEmptyChartBuckets;
    }
});
const _utils = require("twenty-shared/utils");
const filterOutEmptyChartBuckets = ({ rawResults, shouldOmitEmptyBuckets })=>{
    if (!shouldOmitEmptyBuckets) {
        return rawResults;
    }
    return rawResults.filter((result)=>(0, _utils.isNonEmptyArray)(result.groupByDimensionValues) && result.groupByDimensionValues.every(_utils.isDefined) && Number.isFinite(result.aggregateValue) && result.aggregateValue !== 0);
};

//# sourceMappingURL=filter-out-empty-chart-buckets.util.js.map