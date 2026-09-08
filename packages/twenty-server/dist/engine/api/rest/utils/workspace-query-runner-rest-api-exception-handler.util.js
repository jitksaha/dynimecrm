"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "workspaceQueryRunnerRestApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return workspaceQueryRunnerRestApiExceptionHandler;
    }
});
const _common = require("@nestjs/common");
const _commonqueryrunnerexception = require("../../common/common-query-runners/errors/common-query-runner.exception");
const _commonqueryrunnertorestapiexceptionhandlerutil = require("../../common/common-query-runners/utils/common-query-runner-to-rest-api-exception-handler.util");
const _restinputrequestparserexception = require("../input-request-parsers/rest-input-request-parser.exception");
const _throttlerexception = require("../../../core-modules/throttler/throttler.exception");
const _throttlertorestapiexceptionhandlerutil = require("../../../core-modules/throttler/utils/throttler-to-rest-api-exception-handler.util");
const _usagelimitexception = require("../../../core-modules/usage-limit/exceptions/usage-limit.exception");
const _usagelimittorestapiexceptionhandlerutil = require("../../../core-modules/usage-limit/utils/usage-limit-to-rest-api-exception-handler.util");
const _twentyormexception = require("../../../twenty-orm/exceptions/twenty-orm.exception");
const _istwentyormuserinputerrorutil = require("../../../twenty-orm/utils/is-twenty-orm-user-input-error.util");
const workspaceQueryRunnerRestApiExceptionHandler = (error)=>{
    switch(true){
        case error instanceof _commonqueryrunnerexception.CommonQueryRunnerException:
            return (0, _commonqueryrunnertorestapiexceptionhandlerutil.commonQueryRunnerToRestApiExceptionHandler)(error);
        case error instanceof _restinputrequestparserexception.RestInputRequestParserException:
            throw new _common.BadRequestException(error.message);
        case error instanceof _usagelimitexception.UsageLimitException:
            return (0, _usagelimittorestapiexceptionhandlerutil.usageLimitToRestApiExceptionHandler)(error);
        case error instanceof _throttlerexception.ThrottlerException:
            return (0, _throttlertorestapiexceptionhandlerutil.throttlerToRestApiExceptionHandler)(error);
        case error instanceof _twentyormexception.TwentyOrmException && (0, _istwentyormuserinputerrorutil.isTwentyOrmUserInputError)(error):
            throw new _common.BadRequestException(error.message);
        default:
            throw error;
    }
};

//# sourceMappingURL=workspace-query-runner-rest-api-exception-handler.util.js.map