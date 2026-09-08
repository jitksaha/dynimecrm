"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "transformToTwoDimensionalLineChartData", {
    enumerable: true,
    get: function() {
        return transformToTwoDimensionalLineChartData;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _graphorderbyenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum");
const _linechartmaximumnumberofdatapointsconstant = require("../constants/line-chart-maximum-number-of-data-points.constant");
const _linechartmaximumnumberofnonstackedseriesconstant = require("../constants/line-chart-maximum-number-of-non-stacked-series.constant");
const _linechartmaximumnumberofstackedseriesconstant = require("../constants/line-chart-maximum-number-of-stacked-series.constant");
const _applycumulativetolinedatapointsutil = require("./apply-cumulative-to-line-data-points.util");
const _applygapfillingutil = require("./apply-gap-filling.util");
const _buildformattedtorawlookupdtoutil = require("./build-formatted-to-raw-lookup-dto.util");
const _getaggregateoperationlabelutil = require("./get-aggregate-operation-label.util");
const _getselectoptionsutil = require("./get-select-options.util");
const _processtwodimensionalresultsutil = require("./process-two-dimensional-results.util");
const _sortchartdataifneededutil = require("./sort-chart-data-if-needed.util");
const _sortlinechartsecondaryaxisseriesidsutil = require("./sort-line-chart-secondary-axis-series-ids.util");
const transformToTwoDimensionalLineChartData = ({ filteredRawResults, primaryAxisGroupByField, secondaryAxisGroupByField, aggregateField, configuration, userTimezone, firstDayOfTheWeek, seriesIdPrefix, primaryRelationLabelResolution, secondaryRelationLabelResolution })=>{
    const isStacked = configuration.isStacked ?? false;
    const isDescOrder = configuration.primaryAxisOrderBy === _graphorderbyenum.GraphOrderBy.FIELD_DESC;
    const { data: gapFilledResults, wasTruncated: dateRangeWasTruncated } = (0, _applygapfillingutil.applyGapFilling)({
        data: filteredRawResults,
        primaryAxisGroupByField,
        dateGranularity: configuration.primaryAxisDateGranularity,
        omitNullValues: configuration.omitNullValues ?? false,
        isDescOrder,
        isTwoDimensional: true,
        splitMultiValueFields: configuration.splitMultiValueFields
    });
    const primarySelectOptions = (0, _getselectoptionsutil.getSelectOptions)(primaryAxisGroupByField);
    const secondarySelectOptions = (0, _getselectoptionsutil.getSelectOptions)(secondaryAxisGroupByField);
    const convertedFirstDayOfTheWeek = (0, _utils.convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek)(firstDayOfTheWeek, _types.FirstDayOfTheWeek.SUNDAY);
    const { processedDataPoints: rawProcessedDataPoints, formattedToRawLookup, secondaryFormattedToRawLookup } = (0, _processtwodimensionalresultsutil.processTwoDimensionalResults)({
        rawResults: gapFilledResults,
        primaryAxisGroupByField,
        secondaryAxisGroupByField,
        primaryDateGranularity: configuration.primaryAxisDateGranularity,
        primarySubFieldName: configuration.primaryAxisGroupBySubFieldName,
        secondaryDateGranularity: configuration.secondaryAxisGroupByDateGranularity,
        secondarySubFieldName: configuration.secondaryAxisGroupBySubFieldName,
        userTimezone,
        firstDayOfTheWeek: convertedFirstDayOfTheWeek,
        primaryRelationLabelResolution,
        secondaryRelationLabelResolution
    });
    const allXValues = [];
    const xValueSet = new Set();
    const allSeriesIds = new Set();
    const processedDataPoints = rawProcessedDataPoints.map((point)=>{
        if (!xValueSet.has(point.xFormatted)) {
            xValueSet.add(point.xFormatted);
            allXValues.push(point.xFormatted);
        }
        allSeriesIds.add(point.yFormatted);
        return {
            xFormatted: point.xFormatted,
            ySeriesId: point.yFormatted,
            rawXValue: point.rawXValue,
            rawYValue: point.rawYValue,
            aggregateValue: point.aggregateValue
        };
    });
    const seriesMap = new Map();
    for (const point of processedDataPoints){
        if (!seriesMap.has(point.ySeriesId)) {
            seriesMap.set(point.ySeriesId, new Map());
        }
        seriesMap.get(point.ySeriesId).set(point.xFormatted, point.aggregateValue);
    }
    const sortedXValues = (0, _sortchartdataifneededutil.sortChartDataIfNeeded)({
        data: allXValues,
        orderBy: configuration.primaryAxisOrderBy,
        manualSortOrder: configuration.primaryAxisManualSortOrder,
        formattedToRawLookup,
        getFieldValue: (x)=>x,
        getNumericValue: (xValue)=>{
            let sum = 0;
            for (const xToYMap of seriesMap.values()){
                const value = xToYMap.get(xValue);
                if ((0, _utils.isDefined)(value)) {
                    sum += value;
                }
            }
            return sum;
        },
        selectFieldOptions: primarySelectOptions,
        fieldType: primaryAxisGroupByField.type,
        subFieldName: configuration.primaryAxisGroupBySubFieldName ?? undefined,
        dateGranularity: configuration.primaryAxisDateGranularity
    });
    const limitedXValues = sortedXValues.slice(0, _linechartmaximumnumberofdatapointsconstant.LINE_CHART_MAXIMUM_NUMBER_OF_DATA_POINTS);
    const seriesIds = Array.from(allSeriesIds);
    const sortedSeriesIds = (0, _sortlinechartsecondaryaxisseriesidsutil.sortLineChartSecondaryAxisSeriesIds)({
        seriesIds,
        seriesMap,
        configuration,
        secondaryFormattedToRawLookup,
        secondarySelectOptions,
        secondaryAxisGroupByField
    });
    const maxSeries = isStacked ? _linechartmaximumnumberofstackedseriesconstant.LINE_CHART_MAXIMUM_NUMBER_OF_STACKED_SERIES : _linechartmaximumnumberofnonstackedseriesconstant.LINE_CHART_MAXIMUM_NUMBER_OF_NON_STACKED_SERIES;
    const limitedSeriesIds = sortedSeriesIds.slice(0, maxSeries);
    const series = limitedSeriesIds.map((seriesId)=>{
        const xToYMap = seriesMap.get(seriesId) ?? new Map();
        const prefixedSeriesId = `${seriesIdPrefix}${seriesId}`;
        let dataPoints = limitedXValues.map((xValue)=>({
                x: xValue,
                y: xToYMap.get(xValue) ?? 0
            }));
        if (configuration.isCumulative) {
            dataPoints = (0, _applycumulativetolinedatapointsutil.applyCumulativeToLineDataPoints)(dataPoints);
        }
        return {
            key: prefixedSeriesId,
            label: seriesId,
            data: dataPoints
        };
    });
    const xAxisLabel = primaryAxisGroupByField.label;
    const yAxisLabel = `${(0, _getaggregateoperationlabelutil.getAggregateOperationLabel)(configuration.aggregateOperation)} of ${aggregateField.label}`;
    const hasTooManySeries = seriesIds.length > maxSeries;
    const hasTooManyDataPoints = allXValues.length > _linechartmaximumnumberofdatapointsconstant.LINE_CHART_MAXIMUM_NUMBER_OF_DATA_POINTS;
    const hasTooManyGroups = hasTooManySeries || hasTooManyDataPoints || dateRangeWasTruncated;
    const secondaryLookupWithPrefixedSeriesIds = new Map();
    for (const seriesId of limitedSeriesIds){
        const rawValue = secondaryFormattedToRawLookup.get(seriesId);
        if ((0, _utils.isDefined)(rawValue)) {
            secondaryLookupWithPrefixedSeriesIds.set(`${seriesIdPrefix}${seriesId}`, rawValue);
        }
    }
    return {
        series,
        xAxisLabel,
        yAxisLabel,
        showLegend: configuration.displayLegend ?? true,
        showDataLabels: configuration.displayDataLabel ?? false,
        hasTooManyGroups,
        formattedToRawLookup: (0, _buildformattedtorawlookupdtoutil.buildFormattedToRawLookupDto)({
            axisLookups: [
                {
                    formattedToRawLookup: secondaryLookupWithPrefixedSeriesIds,
                    relationLabelResolution: secondaryRelationLabelResolution
                },
                {
                    formattedToRawLookup,
                    relationLabelResolution: primaryRelationLabelResolution
                }
            ]
        })
    };
};

//# sourceMappingURL=transform-to-two-dimensional-line-chart-data.util.js.map