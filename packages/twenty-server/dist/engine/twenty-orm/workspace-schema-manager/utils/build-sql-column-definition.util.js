"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSqlColumnDefinition", {
    enumerable: true,
    get: function() {
        return buildSqlColumnDefinition;
    }
});
const _utils = require("twenty-shared/utils");
const _removesqlinjectionutil = require("../../../workspace-manager/workspace-migration/utils/remove-sql-injection.util");
const ALLOWED_GENERATED_TYPES = new Set([
    'STORED',
    'VIRTUAL'
]);
const buildSqlColumnDefinition = (column)=>{
    const parts = [
        (0, _removesqlinjectionutil.escapeIdentifier)(column.name)
    ];
    // column.type is either a PostgreSQL type name from fieldMetadataTypeToColumnType
    // (safe enum-mapped), or a schema-qualified enum type pre-escaped by the caller.
    parts.push(column.isArray ? `${column.type}[]` : column.type);
    // asExpression is normally built server-side by getTsVectorColumnExpressionFromFields, but it
    // can technically reach here from user input (metadata API or app-sync manifest). The TS_VECTOR
    // validator rejects corrupted expressions on every build path; this assert is the last-resort
    // guard at the DDL sink so nothing can break out of the GENERATED ALWAYS AS (...) clause.
    if (column.asExpression && column.type === 'tsvector') {
        (0, _removesqlinjectionutil.assertSafeTsVectorExpression)(column.asExpression);
        parts.push(`GENERATED ALWAYS AS (${column.asExpression})`);
        if (column.generatedType && ALLOWED_GENERATED_TYPES.has(column.generatedType)) {
            parts.push(column.generatedType);
        }
    }
    if (column.isPrimary) {
        parts.push('PRIMARY KEY');
    }
    if (column.isNullable === false) {
        parts.push('NOT NULL');
    }
    // column.default is pre-serialized by serializeDefaultValue which
    // applies escapeLiteral/removeSqlDDLInjection to the value.
    if ((0, _utils.isDefined)(column.default) && column.type !== 'tsvector') {
        parts.push(`DEFAULT ${column.default}`);
    }
    return parts.join(' ');
};

//# sourceMappingURL=build-sql-column-definition.util.js.map