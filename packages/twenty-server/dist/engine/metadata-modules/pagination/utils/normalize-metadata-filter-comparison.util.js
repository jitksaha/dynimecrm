"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeMetadataFilterComparison", {
    enumerable: true,
    get: function() {
        return normalizeMetadataFilterComparison;
    }
});
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const invertBooleanComparisonValue = (value)=>{
    if (typeof value === 'boolean') {
        return !value;
    }
    return value;
};
const lowercaseComparisonOperands = (comparison)=>{
    const lowercasedComparison = {
        ...comparison
    };
    for (const operand of [
        'eq',
        'neq',
        'gt',
        'gte',
        'lt',
        'lte',
        'like',
        'notLike',
        'iLike',
        'notILike'
    ]){
        const value = lowercasedComparison[operand];
        if ((0, _utils.isDefined)(value)) {
            lowercasedComparison[operand] = value.toLowerCase();
        }
    }
    for (const operand of [
        'in',
        'notIn'
    ]){
        const values = lowercasedComparison[operand];
        if ((0, _utils.isDefined)(values)) {
            lowercasedComparison[operand] = values.map((value)=>value.toLowerCase());
        }
    }
    return lowercasedComparison;
};
const normalizeMetadataFilterComparison = ({ comparison, column })=>{
    const normalizedComparison = {
        ...comparison
    };
    if (column.type === 'boolean' && column.invertBooleanValues) {
        normalizedComparison.is = invertBooleanComparisonValue(comparison.is);
        normalizedComparison.isNot = invertBooleanComparisonValue(comparison.isNot);
    }
    if (column.type === 'uuid') {
        if (normalizedComparison.is !== undefined && normalizedComparison.is !== null || normalizedComparison.isNot !== undefined && normalizedComparison.isNot !== null) {
            throw new _graphqlerrorsutil.UserInputError('UUID is/isNot comparisons only support null values');
        }
        // Postgres compares uuid columns canonically, but the in-memory matcher
        // compares raw strings, so operands are lowercased to keep both paths
        // agreeing on differently-cased but equal ids.
        return lowercaseComparisonOperands(normalizedComparison);
    }
    return normalizedComparison;
};

//# sourceMappingURL=normalize-metadata-filter-comparison.util.js.map