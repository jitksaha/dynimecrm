"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sortBarChartSecondaryAxisKeys", {
    enumerable: true,
    get: function() {
        return sortBarChartSecondaryAxisKeys;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _sortsecondaryaxisdatautil = require("./sort-secondary-axis-data.util");
const sortBarChartSecondaryAxisKeys = ({ keys, data, configuration, secondaryFormattedToRawLookup, secondarySelectOptions, secondaryAxisGroupByField })=>{
    const orderBy = configuration.secondaryAxisOrderBy;
    if (!(0, _utils.isDefined)(orderBy)) {
        return keys;
    }
    return (0, _sortsecondaryaxisdatautil.sortSecondaryAxisData)({
        items: keys,
        orderBy,
        manualSortOrder: configuration.secondaryAxisManualSortOrder,
        formattedToRawLookup: secondaryFormattedToRawLookup,
        getFormattedValue: (key)=>key,
        getNumericValue: (key)=>{
            let sum = 0;
            for (const datum of data){
                const value = datum[key];
                if ((0, _guards.isNumber)(value)) {
                    sum += value;
                }
            }
            return sum;
        },
        selectFieldOptions: secondarySelectOptions,
        fieldType: secondaryAxisGroupByField.type,
        subFieldName: configuration.secondaryAxisGroupBySubFieldName ?? undefined,
        dateGranularity: configuration.secondaryAxisGroupByDateGranularity
    });
};

//# sourceMappingURL=sort-bar-chart-secondary-axis-keys.util.js.map