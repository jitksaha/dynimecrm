"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractColumnNamesFromAggregateExpression", {
    enumerable: true,
    get: function() {
        return extractColumnNamesFromAggregateExpression;
    }
});
const _utils = require("twenty-shared/utils");
const extractColumnNamesFromAggregateExpression = (selection)=>{
    // Match content between CONCAT(" and ") - handle multiple columns
    const concatMatches = selection.match(/CONCAT\("([^"]+)"(?:,"([^"]+)")*\)/g);
    if (concatMatches) {
        const columnNames = selection.match(/"([^"]+)"/g)?.map((match)=>{
            const fullColumn = match.slice(1, -1);
            const parts = fullColumn.split('.');
            return parts[parts.length - 1];
        });
        return columnNames || null;
    }
    // For non-CONCAT expressions, match table.column pattern within quotes
    // Look for patterns like "table"."column" and extract only the column part
    const tableColumnMatches = selection.match(/"[^"]+"\."([^"]+)"/g);
    if (tableColumnMatches) {
        const columnNames = tableColumnMatches.map((match)=>{
            const columnMatch = match.match(/"[^"]+"\."([^"]+)"/);
            return columnMatch ? columnMatch[1] : null;
        }).filter(Boolean);
        return columnNames.length > 0 ? columnNames.filter((c)=>(0, _utils.isDefined)(c)) : null;
    }
    // Fallback: match single quoted content that doesn't contain dots
    const singleColumnMatch = selection.match(/"([^".]+)"/);
    if (singleColumnMatch) {
        return [
            singleColumnMatch[1]
        ];
    }
    return null;
};

//# sourceMappingURL=extract-column-names-from-aggregate-expression.util.js.map