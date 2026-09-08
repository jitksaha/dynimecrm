"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildOrderByClauses", {
    enumerable: true,
    get: function() {
        return buildOrderByClauses;
    }
});
const buildOrderByClauses = ({ orderByOrExpression, direction, nulls, normaliseColumnExpression })=>{
    if (typeof orderByOrExpression === 'string') {
        return [
            {
                expression: normaliseColumnExpression(orderByOrExpression),
                direction,
                nulls
            }
        ];
    }
    return Object.entries(orderByOrExpression).map(([expression, value])=>{
        const normalisedExpression = normaliseColumnExpression(expression);
        if (typeof value === 'string') {
            return {
                expression: normalisedExpression,
                direction: value
            };
        }
        return {
            expression: normalisedExpression,
            direction: value.order ?? 'ASC',
            nulls: value.nulls
        };
    });
};

//# sourceMappingURL=build-order-by-clauses.util.js.map