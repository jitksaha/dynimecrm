"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "applyMetadataFilterToQueryBuilder", {
    enumerable: true,
    get: function() {
        return applyMetadataFilterToQueryBuilder;
    }
});
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const _normalizemetadatafiltercomparisonutil = require("./normalize-metadata-filter-comparison.util");
const buildBooleanCondition = (column, operator, value)=>{
    if (value === null) {
        return `${column} ${operator} NULL`;
    }
    return `${column} ${operator} ${value ? 'TRUE' : 'FALSE'}`;
};
const applyComparisonToQueryBuilder = ({ whereBuilder, column, comparison, parameterCounter })=>{
    const nextParameterName = ()=>`metadataFilterParameter${parameterCounter.value++}`;
    const simpleOperators = {
        eq: '=',
        neq: '!=',
        gt: '>',
        gte: '>=',
        lt: '<',
        lte: '<='
    };
    for (const [comparisonKey, sqlOperator] of Object.entries(simpleOperators)){
        const value = comparison[comparisonKey];
        if ((0, _utils.isDefined)(value)) {
            const parameterName = nextParameterName();
            whereBuilder.andWhere(`${column} ${sqlOperator} :${parameterName}`, {
                [parameterName]: value
            });
        }
    }
    const likeOperators = {
        like: 'LIKE',
        notLike: 'NOT LIKE',
        iLike: 'ILIKE',
        notILike: 'NOT ILIKE'
    };
    for (const [comparisonKey, sqlOperator] of Object.entries(likeOperators)){
        const value = comparison[comparisonKey];
        if ((0, _utils.isDefined)(value)) {
            const parameterName = nextParameterName();
            whereBuilder.andWhere(`${column}::text ${sqlOperator} :${parameterName}`, {
                [parameterName]: value
            });
        }
    }
    if ((0, _utils.isDefined)(comparison.in)) {
        if (comparison.in.length === 0) {
            whereBuilder.andWhere('1 = 0');
        } else {
            const parameterName = nextParameterName();
            whereBuilder.andWhere(`${column} IN (:...${parameterName})`, {
                [parameterName]: comparison.in
            });
        }
    }
    if ((0, _utils.isDefined)(comparison.notIn) && comparison.notIn.length > 0) {
        const parameterName = nextParameterName();
        whereBuilder.andWhere(`${column} NOT IN (:...${parameterName})`, {
            [parameterName]: comparison.notIn
        });
    }
    if (comparison.is !== undefined) {
        whereBuilder.andWhere(buildBooleanCondition(column, 'IS', comparison.is ?? null));
    }
    if (comparison.isNot !== undefined) {
        whereBuilder.andWhere(buildBooleanCondition(column, 'IS NOT', comparison.isNot ?? null));
    }
};
const applyMetadataFilterToQueryBuilder = ({ whereBuilder, alias, filter, columnByFilterField, parameterCounter = {
    value: 0
} })=>{
    for (const [filterField, filterValue] of Object.entries(filter)){
        if (!(0, _utils.isDefined)(filterValue)) {
            continue;
        }
        if (filterField === 'and') {
            for (const subFilter of filterValue){
                whereBuilder.andWhere(new _typeorm.Brackets((subWhereBuilder)=>applyMetadataFilterToQueryBuilder({
                        whereBuilder: subWhereBuilder,
                        alias,
                        filter: subFilter,
                        columnByFilterField,
                        parameterCounter
                    })));
            }
            continue;
        }
        if (filterField === 'or') {
            whereBuilder.andWhere(new _typeorm.Brackets((orWhereBuilder)=>{
                for (const subFilter of filterValue){
                    orWhereBuilder.orWhere(new _typeorm.Brackets((subWhereBuilder)=>applyMetadataFilterToQueryBuilder({
                            whereBuilder: subWhereBuilder,
                            alias,
                            filter: subFilter,
                            columnByFilterField,
                            parameterCounter
                        })));
                }
            }));
            continue;
        }
        const filterColumn = columnByFilterField[filterField];
        if (!(0, _utils.isDefined)(filterColumn)) {
            throw new _graphqlerrorsutil.UserInputError(`Unknown filter field: ${filterField}`);
        }
        const { column } = filterColumn;
        const comparison = (0, _normalizemetadatafiltercomparisonutil.normalizeMetadataFilterComparison)({
            comparison: filterValue,
            column: filterColumn
        });
        applyComparisonToQueryBuilder({
            whereBuilder,
            column: `"${alias}"."${column}"`,
            comparison,
            parameterCounter
        });
    }
};

//# sourceMappingURL=apply-metadata-filter-to-query-builder.util.js.map