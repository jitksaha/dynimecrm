"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChartRelationLabelService", {
    enumerable: true,
    get: function() {
        return ChartRelationLabelService;
    }
});
const _common = require("@nestjs/common");
const _lodashchunk = /*#__PURE__*/ _interop_require_default(require("lodash.chunk"));
const _utils = require("twenty-shared/utils");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../../engine/metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _ormworkspacecontextstorage = require("../../../../engine/twenty-orm/storage/orm-workspace-context.storage");
const _formatresultutil = require("../../../../engine/twenty-orm/utils/format-result.util");
const _resolverolepermissionconfigutil = require("../../../../engine/twenty-orm/utils/resolve-role-permission-config.util");
const _chartrelationlabelbatchsizeconstant = require("../constants/chart-relation-label-batch-size.constant");
const _buildrawlabelbyrecordidutil = require("../utils/build-raw-label-by-record-id.util");
const _buildresolvablechartrelationaxisutil = require("../utils/build-resolvable-chart-relation-axis.util");
const _builduniquerelationlabelsutil = require("../utils/build-unique-relation-labels.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ChartRelationLabelService = class ChartRelationLabelService {
    async resolveRelationLabels({ rawResults, primaryAxis, secondaryAxis, authContext, flatObjectMetadataMaps, flatFieldMetadataMaps }) {
        const axisInputs = [
            {
                dimensionIndex: 0,
                axis: primaryAxis
            },
            ...(0, _utils.isDefined)(secondaryAxis) ? [
                {
                    dimensionIndex: 1,
                    axis: secondaryAxis
                }
            ] : []
        ];
        const resolvableAxes = axisInputs.map(({ dimensionIndex, axis })=>(0, _buildresolvablechartrelationaxisutil.buildResolvableChartRelationAxis)({
                dimensionIndex,
                axis,
                rawResults,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            })).filter(_utils.isDefined);
        if (!(0, _utils.isNonEmptyArray)(resolvableAxes)) {
            return {};
        }
        const rawLabelsByTargetObjectId = await this.fetchRawLabelsPerTargetObject({
            resolvableAxes,
            authContext,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
        const resolutionByDimensionIndex = new Map();
        for (const resolvableAxis of resolvableAxes){
            const rawLabelByRecordId = rawLabelsByTargetObjectId.get(resolvableAxis.targetFlatObjectMetadata.id) ?? new Map();
            resolutionByDimensionIndex.set(resolvableAxis.dimensionIndex, (0, _builduniquerelationlabelsutil.buildUniqueRelationLabels)({
                rawLabelByRecordId,
                allRecordIds: resolvableAxis.recordIds
            }));
        }
        return {
            primary: resolutionByDimensionIndex.get(0),
            secondary: resolutionByDimensionIndex.get(1)
        };
    }
    async fetchRawLabelsPerTargetObject({ resolvableAxes, authContext, flatObjectMetadataMaps, flatFieldMetadataMaps }) {
        const rawLabelsByTargetObjectId = new Map();
        const axesByTargetObjectId = new Map();
        for (const resolvableAxis of resolvableAxes){
            const targetObjectId = resolvableAxis.targetFlatObjectMetadata.id;
            const existingAxesGroup = axesByTargetObjectId.get(targetObjectId);
            if (!(0, _utils.isDefined)(existingAxesGroup)) {
                axesByTargetObjectId.set(targetObjectId, {
                    targetFlatObjectMetadata: resolvableAxis.targetFlatObjectMetadata,
                    labelIdentifierColumnNames: resolvableAxis.labelIdentifierColumnNames,
                    recordIds: new Set(resolvableAxis.recordIds)
                });
                continue;
            }
            for (const recordId of resolvableAxis.recordIds){
                existingAxesGroup.recordIds.add(recordId);
            }
        }
        await Promise.all([
            ...axesByTargetObjectId.values()
        ].map(async ({ targetFlatObjectMetadata, labelIdentifierColumnNames, recordIds })=>{
            const records = await this.fetchLabelIdentifierRecords({
                targetFlatObjectMetadata,
                labelIdentifierColumnNames,
                recordIds: [
                    ...recordIds
                ],
                authContext,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            rawLabelsByTargetObjectId.set(targetFlatObjectMetadata.id, (0, _buildrawlabelbyrecordidutil.buildRawLabelByRecordId)({
                records,
                targetFlatObjectMetadata,
                flatFieldMetadataMaps
            }));
        }));
        return rawLabelsByTargetObjectId;
    }
    async fetchLabelIdentifierRecords({ targetFlatObjectMetadata, labelIdentifierColumnNames, recordIds, authContext, flatObjectMetadataMaps, flatFieldMetadataMaps }) {
        try {
            return await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                const workspaceContext = (0, _ormworkspacecontextstorage.getWorkspaceContext)();
                const rolePermissionConfig = (0, _resolverolepermissionconfigutil.resolveRolePermissionConfig)({
                    authContext: workspaceContext.authContext,
                    userWorkspaceRoleMap: workspaceContext.userWorkspaceRoleMap,
                    apiKeyRoleMap: workspaceContext.apiKeyRoleMap
                });
                if (!(0, _utils.isDefined)(rolePermissionConfig)) {
                    return [];
                }
                const repository = this.workspaceOrmManager.getRepository(targetFlatObjectMetadata.nameSingular, rolePermissionConfig);
                const alias = targetFlatObjectMetadata.nameSingular;
                const rawRowChunks = await Promise.all((0, _lodashchunk.default)(recordIds, _chartrelationlabelbatchsizeconstant.CHART_RELATION_LABEL_BATCH_SIZE).map((recordIdChunk)=>{
                    const queryBuilder = repository.createQueryBuilder(alias);
                    queryBuilder.select([]);
                    for (const columnName of labelIdentifierColumnNames){
                        queryBuilder.addSelect(`"${alias}"."${columnName}"`, columnName);
                    }
                    return queryBuilder.where(`"${alias}".id IN (:...recordIdChunk)`, {
                        recordIdChunk
                    }).getRawMany();
                }));
                const fieldMapsForObject = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, targetFlatObjectMetadata);
                return (0, _formatresultutil.formatResult)(rawRowChunks.flat(), targetFlatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, fieldMapsForObject);
            }, authContext);
        } catch (error) {
            this.logger.warn(`Failed to resolve relation labels for object ${targetFlatObjectMetadata.nameSingular}: ${error instanceof Error ? error.message : String(error)}`);
            return [];
        }
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
        this.logger = new _common.Logger(ChartRelationLabelService.name);
    }
};
ChartRelationLabelService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], ChartRelationLabelService);

//# sourceMappingURL=chart-relation-label.service.js.map