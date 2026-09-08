"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "applyMetadataFilterToItems", {
    enumerable: true,
    get: function() {
        return applyMetadataFilterToItems;
    }
});
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const _normalizemetadatafiltercomparisonutil = require("./normalize-metadata-filter-comparison.util");
const matchesSqlLikePattern = (value, pattern)=>{
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regularExpressionPattern = escapedPattern.replace(/%/g, '.*').replace(/_/g, '.');
    return new RegExp(`^${regularExpressionPattern}$`).test(value);
};
const matchesMetadataComparison = ({ value, comparison, column })=>{
    const normalizedComparison = (0, _normalizemetadatafiltercomparisonutil.normalizeMetadataFilterComparison)({
        comparison,
        column
    });
    const normalizedValue = column.type === 'uuid' && typeof value === 'string' ? value.toLowerCase() : value;
    const stringValue = typeof normalizedValue === 'string' ? normalizedValue : undefined;
    const simpleComparisons = [
        [
            'eq',
            (comparisonValue)=>normalizedValue === comparisonValue
        ],
        [
            'neq',
            (comparisonValue)=>normalizedValue !== comparisonValue
        ],
        [
            'gt',
            (comparisonValue)=>(0, _utils.isDefined)(stringValue) && typeof comparisonValue === 'string' && stringValue > comparisonValue
        ],
        [
            'gte',
            (comparisonValue)=>(0, _utils.isDefined)(stringValue) && typeof comparisonValue === 'string' && stringValue >= comparisonValue
        ],
        [
            'lt',
            (comparisonValue)=>(0, _utils.isDefined)(stringValue) && typeof comparisonValue === 'string' && stringValue < comparisonValue
        ],
        [
            'lte',
            (comparisonValue)=>(0, _utils.isDefined)(stringValue) && typeof comparisonValue === 'string' && stringValue <= comparisonValue
        ]
    ];
    for (const [comparisonKey, matches] of simpleComparisons){
        const comparisonValue = normalizedComparison[comparisonKey];
        if ((0, _utils.isDefined)(comparisonValue) && !matches(comparisonValue)) {
            return false;
        }
    }
    const likeComparisons = [
        [
            'like',
            false,
            false
        ],
        [
            'notLike',
            false,
            true
        ],
        [
            'iLike',
            true,
            false
        ],
        [
            'notILike',
            true,
            true
        ]
    ];
    for (const [comparisonKey, caseInsensitive, negate] of likeComparisons){
        const comparisonValue = normalizedComparison[comparisonKey];
        if (!(0, _utils.isDefined)(comparisonValue)) {
            continue;
        }
        if (!(0, _utils.isDefined)(stringValue) || typeof comparisonValue !== 'string') {
            return false;
        }
        const candidate = caseInsensitive ? stringValue.toLowerCase() : stringValue;
        const pattern = caseInsensitive ? comparisonValue.toLowerCase() : comparisonValue;
        const matches = matchesSqlLikePattern(candidate, pattern);
        if (negate ? matches : !matches) {
            return false;
        }
    }
    if ((0, _utils.isDefined)(normalizedComparison.in) && !normalizedComparison.in.includes(normalizedValue)) {
        return false;
    }
    if ((0, _utils.isDefined)(normalizedComparison.notIn) && normalizedComparison.notIn.includes(normalizedValue)) {
        return false;
    }
    if (normalizedComparison.is !== undefined && (normalizedComparison.is === null ? normalizedValue !== null && normalizedValue !== undefined : normalizedValue !== normalizedComparison.is)) {
        return false;
    }
    if (normalizedComparison.isNot !== undefined && (normalizedComparison.isNot === null ? normalizedValue === null || normalizedValue === undefined : normalizedValue === normalizedComparison.isNot)) {
        return false;
    }
    return true;
};
const applyMetadataFilterToItems = ({ items, filter, columnByFilterField })=>items.filter((item)=>{
        for (const [filterField, filterValue] of Object.entries(filter)){
            if (!(0, _utils.isDefined)(filterValue)) {
                continue;
            }
            if (filterField === 'and') {
                if (!filterValue.every((subFilter)=>applyMetadataFilterToItems({
                        items: [
                            item
                        ],
                        filter: subFilter,
                        columnByFilterField
                    }).length === 1)) {
                    return false;
                }
                continue;
            }
            if (filterField === 'or') {
                const subFilters = filterValue;
                if (subFilters.length > 0 && !subFilters.some((subFilter)=>applyMetadataFilterToItems({
                        items: [
                            item
                        ],
                        filter: subFilter,
                        columnByFilterField
                    }).length === 1)) {
                    return false;
                }
                continue;
            }
            const column = columnByFilterField[filterField];
            if (!(0, _utils.isDefined)(column)) {
                throw new _graphqlerrorsutil.UserInputError(`Unknown filter field: ${filterField}`);
            }
            const value = Reflect.get(item, column.column);
            if (!matchesMetadataComparison({
                value,
                comparison: filterValue,
                column
            })) {
                return false;
            }
        }
        return true;
    });

//# sourceMappingURL=apply-metadata-filter-to-items.util.js.map