"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LineChartDataService", {
    enumerable: true,
    get: function() {
        return LineChartDataService;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _workspacemanyorallflatentitymapscacheservice = require("../../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _buildobjectidbynamemapsutil = require("../../../../engine/metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util");
const _extraitemtodetecttoomanygroupsconstant = require("../constants/extra-item-to-detect-too-many-groups.constant");
const _linechartmaximumnumberofdatapointsconstant = require("../constants/line-chart-maximum-number-of-data-points.constant");
const _linechartmaximumnumberofnonstackedseriesconstant = require("../constants/line-chart-maximum-number-of-non-stacked-series.constant");
const _linechartmaximumnumberofstackedseriesconstant = require("../constants/line-chart-maximum-number-of-stacked-series.constant");
const _chartdataexception = require("../exceptions/chart-data.exception");
const _chartdataqueryservice = require("./chart-data-query.service");
const _chartrelationlabelservice = require("./chart-relation-label.service");
const _filteroutemptychartbucketsutil = require("../utils/filter-out-empty-chart-buckets.util");
const _filteroutunresolvedrelationbucketsutil = require("../utils/filter-out-unresolved-relation-buckets.util");
const _getfieldmetadatautil = require("../utils/get-field-metadata.util");
const _buildlinechartseriesidprefixutil = require("../utils/build-line-chart-series-id-prefix.util");
const _wrapchartdataqueryerrorutil = require("../utils/wrap-chart-data-query-error.util");
const _transformtoonedimensionallinechartdatautil = require("../utils/transform-to-one-dimensional-line-chart-data.util");
const _transformtotwodimensionallinechartdatautil = require("../utils/transform-to-two-dimensional-line-chart-data.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LineChartDataService = class LineChartDataService {
    async getLineChartData({ workspaceId, objectMetadataId, configuration, authContext }) {
        try {
            const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId,
                flatMapsKeys: [
                    'flatObjectMetadataMaps',
                    'flatFieldMetadataMaps'
                ]
            });
            if (!(0, _utils.isDefined)(objectMetadataId)) {
                throw new _chartdataexception.ChartDataException((0, _chartdataexception.generateChartDataExceptionMessage)(_chartdataexception.ChartDataExceptionCode.OBJECT_METADATA_NOT_FOUND, 'Widget has no objectMetadataId'), _chartdataexception.ChartDataExceptionCode.OBJECT_METADATA_NOT_FOUND);
            }
            const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: objectMetadataId,
                flatEntityMaps: flatObjectMetadataMaps
            });
            if (!(0, _utils.isDefined)(flatObjectMetadata)) {
                throw new _chartdataexception.ChartDataException((0, _chartdataexception.generateChartDataExceptionMessage)(_chartdataexception.ChartDataExceptionCode.OBJECT_METADATA_NOT_FOUND, objectMetadataId), _chartdataexception.ChartDataExceptionCode.OBJECT_METADATA_NOT_FOUND);
            }
            const primaryAxisGroupByField = (0, _getfieldmetadatautil.getFieldMetadata)(configuration.primaryAxisGroupByFieldMetadataId, flatFieldMetadataMaps);
            const aggregateField = (0, _getfieldmetadatautil.getFieldMetadata)(configuration.aggregateFieldMetadataId, flatFieldMetadataMaps);
            const isTwoDimensional = (0, _utils.isDefined)(configuration.secondaryAxisGroupByFieldMetadataId);
            let secondaryAxisGroupByField;
            if (isTwoDimensional) {
                secondaryAxisGroupByField = (0, _getfieldmetadatautil.getFieldMetadata)(configuration.secondaryAxisGroupByFieldMetadataId, flatFieldMetadataMaps);
            }
            const isStackedTwoDimensional = isTwoDimensional && configuration.isStacked === true;
            const maxSeriesForQuery = isStackedTwoDimensional ? _linechartmaximumnumberofstackedseriesconstant.LINE_CHART_MAXIMUM_NUMBER_OF_STACKED_SERIES : _linechartmaximumnumberofnonstackedseriesconstant.LINE_CHART_MAXIMUM_NUMBER_OF_NON_STACKED_SERIES;
            const limit = isTwoDimensional ? _linechartmaximumnumberofdatapointsconstant.LINE_CHART_MAXIMUM_NUMBER_OF_DATA_POINTS * maxSeriesForQuery + _extraitemtodetecttoomanygroupsconstant.EXTRA_ITEM_TO_DETECT_TOO_MANY_GROUPS : _linechartmaximumnumberofdatapointsconstant.LINE_CHART_MAXIMUM_NUMBER_OF_DATA_POINTS + _extraitemtodetecttoomanygroupsconstant.EXTRA_ITEM_TO_DETECT_TOO_MANY_GROUPS;
            const userTimezone = configuration.timezone ?? 'UTC';
            const firstDayOfTheWeek = configuration.firstDayOfTheWeek ?? _constants.CalendarStartDay.MONDAY;
            const { idByNameSingular: objectIdByNameSingular } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
            const rawResults = await this.chartDataQueryService.executeGroupByQuery({
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                objectIdByNameSingular,
                authContext,
                groupByFieldMetadataId: configuration.primaryAxisGroupByFieldMetadataId,
                groupBySubFieldName: configuration.primaryAxisGroupBySubFieldName,
                aggregateFieldMetadataId: configuration.aggregateFieldMetadataId,
                aggregateOperation: configuration.aggregateOperation,
                filter: configuration.filter,
                dateGranularity: configuration.primaryAxisDateGranularity,
                userTimezone,
                firstDayOfTheWeek,
                limit,
                primaryAxisOrderBy: configuration.primaryAxisOrderBy,
                secondaryGroupByFieldMetadataId: configuration.secondaryAxisGroupByFieldMetadataId,
                secondaryGroupBySubFieldName: configuration.secondaryAxisGroupBySubFieldName,
                secondaryDateGranularity: configuration.secondaryAxisGroupByDateGranularity,
                secondaryAxisOrderBy: configuration.secondaryAxisOrderBy,
                splitMultiValueFields: configuration.splitMultiValueFields
            });
            const seriesIdPrefix = (0, _buildlinechartseriesidprefixutil.buildLineChartSeriesIdPrefix)(objectMetadataId, configuration);
            const filteredResults = (0, _filteroutemptychartbucketsutil.filterOutEmptyChartBuckets)({
                rawResults,
                shouldOmitEmptyBuckets: configuration.omitNullValues ?? false
            });
            const relationLabelResolutions = await this.chartRelationLabelService.resolveRelationLabels({
                rawResults: filteredResults,
                primaryAxis: {
                    groupByField: primaryAxisGroupByField,
                    subFieldName: configuration.primaryAxisGroupBySubFieldName
                },
                secondaryAxis: isTwoDimensional && (0, _utils.isDefined)(secondaryAxisGroupByField) ? {
                    groupByField: secondaryAxisGroupByField,
                    subFieldName: configuration.secondaryAxisGroupBySubFieldName
                } : undefined,
                authContext,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            const resolvedResults = (0, _filteroutunresolvedrelationbucketsutil.filterOutUnresolvedRelationBuckets)({
                rawResults: filteredResults,
                primaryRelationLabelResolution: relationLabelResolutions.primary,
                secondaryRelationLabelResolution: relationLabelResolutions.secondary
            });
            if (isTwoDimensional && (0, _utils.isDefined)(secondaryAxisGroupByField)) {
                return (0, _transformtotwodimensionallinechartdatautil.transformToTwoDimensionalLineChartData)({
                    filteredRawResults: resolvedResults,
                    primaryAxisGroupByField,
                    secondaryAxisGroupByField,
                    aggregateField,
                    configuration,
                    userTimezone,
                    firstDayOfTheWeek,
                    seriesIdPrefix,
                    primaryRelationLabelResolution: relationLabelResolutions.primary,
                    secondaryRelationLabelResolution: relationLabelResolutions.secondary
                });
            }
            return (0, _transformtoonedimensionallinechartdatautil.transformToOneDimensionalLineChartData)({
                filteredRawResults: resolvedResults,
                primaryAxisGroupByField,
                aggregateField,
                configuration,
                userTimezone,
                firstDayOfTheWeek,
                seriesIdPrefix,
                relationLabelResolution: relationLabelResolutions.primary
            });
        } catch (error) {
            throw (0, _wrapchartdataqueryerrorutil.wrapChartDataQueryError)(error, 'Line chart data retrieval failed');
        }
    }
    constructor(workspaceManyOrAllFlatEntityMapsCacheService, chartDataQueryService, chartRelationLabelService){
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.chartDataQueryService = chartDataQueryService;
        this.chartRelationLabelService = chartRelationLabelService;
    }
};
LineChartDataService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _chartdataqueryservice.ChartDataQueryService === "undefined" ? Object : _chartdataqueryservice.ChartDataQueryService,
        typeof _chartrelationlabelservice.ChartRelationLabelService === "undefined" ? Object : _chartrelationlabelservice.ChartRelationLabelService
    ])
], LineChartDataService);

//# sourceMappingURL=line-chart-data.service.js.map