"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "applyCumulativeToOneDimensionalBarData", {
    enumerable: true,
    get: function() {
        return applyCumulativeToOneDimensionalBarData;
    }
});
const applyCumulativeToOneDimensionalBarData = (dataPoints)=>{
    const result = [];
    let runningTotal = 0;
    for (const dataPoint of dataPoints){
        runningTotal += dataPoint.aggregateValue;
        result.push({
            ...dataPoint,
            aggregateValue: runningTotal
        });
    }
    return result;
};

//# sourceMappingURL=apply-cumulative-to-one-dimensional-bar-data.util.js.map