"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "applyMutationCriteriaToQueryBuilder", {
    enumerable: true,
    get: function() {
        return applyMutationCriteriaToQueryBuilder;
    }
});
const _typeorm = require("typeorm");
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const isPlainObject = (value)=>typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype;
const applyMutationCriteriaToQueryBuilder = (queryBuilder, criteria)=>{
    if (typeof criteria === 'string') {
        if (criteria.length === 0) {
            throw new _twentyormexception.TwentyOrmException('A mutation criteria id cannot be an empty string', _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
        }
        queryBuilder.where({
            id: criteria
        });
        return queryBuilder;
    }
    if (Array.isArray(criteria)) {
        if (criteria.length === 0) {
            throw new _twentyormexception.TwentyOrmException('A mutation criteria array cannot be empty', _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
        }
        if (criteria.every((entry)=>typeof entry === 'string')) {
            queryBuilder.where({
                id: (0, _typeorm.In)(criteria)
            });
            return queryBuilder;
        }
        if (!criteria.every(isPlainObject)) {
            throw new _twentyormexception.TwentyOrmException('A mutation criteria array must be all ids or all where objects', _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
        }
        queryBuilder.where({
            whereFactory: (nestedQueryBuilder)=>{
                criteria.forEach((entry, index)=>{
                    if (index === 0) {
                        nestedQueryBuilder.where(entry);
                    } else {
                        nestedQueryBuilder.orWhere(entry);
                    }
                });
            }
        });
        return queryBuilder;
    }
    queryBuilder.where(criteria);
    return queryBuilder;
};

//# sourceMappingURL=apply-mutation-criteria.util.js.map