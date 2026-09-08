"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeGraphQLDirectExecutionQueryCost", {
    enumerable: true,
    get: function() {
        return computeGraphQLDirectExecutionQueryCost;
    }
});
const _graphql = require("graphql");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _resolvermethodnames = require("../../workspace-resolver-builder/constants/resolver-method-names");
const addWithMaximumSafeInteger = (left, right)=>Math.min(left + right, Number.MAX_SAFE_INTEGER);
const multiplyWithMaximumSafeInteger = (left, right)=>Math.min(left * right, Number.MAX_SAFE_INTEGER);
const countSelectedFields = (selections, fragmentMap, fragmentTraversalContext)=>{
    let fieldCount = 0;
    for (const selection of selections){
        if (selection.kind === _graphql.Kind.FIELD) {
            fieldCount = addWithMaximumSafeInteger(fieldCount, (0, _utils.isDefined)(selection.selectionSet) ? countSelectedFields(selection.selectionSet.selections, fragmentMap, fragmentTraversalContext) : 1);
            continue;
        }
        if (selection.kind === _graphql.Kind.INLINE_FRAGMENT) {
            fieldCount = addWithMaximumSafeInteger(fieldCount, countSelectedFields(selection.selectionSet.selections, fragmentMap, fragmentTraversalContext));
            continue;
        }
        const fragmentName = selection.name.value;
        const cachedFieldCount = fragmentTraversalContext.fieldCountByFragmentName.get(fragmentName);
        if ((0, _utils.isDefined)(cachedFieldCount)) {
            fieldCount = addWithMaximumSafeInteger(fieldCount, cachedFieldCount);
            continue;
        }
        if (fragmentTraversalContext.visitingFragmentNames.has(fragmentName)) {
            continue;
        }
        const fragment = fragmentMap.get(fragmentName);
        if (!(0, _utils.isDefined)(fragment)) {
            continue;
        }
        fragmentTraversalContext.visitingFragmentNames.add(fragmentName);
        const fragmentFieldCount = countSelectedFields(fragment.selectionSet.selections, fragmentMap, fragmentTraversalContext);
        fragmentTraversalContext.visitingFragmentNames.delete(fragmentName);
        fragmentTraversalContext.fieldCountByFragmentName.set(fragmentName, fragmentFieldCount);
        fieldCount = addWithMaximumSafeInteger(fieldCount, fragmentFieldCount);
    }
    return fieldCount;
};
const getRequestedRowCount = ({ method, args })=>{
    if (method !== _resolvermethodnames.RESOLVER_METHOD_NAMES.FIND_MANY) {
        return 1;
    }
    const requestedRowCount = args.first ?? args.last;
    return typeof requestedRowCount === 'number' ? Math.max(requestedRowCount, 0) : _constants.QUERY_MAX_RECORDS;
};
const computeGraphQLDirectExecutionQueryCost = ({ rootFields, fragmentMap })=>{
    const fragmentTraversalContext = {
        fieldCountByFragmentName: new Map(),
        visitingFragmentNames: new Set()
    };
    return rootFields.reduce((queryCost, { field, method, args })=>{
        const selectedLeafFieldCount = (0, _utils.isDefined)(field.selectionSet) ? countSelectedFields(field.selectionSet.selections, fragmentMap, fragmentTraversalContext) : 1;
        const requestedRowCount = getRequestedRowCount({
            method,
            args
        });
        return {
            estimatedResultFieldCount: addWithMaximumSafeInteger(queryCost.estimatedResultFieldCount, multiplyWithMaximumSafeInteger(selectedLeafFieldCount, requestedRowCount)),
            requestedRowCount: addWithMaximumSafeInteger(queryCost.requestedRowCount, requestedRowCount),
            selectedLeafFieldCount: addWithMaximumSafeInteger(queryCost.selectedLeafFieldCount, selectedLeafFieldCount)
        };
    }, {
        estimatedResultFieldCount: 0,
        requestedRowCount: 0,
        selectedLeafFieldCount: 0
    });
};

//# sourceMappingURL=compute-graphql-direct-execution-query-cost.util.js.map