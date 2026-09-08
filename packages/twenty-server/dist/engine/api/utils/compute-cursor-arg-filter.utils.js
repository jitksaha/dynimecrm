"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeCursorArgFilter", {
    enumerable: true,
    get: function() {
        return computeCursorArgFilter;
    }
});
const _utils = require("twenty-shared/utils");
const _standarderrormessageconstant = require("../common/common-query-runners/errors/standard-error-message.constant");
const _graphqlqueryrunnerexception = require("../graphql/graphql-query-runner/errors/graphql-query-runner.exception");
const _buildcursorleafwhereconditionutils = require("./build-cursor-leaf-where-condition.utils");
const _resolveorderbyleavesutils = require("./resolve-order-by-leaves.utils");
const computeCursorArgFilter = ({ cursor, orderBy, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, isForwardPagination })=>{
    const leaves = (0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
        orderBy,
        flatObjectMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps,
        strictValidation: true
    }).filter(_resolveorderbyleavesutils.checkIfLeafCanCarryCursorValue);
    const leavesWithCursorValues = leaves.map((leaf)=>{
        const cursorValue = (0, _resolveorderbyleavesutils.getCursorValueForLeaf)(cursor, leaf);
        if (cursorValue === undefined) {
            throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Cursor is missing the value for orderBy field "${leaf.path.join('.')}": it was encoded for a different orderBy. Restart pagination without a cursor.`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.INVALID_CURSOR, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        return {
            leaf,
            cursorValue
        };
    });
    // Each equality condition is reused by every later branch: compute them once
    const equalityConditions = leavesWithCursorValues.map(({ leaf, cursorValue })=>(0, _buildcursorleafwhereconditionutils.buildCursorLeafWhereCondition)({
            leaf,
            cursorValue,
            isForwardPagination,
            isEqualityCondition: true
        }));
    return leavesWithCursorValues.flatMap(({ leaf, cursorValue }, index)=>{
        const mainCondition = (0, _buildcursorleafwhereconditionutils.buildCursorLeafWhereCondition)({
            leaf,
            cursorValue,
            isForwardPagination,
            isEqualityCondition: false
        });
        // A null main condition means no row can sort strictly after the cursor on
        // this leaf alone (e.g. inside a trailing NULL block): only the tie-breaking
        // leaves of the following branches can advance the scan
        if (!(0, _utils.isDefined)(mainCondition)) {
            return [];
        }
        const andConditions = [
            ...equalityConditions.slice(0, index),
            mainCondition
        ];
        if (andConditions.length === 1) {
            return [
                andConditions[0]
            ];
        }
        return [
            {
                and: andConditions
            }
        ];
    });
};

//# sourceMappingURL=compute-cursor-arg-filter.utils.js.map