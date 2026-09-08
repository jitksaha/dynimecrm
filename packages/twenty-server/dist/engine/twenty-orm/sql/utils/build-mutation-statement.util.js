"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMutationStatement", {
    enumerable: true,
    get: function() {
        return buildMutationStatement;
    }
});
const _removesqlinjectionutil = require("../../../workspace-manager/workspace-migration/utils/remove-sql-injection.util");
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const _buildcolumnresultaliasutil = require("./build-column-result-alias.util");
const _buildselectstatementutil = require("./build-select-statement.util");
const buildReturningClause = (state)=>{
    if (state.returningColumns.length === 0) {
        return '';
    }
    const expressions = state.returningColumns.map((columnName)=>`${(0, _buildselectstatementutil.quoteColumn)(state.alias, columnName)} AS ${(0, _removesqlinjectionutil.escapeIdentifier)((0, _buildcolumnresultaliasutil.buildColumnResultAlias)(state.alias, columnName))}`);
    return `RETURNING ${expressions.join(', ')}`;
};
const buildTableReference = (state)=>`${(0, _removesqlinjectionutil.escapeIdentifier)(state.tableShape.schemaName)}.${(0, _removesqlinjectionutil.escapeIdentifier)(state.tableShape.tableName)} AS ${(0, _removesqlinjectionutil.escapeIdentifier)(state.alias)}`;
const buildSetClause = (state)=>`SET ${state.setClauses.map((setClause)=>`${(0, _removesqlinjectionutil.escapeIdentifier)(setClause.columnName)} = ${setClause.valueExpression}`).join(', ')}`;
const buildMutationStatement = (state)=>{
    const whereExpression = (0, _buildselectstatementutil.renderUserWhereExpression)(state.whereClauses);
    const returningClause = buildReturningClause(state);
    if (state.kind === 'delete') {
        return [
            `DELETE FROM ${buildTableReference(state)}`,
            whereExpression.length > 0 ? `WHERE ${whereExpression}` : '',
            returningClause
        ].filter((part)=>part.length > 0).join(' ');
    }
    if (state.setClauses.length === 0) {
        throw new _twentyormexception.TwentyOrmException(`An UPDATE on "${state.tableShape.nameSingular}" needs at least one column to set`, _twentyormexception.TwentyOrmExceptionCode.INVALID_QUERY);
    }
    return [
        `UPDATE ${buildTableReference(state)}`,
        buildSetClause(state),
        whereExpression.length > 0 ? `WHERE ${whereExpression}` : '',
        returningClause
    ].filter((part)=>part.length > 0).join(' ');
};

//# sourceMappingURL=build-mutation-statement.util.js.map