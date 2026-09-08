"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GraphqlQueryOrderFieldParser", {
    enumerable: true,
    get: function() {
        return GraphqlQueryOrderFieldParser;
    }
});
const _utils = require("twenty-shared/utils");
const _buildorderbycolumnexpressionutil = require("./utils/build-order-by-column-expression.util");
const _convertorderbytofindoptionsorder = require("./utils/convert-order-by-to-find-options-order");
const _computeorderbyleafcolumnutil = require("../../../../utils/compute-order-by-leaf-column.util");
const _resolveorderbyleavesutils = require("../../../../utils/resolve-order-by-leaves.utils");
let GraphqlQueryOrderFieldParser = class GraphqlQueryOrderFieldParser {
    parse(orderBy, objectNameSingular, isForwardPagination = true, objectsPermissions) {
        const orderByConditions = {};
        const relationJoins = [];
        const addedJoinAliases = new Set();
        const orderByLeaves = (0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
            orderBy,
            flatObjectMetadata: this.flatObjectMetadata,
            flatObjectMetadataMaps: this.flatObjectMetadataMaps,
            flatFieldMetadataMaps: this.flatFieldMetadataMaps,
            strictValidation: true,
            objectsPermissions
        });
        for (const orderByLeaf of orderByLeaves){
            const leafColumn = (0, _computeorderbyleafcolumnutil.computeOrderByLeafColumn)(orderByLeaf, objectNameSingular);
            if (!(0, _utils.isDefined)(leafColumn)) {
                continue;
            }
            if (orderByLeaf.kind === 'relation' && !addedJoinAliases.has(leafColumn.tableAlias)) {
                relationJoins.push({
                    joinAlias: leafColumn.tableAlias
                });
                addedJoinAliases.add(leafColumn.tableAlias);
            }
            orderByConditions[(0, _buildorderbycolumnexpressionutil.buildOrderByColumnExpression)(leafColumn.tableAlias, leafColumn.columnName)] = {
                ...(0, _convertorderbytofindoptionsorder.convertOrderByToFindOptionsOrder)(orderByLeaf.direction, isForwardPagination),
                useLower: (0, _buildorderbycolumnexpressionutil.shouldUseCaseInsensitiveOrder)(leafColumn.columnType),
                castToText: (0, _buildorderbycolumnexpressionutil.shouldCastToText)(leafColumn.columnType)
            };
        }
        return {
            orderBy: orderByConditions,
            relationJoins
        };
    }
    constructor(flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps){
        this.flatObjectMetadata = flatObjectMetadata;
        this.flatObjectMetadataMaps = flatObjectMetadataMaps;
        this.flatFieldMetadataMaps = flatFieldMetadataMaps;
    }
};

//# sourceMappingURL=graphql-query-order.parser.js.map