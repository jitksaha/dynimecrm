"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "transformToPieChartData", {
    enumerable: true,
    get: function() {
        return transformToPieChartData;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _piechartmaximumnumberofslicesconstant = require("../constants/pie-chart-maximum-number-of-slices.constant");
const _buildformattedtorawlookupdtoutil = require("./build-formatted-to-raw-lookup-dto.util");
const _getselectoptionsutil = require("./get-select-options.util");
const _processonedimensionalresultsutil = require("./process-one-dimensional-results.util");
const _sortchartdataifneededutil = require("./sort-chart-data-if-needed.util");
const transformToPieChartData = ({ filteredRawResults, groupByField, configuration, userTimezone, firstDayOfTheWeek, relationLabelResolution })=>{
    const selectOptions = (0, _getselectoptionsutil.getSelectOptions)(groupByField);
    const convertedFirstDayOfTheWeek = (0, _utils.convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek)(firstDayOfTheWeek, _types.FirstDayOfTheWeek.SUNDAY);
    const { processedDataPoints: rawProcessedDataPoints, formattedToRawLookup } = (0, _processonedimensionalresultsutil.processOneDimensionalResults)({
        rawResults: filteredRawResults,
        primaryAxisGroupByField: groupByField,
        dateGranularity: configuration.dateGranularity,
        subFieldName: configuration.groupBySubFieldName,
        userTimezone,
        firstDayOfTheWeek: convertedFirstDayOfTheWeek,
        relationLabelResolution
    });
    const processedDataPoints = rawProcessedDataPoints.map((point)=>{
        const rawValueString = (0, _utils.isDefined)(point.rawValue) ? String(point.rawValue) : null;
        return {
            key: point.formattedValue,
            value: point.aggregateValue,
            rawValue: rawValueString
        };
    });
    const sortedData = (0, _sortchartdataifneededutil.sortChartDataIfNeeded)({
        data: processedDataPoints,
        orderBy: configuration.orderBy,
        manualSortOrder: configuration.manualSortOrder,
        formattedToRawLookup,
        getFieldValue: (item)=>item.key,
        getNumericValue: (item)=>item.value,
        selectFieldOptions: selectOptions,
        fieldType: groupByField.type,
        dateGranularity: configuration.dateGranularity
    });
    const limitedSortedData = sortedData.slice(0, _piechartmaximumnumberofslicesconstant.PIE_CHART_MAXIMUM_NUMBER_OF_SLICES);
    const data = limitedSortedData.map(({ rawValue: _rawValue, ...item })=>item);
    return {
        data,
        showLegend: configuration.displayLegend ?? true,
        showDataLabels: configuration.displayDataLabel ?? false,
        showCenterMetric: configuration.showCenterMetric ?? true,
        hasTooManyGroups: filteredRawResults.length > _piechartmaximumnumberofslicesconstant.PIE_CHART_MAXIMUM_NUMBER_OF_SLICES,
        formattedToRawLookup: (0, _buildformattedtorawlookupdtoutil.buildFormattedToRawLookupDto)({
            axisLookups: [
                {
                    formattedToRawLookup,
                    relationLabelResolution
                }
            ]
        })
    };
};

//# sourceMappingURL=transform-to-pie-chart-data.util.js.map