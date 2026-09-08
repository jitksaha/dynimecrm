"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "transformToOneDimensionalBarChartData", {
    enumerable: true,
    get: function() {
        return transformToOneDimensionalBarChartData;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _barchartgroupmodeenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/bar-chart-group-mode.enum");
const _barchartlayoutenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/bar-chart-layout.enum");
const _graphorderbyenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum");
const _barchartmaximumnumberofbarsconstant = require("../constants/bar-chart-maximum-number-of-bars.constant");
const _applycumulativetoonedimensionalbardatautil = require("./apply-cumulative-to-one-dimensional-bar-data.util");
const _applygapfillingutil = require("./apply-gap-filling.util");
const _buildformattedtorawlookupdtoutil = require("./build-formatted-to-raw-lookup-dto.util");
const _getaggregateoperationlabelutil = require("./get-aggregate-operation-label.util");
const _getselectoptionsutil = require("./get-select-options.util");
const _processonedimensionalresultsutil = require("./process-one-dimensional-results.util");
const _sortchartdataifneededutil = require("./sort-chart-data-if-needed.util");
const transformToOneDimensionalBarChartData = ({ filteredRawResults, primaryAxisGroupByField, aggregateField, configuration, userTimezone, firstDayOfTheWeek, relationLabelResolution })=>{
    const layout = configuration.layout ?? _barchartlayoutenum.BarChartLayout.VERTICAL;
    const isHorizontal = layout === _barchartlayoutenum.BarChartLayout.HORIZONTAL;
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
    const indexByKey = configuration.primaryAxisGroupBySubFieldName ? `${primaryAxisGroupByField.name}${(0, _utils.capitalize)(configuration.primaryAxisGroupBySubFieldName)}` : primaryAxisGroupByField.name;
    const aggregateValueKey = indexByKey === aggregateField.name ? `${aggregateField.name}-aggregate` : aggregateField.name;
    const { processedDataPoints, formattedToRawLookup } = (0, _processonedimensionalresultsutil.processOneDimensionalResults)({
        rawResults: gapFilledResults,
        primaryAxisGroupByField,
        dateGranularity: configuration.primaryAxisDateGranularity,
        subFieldName: configuration.primaryAxisGroupBySubFieldName,
        userTimezone,
        firstDayOfTheWeek: convertedFirstDayOfTheWeek,
        relationLabelResolution
    });
    const sortedData = (0, _sortchartdataifneededutil.sortChartDataIfNeeded)({
        data: processedDataPoints,
        orderBy: configuration.primaryAxisOrderBy,
        manualSortOrder: configuration.primaryAxisManualSortOrder,
        formattedToRawLookup,
        getFieldValue: (item)=>item.formattedValue,
        getNumericValue: (item)=>item.aggregateValue,
        selectFieldOptions: selectOptions,
        fieldType: primaryAxisGroupByField.type,
        subFieldName: configuration.primaryAxisGroupBySubFieldName ?? undefined,
        dateGranularity: configuration.primaryAxisDateGranularity
    });
    const limitedSortedData = sortedData.slice(0, _barchartmaximumnumberofbarsconstant.BAR_CHART_MAXIMUM_NUMBER_OF_BARS);
    const transformedData = configuration.isCumulative ? (0, _applycumulativetoonedimensionalbardatautil.applyCumulativeToOneDimensionalBarData)(limitedSortedData) : limitedSortedData;
    const data = transformedData.map((item)=>({
            [indexByKey]: item.formattedValue,
            [aggregateValueKey]: item.aggregateValue
        }));
    const series = [
        {
            key: aggregateValueKey,
            label: aggregateField.label
        }
    ];
    const categoryLabel = primaryAxisGroupByField.label;
    const valueLabel = `${(0, _getaggregateoperationlabelutil.getAggregateOperationLabel)(configuration.aggregateOperation)} of ${aggregateField.label}`;
    const xAxisLabel = isHorizontal ? valueLabel : categoryLabel;
    const yAxisLabel = isHorizontal ? categoryLabel : valueLabel;
    return {
        data,
        indexBy: indexByKey,
        keys: [
            aggregateValueKey
        ],
        series,
        xAxisLabel,
        yAxisLabel,
        showLegend: configuration.displayLegend ?? true,
        showDataLabels: configuration.displayDataLabel ?? false,
        layout,
        groupMode: configuration.groupMode ?? _barchartgroupmodeenum.BarChartGroupMode.GROUPED,
        hasTooManyGroups: filteredRawResults.length > _barchartmaximumnumberofbarsconstant.BAR_CHART_MAXIMUM_NUMBER_OF_BARS || dateRangeWasTruncated,
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

//# sourceMappingURL=transform-to-one-dimensional-bar-chart-data.util.js.map