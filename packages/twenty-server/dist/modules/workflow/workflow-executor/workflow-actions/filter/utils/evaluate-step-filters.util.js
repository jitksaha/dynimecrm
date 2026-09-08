"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "evaluateStepFilters", {
    enumerable: true,
    get: function() {
        return evaluateStepFilters;
    }
});
const _resolvestepfiltersutil = require("../../../utils/resolve-step-filters.util");
const _evaluatefilterconditionsutil = require("./evaluate-filter-conditions.util");
const evaluateStepFilters = ({ stepFilters, stepFilterGroups, context })=>{
    const resolvedFilters = (0, _resolvestepfiltersutil.resolveStepFilters)({
        stepFilters,
        context
    });
    return (0, _evaluatefilterconditionsutil.evaluateFilterConditions)({
        filterGroups: stepFilterGroups,
        filters: resolvedFilters
    });
};

//# sourceMappingURL=evaluate-step-filters.util.js.map