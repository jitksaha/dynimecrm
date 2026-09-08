"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "collectReferencedColumnNames", {
    enumerable: true,
    get: function() {
        return collectReferencedColumnNames;
    }
});
const _extractcolumnnamesfromaggregateexpressionutil = require("../../../../utils/extract-column-names-from-aggregate-expression.util");
const QUALIFIED_COLUMN_REFERENCE = /"(\w+)"\."(\w+)"/g;
const collectReferencedColumnNames = ({ mainAlias, mainAliasColumnNames, extraSelectClauses, orderByClauses, distinctOnExpressions = [] })=>{
    const columnNamesByAlias = {
        [mainAlias]: new Set(mainAliasColumnNames)
    };
    const addColumnName = (alias, columnName)=>{
        columnNamesByAlias[alias] = (columnNamesByAlias[alias] ?? new Set()).add(columnName);
    };
    const expressions = [
        ...extraSelectClauses.map((extraSelect)=>extraSelect.expression),
        ...orderByClauses.map((orderByClause)=>orderByClause.expression),
        ...distinctOnExpressions
    ];
    for (const expression of expressions){
        const qualifiedReferences = [
            ...expression.matchAll(QUALIFIED_COLUMN_REFERENCE)
        ];
        if (qualifiedReferences.length > 0) {
            for (const [, alias, columnName] of qualifiedReferences){
                addColumnName(alias, columnName);
            }
            continue;
        }
        for (const columnName of (0, _extractcolumnnamesfromaggregateexpressionutil.extractColumnNamesFromAggregateExpression)(expression) ?? []){
            addColumnName(mainAlias, columnName);
        }
    }
    return Object.fromEntries(Object.entries(columnNamesByAlias).map(([alias, columnNames])=>[
            alias,
            [
                ...columnNames
            ]
        ]));
};

//# sourceMappingURL=collect-referenced-column-names.util.js.map