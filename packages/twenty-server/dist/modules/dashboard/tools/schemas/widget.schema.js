"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AggregateOperations () {
        return _types.AggregateOperations;
    },
    get WidgetConfigurationType () {
        return _widgetconfigurationtypetype.WidgetConfigurationType;
    },
    get chartFilterSchema () {
        return chartFilterSchema;
    },
    get graphConfigurationSchema () {
        return graphConfigurationSchema;
    },
    get graphConfigurationSchemaWithoutDefaults () {
        return graphConfigurationSchemaWithoutDefaults;
    },
    get widgetConfigurationSchema () {
        return widgetConfigurationSchema;
    },
    get widgetConfigurationSchemaWithoutDefaults () {
        return widgetConfigurationSchemaWithoutDefaults;
    },
    get widgetPositionSchema () {
        return widgetPositionSchema;
    },
    get widgetTypeSchema () {
        return widgetTypeSchema;
    }
});
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _zod = require("zod");
const _axisnamedisplayenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/axis-name-display.enum");
const _barchartgroupmodeenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/bar-chart-group-mode.enum");
const _barchartlayoutenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/bar-chart-layout.enum");
const _chartnumberformatenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/chart-number-format.enum");
const _graphorderbyenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum");
const _widgetconfigurationtypetype = require("../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
// Chart color options (MAIN_COLOR_NAMES plus 'auto').
// should we export MAIN_COLOR_NAMES from twenty-ui to twenty-shared and use that here?
const CHART_COLORS = [
    'auto',
    'red',
    'ruby',
    'crimson',
    'tomato',
    'orange',
    'amber',
    'yellow',
    'lime',
    'grass',
    'green',
    'jade',
    'mint',
    'turquoise',
    'cyan',
    'sky',
    'blue',
    'iris',
    'violet',
    'purple',
    'plum',
    'pink',
    'bronze',
    'gold',
    'brown',
    'gray'
];
const DATE_GRANULARITY_OPTIONS = [
    _types.ObjectRecordGroupByDateGranularity.DAY,
    _types.ObjectRecordGroupByDateGranularity.WEEK,
    _types.ObjectRecordGroupByDateGranularity.MONTH,
    _types.ObjectRecordGroupByDateGranularity.QUARTER,
    _types.ObjectRecordGroupByDateGranularity.YEAR,
    _types.ObjectRecordGroupByDateGranularity.DAY_OF_THE_WEEK,
    _types.ObjectRecordGroupByDateGranularity.MONTH_OF_THE_YEAR,
    _types.ObjectRecordGroupByDateGranularity.QUARTER_OF_THE_YEAR
];
const GRAPH_ORDER_BY_OPTIONS = Object.values(_graphorderbyenum.GraphOrderBy);
const AXIS_NAME_DISPLAY_OPTIONS = Object.values(_axisnamedisplayenum.AxisNameDisplay);
const CHART_NUMBER_FORMAT_OPTIONS = Object.values(_chartnumberformatenum.ChartNumberFormat);
const BAR_CHART_GROUP_MODE_OPTIONS = Object.values(_barchartgroupmodeenum.BarChartGroupMode);
const BAR_CHART_LAYOUT_OPTIONS = Object.values(_barchartlayoutenum.BarChartLayout);
const AGGREGATE_OPERATION_OPTIONS = Object.values(_types.AggregateOperations);
const FILTER_OPERAND_OPTIONS = Object.values(_types.ViewFilterOperand);
const chartRecordFilterSchema = _zod.z.object({
    fieldMetadataId: _zod.z.uuid().optional().describe('Field UUID to filter on (must belong to the widget object). Provide this or fieldName.'),
    fieldName: _zod.z.string().optional().describe('Field name to filter on (resolved to a UUID against the widget object). Alternative to fieldMetadataId.'),
    operand: _zod.z.enum(FILTER_OPERAND_OPTIONS).describe('Filter operator. Valid operators per field type — TEXT/EMAILS/FULL_NAME/ARRAY/PHONES: CONTAINS, DOES_NOT_CONTAIN, IS_EMPTY, IS_NOT_EMPTY. NUMBER/CURRENCY/RATING: GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL, IS, IS_NOT, IS_EMPTY, IS_NOT_EMPTY. DATE/DATE_TIME: IS, IS_RELATIVE, IS_IN_PAST, IS_IN_FUTURE, IS_TODAY, IS_BEFORE, IS_AFTER, IS_EMPTY, IS_NOT_EMPTY. SELECT: IS, IS_NOT, IS_EMPTY, IS_NOT_EMPTY. MULTI_SELECT: CONTAINS, DOES_NOT_CONTAIN, IS_EMPTY, IS_NOT_EMPTY. RELATION: IS, IS_NOT, IS_EMPTY, IS_NOT_EMPTY. BOOLEAN: IS.'),
    value: _zod.z.string().optional().describe('Filter value as a string. TEXT: plain string. NUMBER/CURRENCY: numeric string (CURRENCY value is the major unit, e.g. "1000"). BOOLEAN: "true" or "false". SELECT/MULTI_SELECT/RELATION: JSON array string of option values or record UUIDs, e.g. \'["OPTION_1","OPTION_2"]\'. Relative dates (operand IS_RELATIVE): "DIRECTION_AMOUNT_UNIT" where DIRECTION is PAST|THIS|NEXT and UNIT is DAY|WEEK|MONTH|QUARTER|YEAR — e.g. "PAST_7_DAY", "THIS_1_MONTH", "NEXT_3_WEEK" (use THIS_1_<UNIT> for the current period). Absolute dates (IS/IS_BEFORE/IS_AFTER): ISO date string. Omit for IS_EMPTY/IS_NOT_EMPTY/IS_TODAY/IS_IN_PAST/IS_IN_FUTURE.'),
    subFieldName: _zod.z.string().optional().describe('Required for composite fields — e.g. "amountMicros" or "currencyCode" for CURRENCY, "addressCity" for ADDRESS, "firstName"/"lastName" for FULL_NAME.'),
    recordFilterGroupId: _zod.z.string().optional().describe('ID of the record filter group this rule belongs to (for AND/OR grouping). Must match an id in recordFilterGroups. Omit when recordFilterGroups is not used.')
});
const chartRecordFilterGroupSchema = _zod.z.object({
    id: _zod.z.string().describe('Unique id for this filter group, referenced by recordFilterGroupId on filter rules.'),
    logicalOperator: _zod.z.enum([
        'AND',
        'OR'
    ]).describe('How rules within this group are combined.'),
    parentRecordFilterGroupId: _zod.z.string().optional().describe('Parent group id, for nested grouping.')
});
const chartFilterSchema = _zod.z.object({
    recordFilters: _zod.z.array(chartRecordFilterSchema).optional().describe('Filter rules applied to the records feeding this chart. Multiple rules with no recordFilterGroups are combined with AND.'),
    recordFilterGroups: _zod.z.array(chartRecordFilterGroupSchema).optional().describe('Optional groups to combine filter rules with AND/OR logic. Omit for a simple list of ANDed rules.')
}).describe('Filter restricting which records are included in this chart. All filtered fields must belong to the widget object.');
const displayDataLabelSchema = _zod.z.boolean().optional();
const displayLegendSchema = _zod.z.boolean().optional();
const chartNumberFormatSchema = _zod.z.enum(CHART_NUMBER_FORMAT_OPTIONS).optional().describe('Display format for data label values: SHORT abbreviates large numbers (1.3m), FULL shows the complete number (1,300,090). Tooltips always show the full value.');
const showCenterMetricSchema = _zod.z.boolean().optional().describe('Show aggregate value in center');
const hideEmptyCategorySchema = _zod.z.boolean().optional().describe('Hide slices with zero values');
const ratioAggregateConfigSchema = _zod.z.object({
    fieldMetadataId: _zod.z.uuid().optional().describe('Field UUID. Provide this or fieldName.'),
    fieldName: _zod.z.string().optional().describe('Field name (resolved to a UUID). Alternative to fieldMetadataId.'),
    optionValue: _zod.z.string()
});
const withPrimarySecondaryManualSortRefinements = (schema)=>schema.refine((data)=>data.primaryAxisOrderBy !== _graphorderbyenum.GraphOrderBy.MANUAL || Array.isArray(data.primaryAxisManualSortOrder) && data.primaryAxisManualSortOrder.length > 0, {
        message: 'primaryAxisManualSortOrder must be a non-empty array when primaryAxisOrderBy is MANUAL',
        path: [
            'primaryAxisManualSortOrder'
        ]
    }).refine((data)=>data.secondaryAxisOrderBy !== _graphorderbyenum.GraphOrderBy.MANUAL || Array.isArray(data.secondaryAxisManualSortOrder) && data.secondaryAxisManualSortOrder.length > 0, {
        message: 'secondaryAxisManualSortOrder must be a non-empty array when secondaryAxisOrderBy is MANUAL',
        path: [
            'secondaryAxisManualSortOrder'
        ]
    });
const withManualSortRefinement = (schema)=>schema.refine((data)=>data.orderBy !== _graphorderbyenum.GraphOrderBy.MANUAL || Array.isArray(data.manualSortOrder) && data.manualSortOrder.length > 0, {
        message: 'manualSortOrder must be a non-empty array when orderBy is MANUAL',
        path: [
            'manualSortOrder'
        ]
    });
const withRangeMinMaxRefinement = (schema)=>schema.refine((data)=>!((0, _guards.isNumber)(data.rangeMin) && (0, _guards.isNumber)(data.rangeMax) && data.rangeMin > data.rangeMax), {
        message: 'rangeMin must be less than or equal to rangeMax',
        path: [
            'rangeMin'
        ]
    });
const widgetPositionSchema = _zod.z.object({
    layoutMode: _zod.z.literal(_types.PageLayoutTabLayoutMode.GRID),
    row: _zod.z.number().min(0).describe('Row position (0-based)'),
    column: _zod.z.number().min(0).max(11).describe('Column position (0-11 for 12-column grid)'),
    rowSpan: _zod.z.number().min(1).describe('Number of rows the widget spans'),
    columnSpan: _zod.z.number().min(1).max(12).describe('Number of columns the widget spans (1-12)')
});
const widgetTypeSchema = _zod.z.enum([
    _types.WidgetType.VIEW,
    _types.WidgetType.GRAPH,
    _types.WidgetType.IFRAME,
    _types.WidgetType.STANDALONE_RICH_TEXT,
    _types.WidgetType.RECORD_TABLE
]);
const aggregateChartConfigSchemaBase = _zod.z.object({
    configurationType: _zod.z.literal(_widgetconfigurationtypetype.WidgetConfigurationType.AGGREGATE_CHART),
    aggregateFieldMetadataId: _zod.z.uuid().optional().describe('Field UUID to aggregate (must be from the widget object). Provide this or aggregateFieldName.'),
    aggregateFieldName: _zod.z.string().optional().describe('Field name to aggregate (resolved to a UUID against the widget object). Alternative to aggregateFieldMetadataId.'),
    aggregateOperation: _zod.z.enum(AGGREGATE_OPERATION_OPTIONS).describe('Aggregation operation: COUNT, SUM, AVG, MIN, MAX, etc.'),
    label: _zod.z.string().optional(),
    displayDataLabel: displayDataLabelSchema,
    numberFormat: _zod.z.enum(CHART_NUMBER_FORMAT_OPTIONS).optional().describe('Display format for the value: SHORT abbreviates large numbers (1.3m), FULL shows the complete number (1,300,090)'),
    prefix: _zod.z.string().optional(),
    suffix: _zod.z.string().optional(),
    ratioAggregateConfig: ratioAggregateConfigSchema.optional(),
    filter: chartFilterSchema.optional()
});
const aggregateChartConfigSchema = aggregateChartConfigSchemaBase.extend({
    displayDataLabel: displayDataLabelSchema.default(true)
});
const aggregateChartConfigSchemaWithoutDefaults = aggregateChartConfigSchemaBase;
const barChartConfigSchemaCore = _zod.z.object({
    configurationType: _zod.z.literal(_widgetconfigurationtypetype.WidgetConfigurationType.BAR_CHART),
    aggregateFieldMetadataId: _zod.z.uuid().optional().describe('Field UUID to aggregate. Provide this or aggregateFieldName.'),
    aggregateFieldName: _zod.z.string().optional().describe('Field name to aggregate (resolved to a UUID). Alternative to aggregateFieldMetadataId.'),
    aggregateOperation: _zod.z.enum(AGGREGATE_OPERATION_OPTIONS),
    primaryAxisGroupByFieldMetadataId: _zod.z.uuid().optional().describe('Field UUID to group by on primary axis. Provide this or primaryAxisGroupByFieldName.'),
    primaryAxisGroupByFieldName: _zod.z.string().optional().describe('Field name to group by on primary axis (resolved to a UUID). Alternative to primaryAxisGroupByFieldMetadataId.'),
    primaryAxisGroupBySubFieldName: _zod.z.string().optional().describe('Optional for relation fields: omit it to group by the related record itself, labelled with its display name; provide it (e.g. "name", "address.addressCity") to group by that attribute instead. REQUIRED for composite fields (e.g. "addressCity").'),
    secondaryAxisGroupByFieldMetadataId: _zod.z.uuid().optional(),
    secondaryAxisGroupByFieldName: _zod.z.string().optional().describe('Field name to group by on secondary axis (resolved to a UUID). Alternative to secondaryAxisGroupByFieldMetadataId.'),
    secondaryAxisGroupBySubFieldName: _zod.z.string().optional().describe('Optional for relation fields: omit it to group by the related record itself, labelled with its display name; provide it (e.g. "name", "stage") to group by that attribute instead. REQUIRED for composite fields (e.g. "addressCity").'),
    primaryAxisOrderBy: _zod.z.enum(GRAPH_ORDER_BY_OPTIONS).optional(),
    primaryAxisManualSortOrder: _zod.z.array(_zod.z.string()).optional(),
    secondaryAxisOrderBy: _zod.z.enum(GRAPH_ORDER_BY_OPTIONS).optional(),
    secondaryAxisManualSortOrder: _zod.z.array(_zod.z.string()).optional(),
    omitNullValues: _zod.z.boolean().optional(),
    primaryAxisDateGranularity: _zod.z.enum(DATE_GRANULARITY_OPTIONS).optional().describe('Date grouping granularity for X axis'),
    secondaryAxisGroupByDateGranularity: _zod.z.enum(DATE_GRANULARITY_OPTIONS).optional().describe('Date grouping granularity for secondary grouping'),
    color: _zod.z.enum(CHART_COLORS).optional().describe('Chart color theme'),
    axisNameDisplay: _zod.z.enum(AXIS_NAME_DISPLAY_OPTIONS).optional().describe('Which axis labels to show'),
    displayDataLabel: displayDataLabelSchema,
    displayLegend: displayLegendSchema,
    numberFormat: chartNumberFormatSchema,
    groupMode: _zod.z.enum(BAR_CHART_GROUP_MODE_OPTIONS).optional().describe('Bar display mode when using secondary grouping'),
    isCumulative: _zod.z.boolean().optional().describe('Show running totals'),
    rangeMin: _zod.z.number().optional().describe('Y axis minimum value'),
    rangeMax: _zod.z.number().optional().describe('Y axis maximum value'),
    layout: _zod.z.enum(BAR_CHART_LAYOUT_OPTIONS).describe('Layout orientation for bar charts'),
    filter: chartFilterSchema.optional()
});
const barChartConfigSchemaWithoutDefaults = withRangeMinMaxRefinement(withPrimarySecondaryManualSortRefinements(barChartConfigSchemaCore));
const barChartConfigSchema = withRangeMinMaxRefinement(withPrimarySecondaryManualSortRefinements(barChartConfigSchemaCore.extend({
    displayDataLabel: displayDataLabelSchema.default(false),
    displayLegend: displayLegendSchema.default(true)
})));
const lineChartConfigSchemaCore = _zod.z.object({
    configurationType: _zod.z.literal(_widgetconfigurationtypetype.WidgetConfigurationType.LINE_CHART),
    aggregateFieldMetadataId: _zod.z.uuid().optional().describe('Field UUID to aggregate. Provide this or aggregateFieldName.'),
    aggregateFieldName: _zod.z.string().optional().describe('Field name to aggregate (resolved to a UUID). Alternative to aggregateFieldMetadataId.'),
    aggregateOperation: _zod.z.enum(AGGREGATE_OPERATION_OPTIONS),
    primaryAxisGroupByFieldMetadataId: _zod.z.uuid().optional().describe('Field UUID to group by on primary axis. Provide this or primaryAxisGroupByFieldName.'),
    primaryAxisGroupByFieldName: _zod.z.string().optional().describe('Field name to group by on primary axis (resolved to a UUID). Alternative to primaryAxisGroupByFieldMetadataId.'),
    primaryAxisGroupBySubFieldName: _zod.z.string().optional().describe('Optional for relation fields: omit it to group by the related record itself, labelled with its display name; provide it (e.g. "name", "address.addressCity") to group by that attribute instead. REQUIRED for composite fields (e.g. "addressCity").'),
    secondaryAxisGroupByFieldMetadataId: _zod.z.uuid().optional(),
    secondaryAxisGroupByFieldName: _zod.z.string().optional().describe('Field name to group by on secondary axis (resolved to a UUID). Alternative to secondaryAxisGroupByFieldMetadataId.'),
    secondaryAxisGroupBySubFieldName: _zod.z.string().optional().describe('Optional for relation fields: omit it to group by the related record itself, labelled with its display name; provide it (e.g. "name", "stage") to group by that attribute instead. REQUIRED for composite fields (e.g. "addressCity").'),
    primaryAxisOrderBy: _zod.z.enum(GRAPH_ORDER_BY_OPTIONS).optional(),
    primaryAxisManualSortOrder: _zod.z.array(_zod.z.string()).optional(),
    secondaryAxisOrderBy: _zod.z.enum(GRAPH_ORDER_BY_OPTIONS).optional(),
    secondaryAxisManualSortOrder: _zod.z.array(_zod.z.string()).optional(),
    omitNullValues: _zod.z.boolean().optional(),
    primaryAxisDateGranularity: _zod.z.enum(DATE_GRANULARITY_OPTIONS).optional().describe('Date grouping granularity for X axis'),
    secondaryAxisGroupByDateGranularity: _zod.z.enum(DATE_GRANULARITY_OPTIONS).optional().describe('Date grouping granularity for secondary grouping'),
    color: _zod.z.enum(CHART_COLORS).optional().describe('Line color theme'),
    axisNameDisplay: _zod.z.enum(AXIS_NAME_DISPLAY_OPTIONS).optional().describe('Which axis labels to show'),
    displayDataLabel: displayDataLabelSchema,
    displayLegend: displayLegendSchema,
    numberFormat: chartNumberFormatSchema,
    isStacked: _zod.z.boolean().optional().describe('Stack multiple lines'),
    isCumulative: _zod.z.boolean().optional().describe('Show running totals'),
    rangeMin: _zod.z.number().optional().describe('Y axis minimum value'),
    rangeMax: _zod.z.number().optional().describe('Y axis maximum value'),
    filter: chartFilterSchema.optional()
});
const lineChartConfigSchemaWithoutDefaults = withRangeMinMaxRefinement(withPrimarySecondaryManualSortRefinements(lineChartConfigSchemaCore));
const lineChartConfigSchema = withRangeMinMaxRefinement(withPrimarySecondaryManualSortRefinements(lineChartConfigSchemaCore.extend({
    displayDataLabel: displayDataLabelSchema.default(false),
    displayLegend: displayLegendSchema.default(true)
})));
const pieChartConfigSchemaCore = _zod.z.object({
    configurationType: _zod.z.literal(_widgetconfigurationtypetype.WidgetConfigurationType.PIE_CHART),
    aggregateFieldMetadataId: _zod.z.uuid().optional().describe('Field UUID to aggregate. Provide this or aggregateFieldName.'),
    aggregateFieldName: _zod.z.string().optional().describe('Field name to aggregate (resolved to a UUID). Alternative to aggregateFieldMetadataId.'),
    aggregateOperation: _zod.z.enum(AGGREGATE_OPERATION_OPTIONS),
    groupByFieldMetadataId: _zod.z.uuid().optional().describe('Field UUID to slice by. Provide this or groupByFieldName.'),
    groupByFieldName: _zod.z.string().optional().describe('Field name to slice by (resolved to a UUID). Alternative to groupByFieldMetadataId.'),
    groupBySubFieldName: _zod.z.string().optional().describe('Optional for relation fields: omit it to group by the related record itself, labelled with its display name; provide it (e.g. "name", "stage") to group by that attribute instead. REQUIRED for composite fields (e.g. "addressCity").'),
    orderBy: _zod.z.enum(GRAPH_ORDER_BY_OPTIONS).optional(),
    manualSortOrder: _zod.z.array(_zod.z.string()).optional(),
    dateGranularity: _zod.z.enum(DATE_GRANULARITY_OPTIONS).optional().describe('Date grouping granularity when slicing by date'),
    color: _zod.z.enum(CHART_COLORS).optional().describe('Chart color theme'),
    displayDataLabel: displayDataLabelSchema,
    displayLegend: displayLegendSchema,
    numberFormat: chartNumberFormatSchema,
    showCenterMetric: showCenterMetricSchema,
    hideEmptyCategory: hideEmptyCategorySchema,
    filter: chartFilterSchema.optional()
});
const pieChartConfigSchemaWithoutDefaults = withManualSortRefinement(pieChartConfigSchemaCore);
const pieChartConfigSchema = withManualSortRefinement(pieChartConfigSchemaCore.extend({
    displayDataLabel: displayDataLabelSchema.default(true),
    displayLegend: displayLegendSchema.default(true),
    showCenterMetric: showCenterMetricSchema.default(true),
    hideEmptyCategory: hideEmptyCategorySchema.default(false)
}));
const recordTableConfigSchema = _zod.z.object({
    configurationType: _zod.z.literal(_widgetconfigurationtypetype.WidgetConfigurationType.RECORD_TABLE),
    viewId: _zod.z.uuid().describe('UUID of the dedicated view created for this widget. Must be created with create_view before creating the widget. Never reuse a record index view.'),
    recordLimit: _zod.z.number().int().min(1).optional().describe('Maximum number of records displayed in the table widget.')
});
const iframeConfigSchema = _zod.z.object({
    configurationType: _zod.z.literal(_widgetconfigurationtypetype.WidgetConfigurationType.IFRAME),
    url: _zod.z.string().url().optional().describe('URL to embed')
});
const richTextConfigSchema = _zod.z.object({
    configurationType: _zod.z.literal(_widgetconfigurationtypetype.WidgetConfigurationType.STANDALONE_RICH_TEXT),
    body: _zod.z.object({
        blocknote: _zod.z.string().nullable().optional().describe('BlockNote JSON string (advanced). Stringified array of BlockNote blocks.'),
        markdown: _zod.z.string().nullable().optional().describe('Markdown content string (preferred for AI). Supports headings, bold, lists, links, etc.')
    }).describe('Rich text content. Use { "markdown": "your content here" } for text. Supports full markdown syntax.')
});
const graphConfigurationSchema = _zod.z.discriminatedUnion('configurationType', [
    aggregateChartConfigSchema,
    barChartConfigSchema,
    lineChartConfigSchema,
    pieChartConfigSchema
]);
const graphConfigurationSchemaWithoutDefaults = _zod.z.discriminatedUnion('configurationType', [
    aggregateChartConfigSchemaWithoutDefaults,
    barChartConfigSchemaWithoutDefaults,
    lineChartConfigSchemaWithoutDefaults,
    pieChartConfigSchemaWithoutDefaults
]);
const widgetConfigurationSchema = _zod.z.discriminatedUnion('configurationType', [
    aggregateChartConfigSchema,
    barChartConfigSchema,
    lineChartConfigSchema,
    pieChartConfigSchema,
    iframeConfigSchema,
    richTextConfigSchema,
    recordTableConfigSchema
]).optional().describe('Widget configuration - structure depends on widget type');
const widgetConfigurationSchemaWithoutDefaults = _zod.z.discriminatedUnion('configurationType', [
    aggregateChartConfigSchemaWithoutDefaults,
    barChartConfigSchemaWithoutDefaults,
    lineChartConfigSchemaWithoutDefaults,
    pieChartConfigSchemaWithoutDefaults,
    iframeConfigSchema,
    richTextConfigSchema,
    recordTableConfigSchema
]).optional().describe('Widget configuration - structure depends on widget type');

//# sourceMappingURL=widget.schema.js.map