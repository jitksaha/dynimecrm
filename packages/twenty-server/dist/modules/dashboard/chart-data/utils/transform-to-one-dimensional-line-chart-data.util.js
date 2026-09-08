"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "transformToOneDimensionalLineChartData", {
    enumerable: true,
    get: function() {
        return transformToOneDimensionalLineChartData;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _graphorderbyenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum");
const _linechartmaximumnumberofdatapointsconstant = require("../constants/line-chart-maximum-number-of-data-points.constant");
const _applycumulativetolinedatapointsutil = require("./apply-cumulative-to-line-data-points.util");
const _applygapfillingutil = require("./apply-gap-filling.util");
const _buildformattedtorawlookupdtoutil = require("./build-formatted-to-raw-lookup-dto.util");
const _getaggregateoperationlabelutil = require("./get-aggregate-operation-label.util");
const _getselectoptionsutil = require("./get-select-options.util");
const _processonedimensionalresultsutil = require("./process-one-dimensional-results.util");
const _sortchartdataifneededutil = require("./sort-chart-data-if-needed.util");
const transformToOneDimensionalLineChartData = ({ filteredRawResults, primaryAxisGroupByField, aggregateField, configuration, userTimezone, firstDayOfTheWeek, seriesIdPrefix, relationLabelResolution })=>{
    const isDescOrder = configuration.primaryAxisOrderBy === _graphorderbyenum.GraphOrderBy.FIELD_DESC;
    const { data: gapFilledResults, wasTruncated: dateRangeWasTruncated } = (0, _applygapfillingutil.applyGapFilling)({
        data: filteredRawResults,
        primaryAxisGroupByField,
        dateGranularity: configuration.primaryAxisDateGranularity,
        omitNullValues: configuration.omitNullValues ?? false,
        isDescOrder,
        isTwoDimensional: false,
        splitMultiValueFields: configuration.splitMultiValueFields
    });
    const selectOptions = (0, _getselectoptionsutil.getSelectOptions)(primaryAxisGroupByField);
    const convertedFirstDayOfTheWeek = (0, _utils.convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek)(firstDayOfTheWeek, _types.FirstDayOfTheWeek.SUNDAY);
    const { processedDataPoints: rawProcessedDataPoints, formattedToRawLookup } = (0, _processonedimensionalresultsutil.processOneDimensionalResults)({
        rawResults: gapFilledResults,
        primaryAxisGroupByField,
        dateGranularity: configuration.primaryAxisDateGranularity,
        subFieldName: configuration.primaryAxisGroupBySubFieldName,
        userTimezone,
        firstDayOfTheWeek: convertedFirstDayOfTheWeek,
        relationLabelResolution
    });
    const processedDataPoints = rawProcessedDataPoints.map((point)=>({
            x: point.formattedValue,
            y: point.aggregateValue,
            rawValue: point.rawValue
        }));
    const sortedData = (0, _sortchartdataifneededutil.sortChartDataIfNeeded)({
        data: processedDataPoints,
        orderBy: configuration.primaryAxisOrderBy,
        manualSortOrder: configuration.primaryAxisManualSortOrder,
        formattedToRawLookup,
        getFieldValue: (item)=>item.x,
        getNumericValue: (item)=>item.y ?? 0,
        selectFieldOptions: selectOptions,
        fieldType: primaryAxisGroupByField.type,
        subFieldName: configuration.primaryAxisGroupBySubFieldName ?? undefined,
        dateGranularity: configuration.primaryAxisDateGranularity
    });
    const limitedSortedData = sortedData.slice(0, _linechartmaximumnumberofdatapointsconstant.LINE_CHART_MAXIMUM_NUMBER_OF_DATA_POINTS);
    const transformedData = configuration.isCumulative ? (0, _applycumulativetolinedatapointsutil.applyCumulativeToLineDataPoints)(limitedSortedData) : limitedSortedData;
    const dataPoints = transformedData.map(({ x, y })=>({
            x,
            y
        }));
    const series = [
        {
            key: `${seriesIdPrefix}${aggregateField.name}`,
            label: aggregateField.label,
            data: dataPoints
        }
    ];
    const xAxisLabel = primaryAxisGroupByField.label;
    const yAxisLabel = `${(0, _getaggregateoperationlabelutil.getAggregateOperationLabel)(configuration.aggregateOperation)} of ${aggregateField.label}`;
    return {
        series,
        xAxisLabel,
        yAxisLabel,
        showLegend: configuration.displayLegend ?? true,
        showDataLabels: configuration.displayDataLabel ?? false,
        hasTooManyGroups: filteredRawResults.length > _linechartmaximumnumberofdatapointsconstant.LINE_CHART_MAXIMUM_NUMBER_OF_DATA_POINTS || dateRangeWasTruncated,
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

//# sourceMappingURL=transform-to-one-dimensional-line-chart-data.util.js.map