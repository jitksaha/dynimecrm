"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "convertOrderByToFindOptionsOrder", {
    enumerable: true,
    get: function() {
        return convertOrderByToFindOptionsOrder;
    }
});
const _standarderrormessageconstant = require("../../../../../common/common-query-runners/errors/standard-error-message.constant");
const _graphqlqueryrunnerexception = require("../../../errors/graphql-query-runner.exception");
const _isorderbydirectionutil = require("./is-order-by-direction.util");
const _geteffectivescanorderutils = require("../../../../../utils/get-effective-scan-order.utils");
const convertOrderByToFindOptionsOrder = (direction, isForwardPagination = true)=>{
    if (!(0, _isorderbydirectionutil.isOrderByDirection)(direction)) {
        throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Invalid direction: ${direction}`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.INVALID_DIRECTION, {
            userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
        });
    }
    const { isAscending, areNullsScannedLast } = (0, _geteffectivescanorderutils.getEffectiveScanOrder)(direction, isForwardPagination);
    return {
        order: isAscending ? 'ASC' : 'DESC',
        nulls: areNullsScannedLast ? 'NULLS LAST' : 'NULLS FIRST'
    };
};

//# sourceMappingURL=convert-order-by-to-find-options-order.js.map