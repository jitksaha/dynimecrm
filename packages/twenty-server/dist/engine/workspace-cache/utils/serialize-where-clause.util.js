"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "serializeWhereClause", {
    enumerable: true,
    get: function() {
        return serializeWhereClause;
    }
});
const _typeorm = require("typeorm");
const _workspacecacheexception = require("../exceptions/workspace-cache.exception");
const serializeWhereValue = (value)=>{
    if (value instanceof _typeorm.FindOperator) {
        if (value.type === 'raw') {
            throw new _workspacecacheexception.WorkspaceCacheException('Cannot serialize a raw operator inside a rows requirement where clause: Raw() and computed predicates are not supported', _workspacecacheexception.WorkspaceCacheExceptionCode.INVALID_PARAMETERS);
        }
        return `op(${value.type}:${serializeWhereValue(value.child ?? value.value)})`;
    }
    if (value instanceof Date) {
        return `date(${value.toISOString()})`;
    }
    if (Array.isArray(value)) {
        return `[${value.map(serializeWhereValue).join(',')}]`;
    }
    if (typeof value === 'function') {
        throw new _workspacecacheexception.WorkspaceCacheException('Cannot serialize a function inside a rows requirement where clause: Raw() and computed predicates are not supported', _workspacecacheexception.WorkspaceCacheExceptionCode.INVALID_PARAMETERS);
    }
    if (value !== null && typeof value === 'object') {
        const record = value;
        return `{${Object.keys(record).sort().map((key)=>`${key}:${serializeWhereValue(record[key])}`).join(',')}}`;
    }
    return value === undefined ? 'undefined' : JSON.stringify(value);
};
const serializeWhereClause = (where)=>serializeWhereValue(where);

//# sourceMappingURL=serialize-where-clause.util.js.map