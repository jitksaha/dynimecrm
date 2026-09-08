"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "transformToTwoDimensionalBarChartData", {
    enumerable: true,
    get: function() {
        return transformToTwoDimensionalBarChartData;
    }
});
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _barchartgroupmodeenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/bar-chart-group-mode.enum");
const _barchartlayoutenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/bar-chart-layout.enum");
const _graphorderbyenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum");
const _barchartmaximumnumberofbarsconstant = require("../constants/bar-chart-maximum-number-of-bars.constant");
const _barchartmaximumnumberofgroupsperbarconstant = require("../constants/bar-chart-maximum-number-of-groups-per-bar.constant");
const _applycumulativetotwodimensionalbardatautil = require("./apply-cumulative-to-two-dimensional-bar-data.util");
const _applygapfillingutil = require("./apply-gap-filling.util");
const _buildformattedtorawlookupdtoutil = require("./build-formatted-to-raw-lookup-dto.util");
const _getaggregateoperationlabelutil = require("./get-aggregate-operation-label.util");
const _getselectoptionsutil = require("./get-select-options.util");
const _processtwodimensionalresultsutil = require("./process-two-dimensional-results.util");
const _sortchartdataifneededutil = require("./sort-chart-data-if-needed.util");
const _sortbarchartsecondaryaxiskeysutil = require("./sort-bar-chart-secondary-axis-keys.util");
const transformToTwoDimensionalBarChartData = ({ filteredRawResults, primaryAxisGroupByField, secondaryAxisGroupByField, aggregateField, configuration, userTimezone, firstDayOfTheWeek, primaryRelationLabelResolution, secondaryRelationLabelResolution })=>{
    const layout = configuration.layout ?? _barchartlayoutenum.BarChartLayout.VERTICAL;
    const isHorizontal = layout === _barchartlayoutenum.BarChartLayout.HORIZONTAL;
    const effectiveGroupMode = configuration.groupMode ?? _barchartgroupmodeenum.BarChartGroupMode.STACKED;
    const isStacked = effectiveGroupMode === _barchartgroupmodeenum.BarChartGroupMode.STACKED;
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
    const indexByKey = configuration.primaryAxisGroupBySubFieldName ? `${primaryAxisGroupByField.name}${(0, _utils.capitalize)(configuration.primaryAxisGroupBySubFieldName)}` : primaryAxisGroupByField.name;
    const convertedFirstDayOfTheWeek = (0, _utils.convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek)(firstDayOfTheWeek, _types.FirstDayOfTheWeek.SUNDAY);
    const { processedDataPoints, formattedToRawLookup, secondaryFormattedToRawLookup } = (0, _processtwodimensionalresultsutil.processTwoDimensionalResults)({
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
    const allSecondaryValues = new Set();
    for (const point of processedDataPoints){
        allSecondaryValues.add(point.yFormatted);
    }
    const dataMap = new Map();
    for (const point of processedDataPoints){
        if (!dataMap.has(point.xFormatted)) {
            dataMap.set(point.xFormatted, {
                [indexByKey]: point.xFormatted
            });
        }
        const datum = dataMap.get(point.xFormatted);
        datum[point.yFormatted] = point.aggregateValue;
    }
    const unsortedData = Array.from(dataMap.values());
    const sortedData = (0, _sortchartdataifneededutil.sortChartDataIfNeeded)({
        data: unsortedData,
        orderBy: configuration.primaryAxisOrderBy,
        manualSortOrder: configuration.primaryAxisManualSortOrder,
        formattedToRawLookup,
        getFieldValue: (item)=>String(item[indexByKey]),
        getNumericValue: (item)=>{
            let sum = 0;
            for (const key of allSecondaryValues){
                const value = item[key];
                if ((0, _guards.isNumber)(value)) {
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
    const limitedData = sortedData.slice(0, _barchartmaximumnumberofbarsconstant.BAR_CHART_MAXIMUM_NUMBER_OF_BARS);
    const keys = Array.from(allSecondaryValues);
    const sortedKeys = (0, _sortbarchartsecondaryaxiskeysutil.sortBarChartSecondaryAxisKeys)({
        keys,
        data: limitedData,
        configuration,
        secondaryFormattedToRawLookup,
        secondarySelectOptions,
        secondaryAxisGroupByField
    });
    const hasTooManyBars = sortedData.length > _barchartmaximumnumberofbarsconstant.BAR_CHART_MAXIMUM_NUMBER_OF_BARS;
    const hasTooManyGroupsPerBar = keys.length > _barchartmaximumnumberofgroupsperbarconstant.BAR_CHART_MAXIMUM_NUMBER_OF_GROUPS_PER_BAR;
    let finalLimitedData = limitedData;
    const limitedKeys = sortedKeys.slice(0, _barchartmaximumnumberofgroupsperbarconstant.BAR_CHART_MAXIMUM_NUMBER_OF_GROUPS_PER_BAR);
    if (!isStacked) {
        const totalSegments = finalLimitedData.length * limitedKeys.length;
        const hasTooManySegments = totalSegments > _barchartmaximumnumberofbarsconstant.BAR_CHART_MAXIMUM_NUMBER_OF_BARS;
        if (hasTooManySegments) {
            const maxXValues = Math.floor(_barchartmaximumnumberofbarsconstant.BAR_CHART_MAXIMUM_NUMBER_OF_BARS / limitedKeys.length);
            finalLimitedData = finalLimitedData.slice(0, Math.max(1, maxXValues));
        }
    }
    const finalData = configuration.isCumulative ? (0, _applycumulativetotwodimensionalbardatautil.applyCumulativeToTwoDimensionalBarData)({
        data: finalLimitedData,
        keys: limitedKeys
    }) : finalLimitedData;
    const series = limitedKeys.map((key)=>({
            key,
            label: key
        }));
    const categoryLabel = primaryAxisGroupByField.label;
    const valueLabel = `${(0, _getaggregateoperationlabelutil.getAggregateOperationLabel)(configuration.aggregateOperation)} of ${aggregateField.label}`;
    const xAxisLabel = isHorizontal ? valueLabel : categoryLabel;
    const yAxisLabel = isHorizontal ? categoryLabel : valueLabel;
    let hasTooManyGroups = hasTooManyBars || hasTooManyGroupsPerBar;
    if (!isStacked) {
        const totalSegments = limitedData.length * limitedKeys.length;
        const hasTooManySegments = totalSegments > _barchartmaximumnumberofbarsconstant.BAR_CHART_MAXIMUM_NUMBER_OF_BARS;
        hasTooManyGroups = hasTooManyGroups || hasTooManySegments;
    }
    hasTooManyGroups = hasTooManyGroups || dateRangeWasTruncated;
    return {
        data: finalData,
        indexBy: indexByKey,
        keys: limitedKeys,
        series,
        xAxisLabel,
        yAxisLabel,
        showLegend: configuration.displayLegend ?? true,
        showDataLabels: configuration.displayDataLabel ?? false,
        layout,
        groupMode: configuration.groupMode ?? _barchartgroupmodeenum.BarChartGroupMode.GROUPED,
        hasTooManyGroups,
        formattedToRawLookup: (0, _buildformattedtorawlookupdtoutil.buildFormattedToRawLookupDto)({
            axisLookups: [
                {
                    formattedToRawLookup: secondaryFormattedToRawLookup,
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

//# sourceMappingURL=transform-to-two-dimensional-bar-chart-data.util.js.map