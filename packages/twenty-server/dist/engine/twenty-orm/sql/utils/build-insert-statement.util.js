"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildInsertStatement", {
    enumerable: true,
    get: function() {
        return buildInsertStatement;
    }
});
const _removesqlinjectionutil = require("../../../workspace-manager/workspace-migration/utils/remove-sql-injection.util");
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const buildReturningClause = (returningColumns)=>{
    if (returningColumns.length === 0) {
        return '';
    }
    const expressions = returningColumns.map((columnName)=>(0, _removesqlinjectionutil.escapeIdentifier)(columnName));
    return `RETURNING ${expressions.join(', ')}`;
};
const buildInsertStatement = (state)=>{
    if (state.columnNames.length === 0 || state.rows.length === 0) {
        throw new _twentyormexception.TwentyOrmException(`An INSERT on "${state.tableShape.nameSingular}" needs at least one column and one row`, _twentyormexception.TwentyOrmExceptionCode.INVALID_QUERY);
    }
    const columnList = state.columnNames.map((columnName)=>(0, _removesqlinjectionutil.escapeIdentifier)(columnName)).join(', ');
    const valuesList = state.rows.map((row)=>`(${row.map((value)=>value.kind === 'default' ? 'DEFAULT' : `:${value.parameterName}`).join(', ')})`).join(', ');
    return [
        `INSERT INTO ${(0, _removesqlinjectionutil.escapeIdentifier)(state.tableShape.schemaName)}.${(0, _removesqlinjectionutil.escapeIdentifier)(state.tableShape.tableName)} (${columnList})`,
        `VALUES ${valuesList}`,
        state.onConflictDoNothing ? 'ON CONFLICT DO NOTHING' : '',
        buildReturningClause(state.returningColumns)
    ].filter((part)=>part.length > 0).join(' ');
};

//# sourceMappingURL=build-insert-statement.util.js.map