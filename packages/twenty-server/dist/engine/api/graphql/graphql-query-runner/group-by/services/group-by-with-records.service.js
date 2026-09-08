"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GroupByWithRecordsService", {
    enumerable: true,
    get: function() {
        return GroupByWithRecordsService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _lodashisempty = /*#__PURE__*/ _interop_require_default(require("lodash.isempty"));
const _utils = require("twenty-shared/utils");
const _processnestedrelationshelper = require("../../../../common/common-nested-relations-processor/process-nested-relations.helper");
const _getobjectaliasforgroupbyutil = require("../../../../common/common-query-runners/utils/get-object-alias-for-group-by.util");
const _commonresultgettersservice = require("../../../../common/common-result-getters/common-result-getters.service");
const _graphqlqueryparser = require("../../graphql-query-parsers/graphql-query.parser");
const _formatresultwithgroupbydimensionvaluesutil = require("../resolvers/utils/format-result-with-group-by-dimension-values.util");
const _groupbywithrecordsconstants = require("./group-by-with-records.constants");
const _buildgroupbyrecordconditionsutil = require("../utils/build-group-by-record-conditions.util");
const _getgrouplimitutil = require("../utils/get-group-limit.util");
const _buildcolumnstoselect = require("../../utils/build-columns-to-select");
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
let GroupByWithRecordsService = class GroupByWithRecordsService {
    async resolveWithRecords({ queryBuilderWithGroupBy, queryBuilderWithFiltersAndWithoutGroupBy, groupByDefinitions, selectedFieldsResult, queryRunnerContext, readRepository, orderByForRecords, groupLimit, offsetForRecords, nestedRelationsReadPathOptions }) {
        const effectiveGroupLimit = (0, _getgrouplimitutil.getGroupLimit)(groupLimit);
        const groupsResult = await queryBuilderWithGroupBy.limit(effectiveGroupLimit).getRawMany();
        if (groupsResult.length === 0) {
            return [];
        }
        const { authContext, rolePermissionConfig, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps } = queryRunnerContext;
        const columnsToSelect = (0, _buildcolumnstoselect.buildColumnsToSelect)({
            select: selectedFieldsResult.select,
            relations: selectedFieldsResult.relations,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
        const { sql, parameters } = this.buildRankedRecordsStatement({
            subQueryBuilder: queryBuilderWithFiltersAndWithoutGroupBy,
            columnsToSelect,
            groupsResult,
            groupByDefinitions,
            orderByForRecords,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            offsetForRecords: offsetForRecords ?? 0
        });
        const recordsResult = await readRepository.executeRaw(sql, parameters);
        const allRecords = recordsResult.flatMap((group)=>group.records).filter(_utils.isDefined);
        if (!(0, _lodashisempty.default)(selectedFieldsResult.relations)) {
            await this.processNestedRelationsHelper.processNestedRelations({
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                parentObjectMetadataItem: flatObjectMetadata,
                parentObjectRecords: allRecords,
                parentObjectRecordsAggregatedValues: {},
                relations: selectedFieldsResult.relations,
                aggregate: selectedFieldsResult.aggregate,
                limit: _groupbywithrecordsconstants.RELATIONS_PER_RECORD_LIMIT,
                authContext,
                rolePermissionConfig,
                selectedFields: selectedFieldsResult.select,
                ...nestedRelationsReadPathOptions
            });
        }
        return await (0, _formatresultwithgroupbydimensionvaluesutil.formatResultWithGroupByDimensionValues)({
            groupsResult,
            recordsResult,
            groupByDefinitions,
            aggregateFieldNames: Object.keys(selectedFieldsResult.aggregate),
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            processRecord: (record)=>this.commonResultGettersService.processRecord(record, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, authContext.workspace.id)
        });
    }
    buildRankedRecordsStatement({ subQueryBuilder, columnsToSelect, groupsResult, groupByDefinitions, orderByForRecords, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, offsetForRecords }) {
        const objectAlias = (0, _getobjectaliasforgroupbyutil.getObjectAlias)(flatObjectMetadata);
        subQueryBuilder.select([]);
        for (const columnName of Object.keys(columnsToSelect)){
            subQueryBuilder.addSelect(`"${objectAlias}"."${columnName}"`, `${_groupbywithrecordsconstants.SUB_QUERY_PREFIX}${columnName}`);
        }
        for (const groupByDefinition of groupByDefinitions){
            subQueryBuilder.addSelect(groupByDefinition.expression, groupByDefinition.alias);
        }
        const { sql: groupConditionsSql, parameters: groupConditionParameters } = (0, _buildgroupbyrecordconditionsutil.buildGroupByRecordConditions)({
            groupsResult,
            groupByDefinitions
        });
        subQueryBuilder.setParameters(groupConditionParameters);
        subQueryBuilder.andWhere(groupConditionsSql);
        subQueryBuilder.addSelect(this.buildRowNumberExpression({
            groupByDefinitions,
            orderByForRecords,
            subQueryBuilder,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        }), 'record_row_number');
        subQueryBuilder.applyRowLevelPermissions();
        const groupByAliases = groupByDefinitions.map((groupByDefinition)=>`"${groupByDefinition.alias}"`).join(', ');
        const pageStart = offsetForRecords;
        const pageEnd = offsetForRecords + _groupbywithrecordsconstants.RECORDS_PER_GROUP_LIMIT;
        const jsonObjectEntries = [
            ...Object.keys(columnsToSelect).map((columnName)=>`'${columnName}', "${_groupbywithrecordsconstants.SUB_QUERY_PREFIX}${columnName}"`),
            ...groupByDefinitions.map((groupByDefinition)=>`'${groupByDefinition.alias}', "${groupByDefinition.alias}"`)
        ].join(', ');
        const pageFilter = `record_row_number > ${pageStart} AND record_row_number <= ${pageEnd}`;
        const sql = `SELECT ${groupByAliases}, ` + `JSON_AGG(CASE WHEN ${pageFilter} THEN JSON_BUILD_OBJECT(${jsonObjectEntries}) END) ` + `FILTER (WHERE ${pageFilter}) AS "records" ` + `FROM (${subQueryBuilder.getQuery()}) AS "ranked_records" ` + `GROUP BY ${groupByAliases}`;
        return {
            sql,
            parameters: subQueryBuilder.getParameters()
        };
    }
    buildRowNumberExpression({ groupByDefinitions, orderByForRecords, subQueryBuilder, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps }) {
        const partitionBy = groupByDefinitions.map((groupByDefinition)=>groupByDefinition.expression).join(', ');
        if ((0, _lodashisempty.default)(orderByForRecords)) {
            return `ROW_NUMBER() OVER (PARTITION BY ${partitionBy})`;
        }
        const graphqlQueryParser = new _graphqlqueryparser.GraphqlQueryParser(flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps);
        const { orderByRawSQL, relationJoins } = graphqlQueryParser.getOrderByRawSQL(orderByForRecords, flatObjectMetadata.nameSingular);
        if (!(0, _guards.isNonEmptyString)(orderByRawSQL)) {
            return `ROW_NUMBER() OVER (PARTITION BY ${partitionBy})`;
        }
        for (const joinInfo of relationJoins){
            subQueryBuilder.leftJoin(`${flatObjectMetadata.nameSingular}.${joinInfo.joinAlias}`, joinInfo.joinAlias, undefined, {
                allowToManyJoin: true
            });
        }
        return `ROW_NUMBER() OVER (PARTITION BY ${partitionBy} ${orderByRawSQL})`;
    }
};
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _processnestedrelationshelper.ProcessNestedRelationsHelper === "undefined" ? Object : _processnestedrelationshelper.ProcessNestedRelationsHelper)
], GroupByWithRecordsService.prototype, "processNestedRelationsHelper", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _commonresultgettersservice.CommonResultGettersService === "undefined" ? Object : _commonresultgettersservice.CommonResultGettersService)
], GroupByWithRecordsService.prototype, "commonResultGettersService", void 0);
GroupByWithRecordsService = _ts_decorate([
    (0, _common.Injectable)()
], GroupByWithRecordsService);

//# sourceMappingURL=group-by-with-records.service.js.map