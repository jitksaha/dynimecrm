"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommonFindManyQueryRunnerService", {
    enumerable: true,
    get: function() {
        return CommonFindManyQueryRunnerService;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _commonbasequeryrunnerservice = require("./common-base-query-runner.service");
const _commonqueryrunnerexception = require("./errors/common-query-runner.exception");
const _standarderrormessageconstant = require("./errors/standard-error-message.constant");
const _commonqueryargstype = require("../types/common-query-args.type");
const _buildcursorpageutil = require("../../utils/build-cursor-page.util");
const _getnontoonejoinaliasesutil = require("../utils/get-non-to-one-join-aliases.util");
const _getpageinfoutil = require("../utils/get-page-info.util");
const _processaggregatehelper = require("../../graphql/graphql-query-runner/helpers/process-aggregate.helper");
const _buildcolumnstoselect = require("../../graphql/graphql-query-runner/utils/build-columns-to-select");
const _buildorderbycolumnstoselect = require("../../graphql/graphql-query-runner/utils/build-order-by-columns-to-select");
const _cursorsutil = require("../../graphql/graphql-query-runner/utils/cursors.util");
const _buildorderbyvaluesbyrecordidutil = require("../../utils/build-order-by-values-by-record-id.util");
const _computecursorargfilterutils = require("../../utils/compute-cursor-arg-filter.utils");
const _resolveorderbyleavesutils = require("../../utils/resolve-order-by-leaves.utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CommonFindManyQueryRunnerService = class CommonFindManyQueryRunnerService extends _commonbasequeryrunnerservice.CommonBaseQueryRunnerService {
    async run(args, queryRunnerContext) {
        const { authContext, rolePermissionConfig, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, commonQueryParser } = queryRunnerContext;
        const readRepository = this.getReadRepository(queryRunnerContext);
        const queryBuilder = readRepository.createQueryBuilder(flatObjectMetadata.nameSingular);
        const aggregateQueryBuilder = queryBuilder.clone();
        let appliedFilters = args.filter ?? {};
        commonQueryParser.applyFilterToBuilder(aggregateQueryBuilder, flatObjectMetadata.nameSingular, appliedFilters);
        commonQueryParser.applyDeletedAtToBuilder(aggregateQueryBuilder, appliedFilters);
        // Normalizing to deduplicated leaves makes the appended id tie-breaker
        // yield to a caller-provided id ordering, and guarantees the SQL scan
        // order and the keyset conditions derive from the same list
        const orderByLeaves = (0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
            orderBy: [
                ...args.orderBy ?? [],
                {
                    id: _types.OrderByDirection.AscNullsFirst
                }
            ],
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            strictValidation: true
        });
        const orderByWithIdCondition = (0, _resolveorderbyleavesutils.buildOrderByFromLeaves)(orderByLeaves);
        const isForwardPagination = !(0, _utils.isDefined)(args.before);
        const cursor = (0, _cursorsutil.getCursor)(args);
        if (cursor) {
            const cursorArgFilter = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy: orderByWithIdCondition,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination
            });
            if (cursorArgFilter.length > 0) {
                appliedFilters = args.filter && Object.keys(args.filter).length > 0 ? {
                    and: [
                        args.filter,
                        {
                            or: cursorArgFilter
                        }
                    ]
                } : {
                    or: cursorArgFilter
                };
            }
        }
        commonQueryParser.applyFilterToBuilder(queryBuilder, flatObjectMetadata.nameSingular, appliedFilters);
        const parsedOrderBy = commonQueryParser.applyOrderToBuilder(queryBuilder, orderByWithIdCondition, flatObjectMetadata.nameSingular, isForwardPagination);
        commonQueryParser.applyDeletedAtToBuilder(queryBuilder, appliedFilters);
        _processaggregatehelper.ProcessAggregateHelper.addSelectedAggregatedFieldsQueriesToQueryBuilder({
            selectedAggregatedFields: args.selectedFieldsResult.aggregate,
            queryBuilder: aggregateQueryBuilder,
            objectMetadataNameSingular: flatObjectMetadata.nameSingular
        });
        const limit = args.first ?? args.last ?? _constants.QUERY_MAX_RECORDS;
        const columnsToSelect = {
            ...(0, _buildcolumnstoselect.buildColumnsToSelect)({
                select: args.selectedFieldsResult.select,
                relations: args.selectedFieldsResult.relations,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            }),
            // Order columns must be hydrated onto the records even when not requested:
            // cursor encoding reads the sort values from them (issue #24333)
            ...(0, _buildorderbycolumnstoselect.buildOrderByColumnsToSelect)({
                orderBy: args.orderBy,
                flatObjectMetadata,
                flatFieldMetadataMaps
            })
        };
        queryBuilder.setFindOptions({
            select: columnsToSelect
        });
        // A join that can duplicate root rows makes a row-level LIMIT return fewer records than
        // asked, so it is rejected rather than paginated with take/skip, which drops the LIMIT
        // from the scan.
        const nonToOneJoinAliases = (0, _getnontoonejoinaliasesutil.getNonToOneJoinAliases)(queryBuilder);
        if (nonToOneJoinAliases.length > 0) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Cannot filter or order through ${nonToOneJoinAliases.join(', ')}: only to-one relations are supported`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_QUERY_INPUT, {
                userFriendlyMessage: /*i18n*/ {
                    id: "8oFGnQ",
                    message: "Filtering or ordering through this relation is not supported."
                }
            });
        }
        if ((0, _utils.isDefined)(args.offset)) {
            queryBuilder.offset(args.offset);
        }
        queryBuilder.limit(limit + 1);
        // Add order columns AFTER setFindOptions (setFindOptions clears addSelect)
        // Pass columnsToSelect so we only add columns that aren't already selected
        commonQueryParser.addRelationOrderColumnsToBuilder(queryBuilder, parsedOrderBy, flatObjectMetadata.nameSingular, columnsToSelect);
        // Raw rows travel along the entities: the ordered join columns already
        // selected for the relation ordering are read out of them, so cursors get
        // their relation values whatever the client selected (or the REST depth)
        const { entities: fetchedObjectRecords, raw: fetchedRawRows } = await queryBuilder.getRawAndEntities();
        const orderByValuesByRecordId = (0, _buildorderbyvaluesbyrecordidutil.buildOrderByValuesByRecordId)({
            orderByLeaves,
            records: fetchedObjectRecords,
            rawRows: fetchedRawRows,
            objectNameSingular: flatObjectMetadata.nameSingular
        });
        const { items: objectRecords, pageInfo: cursorPageInfo } = (0, _buildcursorpageutil.buildCursorPage)({
            fetchedItems: fetchedObjectRecords,
            limit,
            direction: isForwardPagination ? 'forward' : 'backward',
            // getCursor applies cursors on truthiness, so an empty-string cursor
            // must not advertise navigation from a cursor.
            hasAfterCursor: Boolean(args.after),
            hasBeforeCursor: Boolean(args.before)
        });
        const pageInfo = (0, _getpageinfoutil.getPageInfo)({
            records: objectRecords,
            orderBy: orderByWithIdCondition,
            pageInfo: cursorPageInfo,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            orderByValuesByRecordId
        });
        const hasAggregatedFields = Object.keys(args.selectedFieldsResult.aggregate ?? {}).length > 0;
        const parentObjectRecordsAggregatedValues = hasAggregatedFields ? await aggregateQueryBuilder.getRawOne() : undefined;
        if ((0, _utils.isDefined)(args.selectedFieldsResult.relations)) {
            await this.processNestedRelationsHelper.processNestedRelations({
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                parentObjectMetadataItem: flatObjectMetadata,
                parentObjectRecords: objectRecords,
                parentObjectRecordsAggregatedValues,
                relations: args.selectedFieldsResult.relations,
                aggregate: args.selectedFieldsResult.aggregate,
                limit: _constants.QUERY_MAX_RECORDS_FROM_RELATION,
                authContext,
                rolePermissionConfig,
                selectedFields: args.selectedFieldsResult.select,
                ...this.getNestedRelationsReadPathOptions()
            });
        }
        return {
            records: objectRecords,
            aggregatedValues: parentObjectRecordsAggregatedValues,
            totalCount: parentObjectRecordsAggregatedValues?.totalCount,
            pageInfo,
            orderByValuesByRecordId,
            selectedFieldsResult: args.selectedFieldsResult
        };
    }
    async computeArgs(args, queryRunnerContext) {
        const { flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps } = queryRunnerContext;
        return {
            ...args,
            orderBy: this.orderByArgProcessor.process({
                orderBy: args.orderBy
            }),
            filter: this.filterArgProcessor.process({
                filter: args.filter,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            })
        };
    }
    async processQueryResult(queryResult, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, authContext) {
        const processedRecords = await this.commonResultGettersService.processRecordArray(queryResult.records, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, authContext.workspace.id);
        return {
            ...queryResult,
            records: processedRecords
        };
    }
    async validate(args, _queryRunnerContext) {
        if (args.first && args.last) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException('Cannot provide both first and last', _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.ARGS_CONFLICT, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        if (args.before && args.after) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException('Cannot provide both before and after', _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.ARGS_CONFLICT, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        if (args.before && args.first) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException('Cannot provide both before and first', _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.ARGS_CONFLICT, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        if (args.after && args.last) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException('Cannot provide both after and last', _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.ARGS_CONFLICT, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        if (args.first !== undefined && args.first < 0) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException('First argument must be non-negative', _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_FIRST, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        if (args.last !== undefined && args.last < 0) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException('Last argument must be non-negative', _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_LAST, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
    }
    computeQueryComplexity(selectedFieldsResult, args, queryRunnerContext) {
        const baseComplexity = super.computeQueryComplexity(selectedFieldsResult, args, queryRunnerContext);
        const { flatObjectMetadata, flatFieldMetadataMaps } = queryRunnerContext;
        const orderByRelationCount = (0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
            orderBy: args.orderBy ?? [],
            flatObjectMetadata,
            flatFieldMetadataMaps
        }).filter((leaf)=>leaf.kind === 'relation').length;
        return baseComplexity + orderByRelationCount;
    }
    constructor(...args){
        super(...args), this.operationName = _commonqueryargstype.CommonQueryNames.FIND_MANY, this.isReadOnly = true;
    }
};
CommonFindManyQueryRunnerService = _ts_decorate([
    (0, _common.Injectable)()
], CommonFindManyQueryRunnerService);

//# sourceMappingURL=common-find-many-query-runner.service.js.map