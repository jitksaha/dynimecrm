"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GraphqlQueryFilterConditionParser", {
    enumerable: true,
    get: function() {
        return GraphqlQueryFilterConditionParser;
    }
});
const _typeorm = require("typeorm");
const _applyfilterentriestowhereexpressionutil = require("../utils/apply-filter-entries-to-where-expression.util");
const _graphqlqueryfilterfieldparser = require("./graphql-query-filter-field.parser");
let GraphqlQueryFilterConditionParser = class GraphqlQueryFilterConditionParser {
    parse(queryBuilder, objectNameSingular, filter) {
        if (!filter || Object.keys(filter).length === 0) {
            return queryBuilder;
        }
        queryBuilder.where(new _typeorm.Brackets((qb)=>{
            this.applyFilterEntriesToWhereBrackets(qb, queryBuilder, objectNameSingular, filter);
        }));
        return queryBuilder;
    }
    applyFilterEntriesToWhereBrackets(innerQueryBuilder, outerQueryBuilder, objectNameSingular, filter) {
        (0, _applyfilterentriestowhereexpressionutil.applyFilterEntriesToWhereExpression)({
            whereExpression: innerQueryBuilder,
            outerQueryBuilder,
            objectNameSingular,
            filter,
            fieldParser: this.queryFilterFieldParser
        });
    }
    constructor(flatObjectMetadata, flatFieldMetadataMaps, flatObjectMetadataMaps, depth = 0){
        this.queryFilterFieldParser = new _graphqlqueryfilterfieldparser.GraphqlQueryFilterFieldParser(flatObjectMetadata, flatFieldMetadataMaps, flatObjectMetadataMaps, depth);
    }
};

//# sourceMappingURL=graphql-query-filter-condition.parser.js.map