"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FindRecordsService", {
    enumerable: true,
    get: function() {
        return FindRecordsService;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _guards = require("@sniptt/guards");
const _commonfindmanyqueryrunnerservice = require("../../../api/common/common-query-runners/common-find-many-query-runner.service");
const _getrelationsselectfieldsutil = require("../../../api/common/common-select-fields/utils/get-relations-select-fields.util");
const _commonapicontextbuilderservice = require("./common-api-context-builder.service");
const _buildeffectiveselectedfieldsutil = require("../utils/build-effective-selected-fields.util");
const _getrecorddisplaynameutil = require("../utils/get-record-display-name.util");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FindRecordsService = class FindRecordsService {
    async execute(params) {
        const { objectName, filter, orderBy, limit, offset = 0, authContext, rolePermissionConfig, select, shouldBuildEffectiveSelectFields } = params;
        if (shouldBuildEffectiveSelectFields && !(0, _guards.isNonEmptyArray)(select)) {
            return {
                success: false,
                message: 'Select at least one field in select parameter',
                error: 'Select is required'
            };
        }
        try {
            const { queryRunnerContext, selectedFields: allSelectableFields, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, objectsPermissions } = await this.commonApiContextBuilder.build({
                authContext,
                objectName,
                rolePermissionConfig
            });
            const { effectiveSelectedFields, warnings } = shouldBuildEffectiveSelectFields && (0, _utils.isDefined)(select) ? (0, _buildeffectiveselectedfieldsutil.buildEffectiveSelectedFields)({
                select,
                filter,
                orderBy,
                objectName,
                flatObjectMetadata,
                flatFieldMetadataMaps,
                flatObjectMetadataMaps,
                selectedFields: allSelectableFields,
                objectsPermissions,
                selectableRelationFields: (0, _getrelationsselectfieldsutil.getRelationsSelectFields)({
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    flatObjectMetadata,
                    objectsPermissions,
                    depth: 1,
                    onlyUseLabelIdentifierFieldsInRelations: true
                })
            }) : {
                effectiveSelectedFields: allSelectableFields,
                warnings: []
            };
            // Add id to orderBy for consistent pagination
            const orderByWithIdCondition = [
                ...(orderBy ?? []).filter((item)=>item !== undefined),
                {
                    id: _types.OrderByDirection.AscNullsFirst
                }
            ];
            const { results: { records, totalCount, pageInfo } } = await this.commonFindManyRunner.execute({
                filter,
                orderBy: orderByWithIdCondition,
                first: limit ? Math.min(limit, _constants.QUERY_MAX_RECORDS) : _constants.QUERY_MAX_RECORDS,
                offset,
                selectedFields: {
                    ...effectiveSelectedFields,
                    totalCount: true
                }
            }, queryRunnerContext);
            this.logger.log(`Found ${records.length} records in ${objectName}`);
            const recordReferences = records.map((record)=>({
                    objectNameSingular: objectName,
                    recordId: record.id,
                    displayName: (0, _getrecorddisplaynameutil.getRecordDisplayName)(record, flatObjectMetadata, flatFieldMetadataMaps)
                }));
            return {
                success: true,
                message: `Found ${records.length} ${objectName} records`,
                result: {
                    records,
                    count: totalCount ?? 0,
                    hasNextPage: pageInfo.hasNextPage
                },
                ...(0, _guards.isNonEmptyArray)(warnings) ? {
                    warnings: warnings
                } : {},
                recordReferences
            };
        } catch (error) {
            this.logger.error(`Failed to find records: ${error}`);
            return {
                success: false,
                message: `Failed to find ${objectName} records`,
                error: error instanceof Error ? error.message : 'Failed to find records'
            };
        }
    }
    constructor(commonFindManyRunner, commonApiContextBuilder){
        this.commonFindManyRunner = commonFindManyRunner;
        this.commonApiContextBuilder = commonApiContextBuilder;
        this.logger = new _common.Logger(FindRecordsService.name);
    }
};
FindRecordsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _commonfindmanyqueryrunnerservice.CommonFindManyQueryRunnerService === "undefined" ? Object : _commonfindmanyqueryrunnerservice.CommonFindManyQueryRunnerService,
        typeof _commonapicontextbuilderservice.CommonApiContextBuilderService === "undefined" ? Object : _commonapicontextbuilderservice.CommonApiContextBuilderService
    ])
], FindRecordsService);

//# sourceMappingURL=find-records.service.js.map