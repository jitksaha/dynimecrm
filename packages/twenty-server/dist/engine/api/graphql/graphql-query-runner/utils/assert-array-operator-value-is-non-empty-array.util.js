"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "assertArrayOperatorValueIsNonEmptyArray", {
    enumerable: true,
    get: function() {
        return assertArrayOperatorValueIsNonEmptyArray;
    }
});
const _graphqlqueryrunnerexception = require("../errors/graphql-query-runner.exception");
const ARRAY_OPERATORS = [
    'in',
    'contains',
    'notContains'
];
const assertArrayOperatorValueIsNonEmptyArray = ({ operator, value, key })=>{
    if (ARRAY_OPERATORS.includes(operator) && (!Array.isArray(value) || value.length === 0)) {
        throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Invalid filter value for field ${key}. Expected non-empty array`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.INVALID_QUERY_INPUT, {
            userFriendlyMessage: /*i18n*/ {
                id: "8KxLoh",
                message: "Invalid filter value"
            }
        });
    }
};

//# sourceMappingURL=assert-array-operator-value-is-non-empty-array.util.js.map