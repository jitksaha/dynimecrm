// Strips all characters except [a-zA-Z0-9_].
// Use ONLY for generating safe identifier names (e.g. enum names from table+column).
// For SQL escaping, use escapeIdentifier or escapeLiteral instead.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get assertSafeTsVectorExpression () {
        return assertSafeTsVectorExpression;
    },
    get escapeIdentifier () {
        return escapeIdentifier;
    },
    get escapeLiteral () {
        return escapeLiteral;
    },
    get isSafeTsVectorExpression () {
        return isSafeTsVectorExpression;
    },
    get removeSqlDDLInjection () {
        return removeSqlDDLInjection;
    }
});
const removeSqlDDLInjection = (value)=>{
    return value.replace(/[^a-zA-Z0-9_]/g, '');
};
const escapeIdentifier = (identifier)=>{
    if (identifier.includes('\0')) {
        throw new Error('Null bytes are not allowed in PostgreSQL identifiers');
    }
    return '"' + identifier.replace(/"/g, '""') + '"';
};
const FORBIDDEN_TS_VECTOR_EXPRESSION_TOKENS = [
    '\0',
    ';',
    '--',
    '/*',
    '*/',
    '$'
];
const hasBalancedParentheses = (expression)=>{
    let depth = 0;
    let context = 'code';
    for(let index = 0; index < expression.length; index++){
        const character = expression[index];
        if (context === 'string') {
            if (character === "'") {
                if (expression[index + 1] === "'") {
                    index++;
                } else {
                    context = 'code';
                }
            }
            continue;
        }
        if (context === 'identifier') {
            if (character === '"') {
                if (expression[index + 1] === '"') {
                    index++;
                } else {
                    context = 'code';
                }
            }
            continue;
        }
        if (character === "'") {
            context = 'string';
        } else if (character === '"') {
            context = 'identifier';
        } else if (character === '(') {
            depth++;
        } else if (character === ')') {
            depth--;
            if (depth < 0) {
                return false;
            }
        }
    }
    return depth === 0 && context === 'code';
};
const isSafeTsVectorExpression = (expression)=>{
    const hasForbiddenToken = FORBIDDEN_TS_VECTOR_EXPRESSION_TOKENS.some((token)=>expression.includes(token));
    if (hasForbiddenToken) {
        return false;
    }
    return hasBalancedParentheses(expression);
};
const assertSafeTsVectorExpression = (expression)=>{
    if (!isSafeTsVectorExpression(expression)) {
        throw new Error('Unsafe tsvector expression detected');
    }
};
const escapeLiteral = (value)=>{
    if (value.includes('\0')) {
        throw new Error('Null bytes are not allowed in PostgreSQL string literals');
    }
    let hasBackslash = false;
    let escaped = "'";
    for (const char of value){
        if (char === "'") {
            escaped += "''";
        } else if (char === '\\') {
            escaped += '\\\\';
            hasBackslash = true;
        } else {
            escaped += char;
        }
    }
    escaped += "'";
    if (hasBackslash) {
        escaped = 'E' + escaped;
    }
    return escaped;
};

//# sourceMappingURL=remove-sql-injection.util.js.map