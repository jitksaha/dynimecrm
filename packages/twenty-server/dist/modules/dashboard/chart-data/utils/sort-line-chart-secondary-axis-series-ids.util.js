"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sortLineChartSecondaryAxisSeriesIds", {
    enumerable: true,
    get: function() {
        return sortLineChartSecondaryAxisSeriesIds;
    }
});
const _utils = require("twenty-shared/utils");
const _sortsecondaryaxisdatautil = require("./sort-secondary-axis-data.util");
const sortLineChartSecondaryAxisSeriesIds = ({ seriesIds, seriesMap, configuration, secondaryFormattedToRawLookup, secondarySelectOptions, secondaryAxisGroupByField })=>{
    const orderBy = configuration.secondaryAxisOrderBy;
    if (!(0, _utils.isDefined)(orderBy)) {
        return seriesIds;
    }
    return (0, _sortsecondaryaxisdatautil.sortSecondaryAxisData)({
        items: seriesIds,
        orderBy,
        manualSortOrder: configuration.secondaryAxisManualSortOrder,
        formattedToRawLookup: secondaryFormattedToRawLookup,
        getFormattedValue: (id)=>id,
        getNumericValue: (id)=>{
            const xToYMap = seriesMap.get(id);
            if (!xToYMap) {
                return 0;
            }
            let sum = 0;
            for (const value of xToYMap.values()){
                sum += value;
            }
            return sum;
        },
        selectFieldOptions: secondarySelectOptions,
        fieldType: secondaryAxisGroupByField.type,
        subFieldName: configuration.secondaryAxisGroupBySubFieldName ?? undefined,
        dateGranularity: configuration.secondaryAxisGroupByDateGranularity
    });
};

//# sourceMappingURL=sort-line-chart-secondary-axis-series-ids.util.js.map