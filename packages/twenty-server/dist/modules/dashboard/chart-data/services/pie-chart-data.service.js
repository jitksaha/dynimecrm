"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PieChartDataService", {
    enumerable: true,
    get: function() {
        return PieChartDataService;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _workspacemanyorallflatentitymapscacheservice = require("../../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildobjectidbynamemapsutil = require("../../../../engine/metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util");
const _widgetconfigurationtypetype = require("../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const _extraitemtodetecttoomanygroupsconstant = require("../constants/extra-item-to-detect-too-many-groups.constant");
const _piechartmaximumnumberofslicesconstant = require("../constants/pie-chart-maximum-number-of-slices.constant");
const _chartdataexception = require("../exceptions/chart-data.exception");
const _chartdataqueryservice = require("./chart-data-query.service");
const _chartrelationlabelservice = require("./chart-relation-label.service");
const _filteroutemptychartbucketsutil = require("../utils/filter-out-empty-chart-buckets.util");
const _filteroutunresolvedrelationbucketsutil = require("../utils/filter-out-unresolved-relation-buckets.util");
const _getfieldmetadatautil = require("../utils/get-field-metadata.util");
const _wrapchartdataqueryerrorutil = require("../utils/wrap-chart-data-query-error.util");
const _transformtopiechartdatautil = require("../utils/transform-to-pie-chart-data.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PieChartDataService = class PieChartDataService {
    async getPieChartData({ workspaceId, objectMetadataId, configuration, authContext }) {
        try {
            if (configuration.configurationType !== _widgetconfigurationtypetype.WidgetConfigurationType.PIE_CHART) {
                throw new _chartdataexception.ChartDataException((0, _chartdataexception.generateChartDataExceptionMessage)(_chartdataexception.ChartDataExceptionCode.INVALID_WIDGET_CONFIGURATION, `Expected PIE_CHART, got ${configuration.configurationType}`), _chartdataexception.ChartDataExceptionCode.INVALID_WIDGET_CONFIGURATION);
            }
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
            const groupByField = (0, _getfieldmetadatautil.getFieldMetadata)(configuration.groupByFieldMetadataId, flatFieldMetadataMaps);
            const limit = _piechartmaximumnumberofslicesconstant.PIE_CHART_MAXIMUM_NUMBER_OF_SLICES + _extraitemtodetecttoomanygroupsconstant.EXTRA_ITEM_TO_DETECT_TOO_MANY_GROUPS;
            const { idByNameSingular: objectIdByNameSingular } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
            const rawResults = await this.chartDataQueryService.executeGroupByQuery({
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                objectIdByNameSingular,
                authContext,
                groupByFieldMetadataId: configuration.groupByFieldMetadataId,
                groupBySubFieldName: configuration.groupBySubFieldName,
                aggregateFieldMetadataId: configuration.aggregateFieldMetadataId,
                aggregateOperation: configuration.aggregateOperation,
                filter: configuration.filter,
                dateGranularity: configuration.dateGranularity,
                userTimezone: configuration.timezone ?? 'UTC',
                firstDayOfTheWeek: configuration.firstDayOfTheWeek ?? _constants.CalendarStartDay.MONDAY,
                limit,
                primaryAxisOrderBy: configuration.orderBy,
                splitMultiValueFields: configuration.splitMultiValueFields
            });
            const filteredResults = (0, _filteroutemptychartbucketsutil.filterOutEmptyChartBuckets)({
                rawResults,
                shouldOmitEmptyBuckets: configuration.hideEmptyCategory ?? false
            });
            const relationLabelResolutions = await this.chartRelationLabelService.resolveRelationLabels({
                rawResults: filteredResults,
                primaryAxis: {
                    groupByField,
                    subFieldName: configuration.groupBySubFieldName
                },
                authContext,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            const resolvedResults = (0, _filteroutunresolvedrelationbucketsutil.filterOutUnresolvedRelationBuckets)({
                rawResults: filteredResults,
                primaryRelationLabelResolution: relationLabelResolutions.primary,
                secondaryRelationLabelResolution: undefined
            });
            return (0, _transformtopiechartdatautil.transformToPieChartData)({
                filteredRawResults: resolvedResults,
                groupByField,
                configuration,
                userTimezone: configuration.timezone ?? 'UTC',
                firstDayOfTheWeek: configuration.firstDayOfTheWeek ?? _constants.CalendarStartDay.MONDAY,
                relationLabelResolution: relationLabelResolutions.primary
            });
        } catch (error) {
            throw (0, _wrapchartdataqueryerrorutil.wrapChartDataQueryError)(error, 'Pie chart data retrieval failed');
        }
    }
    constructor(workspaceManyOrAllFlatEntityMapsCacheService, chartDataQueryService, chartRelationLabelService){
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.chartDataQueryService = chartDataQueryService;
        this.chartRelationLabelService = chartRelationLabelService;
    }
};
PieChartDataService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _chartdataqueryservice.ChartDataQueryService === "undefined" ? Object : _chartdataqueryservice.ChartDataQueryService,
        typeof _chartrelationlabelservice.ChartRelationLabelService === "undefined" ? Object : _chartrelationlabelservice.ChartRelationLabelService
    ])
], PieChartDataService);

//# sourceMappingURL=pie-chart-data.service.js.map