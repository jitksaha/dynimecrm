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
    get applyFindOptionsToQueryBuilder () {
        return applyFindOptionsToQueryBuilder;
    },
    get normalizeFindOptionsRelations () {
        return normalizeFindOptionsRelations;
    },
    get splitFindOptionsOrder () {
        return splitFindOptionsOrder;
    }
});
const _utils = require("twenty-shared/utils");
const normalizeFindOptionsRelations = (relations)=>{
    if (!Array.isArray(relations)) {
        return relations;
    }
    const normalized = {};
    for (const relationPath of relations){
        let currentLevel = normalized;
        for (const fieldName of relationPath.split('.')){
            const existing = currentLevel[fieldName];
            const nested = typeof existing === 'object' ? existing : {};
            currentLevel[fieldName] = nested;
            currentLevel = nested;
        }
    }
    return normalized;
};
const normalizeSelect = (select)=>Array.isArray(select) ? Object.fromEntries(select.map((columnName)=>[
            columnName,
            true
        ])) : select;
const applyWhere = (queryBuilder, where)=>{
    if (!Array.isArray(where)) {
        queryBuilder.where(where);
        return;
    }
    if (where.length === 1) {
        queryBuilder.where(where[0]);
        return;
    }
    queryBuilder.where({
        whereFactory: (nestedQueryBuilder)=>{
            where.forEach((clause, index)=>{
                if (index === 0) {
                    nestedQueryBuilder.where(clause);
                } else {
                    nestedQueryBuilder.orWhere(clause);
                }
            });
        }
    });
};
const isRelationOrderValue = (value)=>(0, _utils.isDefined)(value) && typeof value === 'object' && !('order' in value) && !('nulls' in value);
const isRelationOrderEntry = (tableShape, key, value)=>(0, _utils.isDefined)(tableShape.relationShapeByFieldName[key]) && isRelationOrderValue(value);
const splitFindOptionsOrder = (tableShape, order)=>{
    const columnOrder = {};
    const orderByRelationFieldName = {};
    for (const [key, value] of Object.entries(order ?? {})){
        if (isRelationOrderEntry(tableShape, key, value)) {
            orderByRelationFieldName[key] = value;
            continue;
        }
        columnOrder[key] = value;
    }
    return {
        columnOrder,
        orderByRelationFieldName
    };
};
const toDedupOrder = (order)=>Object.entries(order).map(([columnName, value])=>({
            columnName,
            direction: typeof value === 'string' ? value : value.order ?? 'ASC',
            nulls: typeof value === 'string' ? undefined : value.nulls
        }));
const applyRelationOrderEntry = (queryBuilder, relationFieldName, relationOrder)=>{
    queryBuilder.leftJoin(`${queryBuilder.alias}.${relationFieldName}`, relationFieldName, undefined, {
        allowToManyJoin: true,
        toManyDedupOrder: toDedupOrder(relationOrder)
    });
    for (const [columnName, value] of Object.entries(relationOrder)){
        if (typeof value === 'string') {
            queryBuilder.addOrderBy(`${relationFieldName}.${columnName}`, value);
            continue;
        }
        queryBuilder.addOrderBy(`${relationFieldName}.${columnName}`, value.order ?? 'ASC', value.nulls);
    }
};
const applyOrder = (queryBuilder, order)=>{
    for (const [key, value] of Object.entries(order)){
        if (isRelationOrderEntry(queryBuilder.tableShape, key, value)) {
            applyRelationOrderEntry(queryBuilder, key, value);
            continue;
        }
        queryBuilder.addOrderBy(...toOrderByArguments(key, value));
    }
};
const toOrderByArguments = (key, value)=>typeof value === 'string' ? [
        key,
        value,
        undefined
    ] : [
        key,
        value.order ?? 'ASC',
        value.nulls
    ];
const applyFindOptionsToQueryBuilder = (queryBuilder, options)=>{
    if (!(0, _utils.isDefined)(options)) {
        return queryBuilder;
    }
    if (options.withDeleted) {
        queryBuilder.withDeleted();
    }
    if ((0, _utils.isDefined)(options.select)) {
        queryBuilder.setFindOptions({
            select: normalizeSelect(options.select)
        });
    }
    if ((0, _utils.isDefined)(options.where)) {
        applyWhere(queryBuilder, options.where);
    }
    if ((0, _utils.isDefined)(options.order)) {
        applyOrder(queryBuilder, options.order);
    }
    if ((0, _utils.isDefined)(options.take)) {
        queryBuilder.limit(options.take);
    }
    if ((0, _utils.isDefined)(options.skip)) {
        queryBuilder.offset(options.skip);
    }
    return queryBuilder;
};

//# sourceMappingURL=apply-find-options.util.js.map