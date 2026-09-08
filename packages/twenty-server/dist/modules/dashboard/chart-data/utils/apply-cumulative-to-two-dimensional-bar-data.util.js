"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "applyCumulativeToTwoDimensionalBarData", {
    enumerable: true,
    get: function() {
        return applyCumulativeToTwoDimensionalBarData;
    }
});
const _guards = require("@sniptt/guards");
const applyCumulativeToTwoDimensionalBarData = ({ data, keys })=>{
    const runningTotalByKey = {};
    for (const key of keys){
        runningTotalByKey[key] = 0;
    }
    const result = [];
    for (const datum of data){
        const cumulativeDatum = {
            ...datum
        };
        for (const key of keys){
            const value = datum[key];
            if ((0, _guards.isNumber)(value) && Number.isFinite(value)) {
                runningTotalByKey[key] += value;
            }
            cumulativeDatum[key] = runningTotalByKey[key];
        }
        result.push(cumulativeDatum);
    }
    return result;
};

//# sourceMappingURL=apply-cumulative-to-two-dimensional-bar-data.util.js.map