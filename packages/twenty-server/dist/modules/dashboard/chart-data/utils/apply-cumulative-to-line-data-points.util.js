"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "applyCumulativeToLineDataPoints", {
    enumerable: true,
    get: function() {
        return applyCumulativeToLineDataPoints;
    }
});
const _utils = require("twenty-shared/utils");
const applyCumulativeToLineDataPoints = (dataPoints)=>{
    const result = [];
    let runningTotal = 0;
    for (const dataPoint of dataPoints){
        if ((0, _utils.isDefined)(dataPoint.y)) {
            runningTotal += dataPoint.y;
        }
        result.push({
            ...dataPoint,
            y: runningTotal
        });
    }
    return result;
};

//# sourceMappingURL=apply-cumulative-to-line-data-points.util.js.map