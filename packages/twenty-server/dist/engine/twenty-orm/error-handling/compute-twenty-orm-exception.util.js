"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeTwentyOrmException", {
    enumerable: true,
    get: function() {
        return computeTwentyOrmException;
    }
});
const _utils = require("twenty-shared/utils");
const _postgreserrorcodesconstants = require("../../api/graphql/workspace-query-runner/constants/postgres-error-codes.constants");
const _transientpostgreserrorcodesconstants = require("../../api/graphql/workspace-query-runner/constants/transient-postgres-error-codes.constants");
const _postgreserrormessagesconstants = require("../../api/graphql/workspace-query-runner/constants/postgres-error-messages.constants");
const _postgresexception = require("../../api/graphql/workspace-query-runner/utils/postgres-exception");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const _customexception = require("../../../utils/custom-exception");
const KNOWN_POSTGRES_ERROR_CODES = Object.values(_postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES);
// The pg error carries the failing statement's detail; the sentry driver reads `cause`
const withCause = (exception, cause)=>Object.assign(exception, {
        cause
    });
const computeTwentyOrmException = (error)=>{
    if (!(error instanceof Error)) {
        return new Error(String(error));
    }
    if (error instanceof _customexception.CustomException) {
        return error;
    }
    if (error.message.includes(_postgreserrormessagesconstants.QUERY_READ_TIMEOUT_MESSAGE)) {
        return withCause(new _twentyormexception.TwentyOrmException(_postgreserrormessagesconstants.QUERY_READ_TIMEOUT_MESSAGE, _twentyormexception.TwentyOrmExceptionCode.QUERY_READ_TIMEOUT, {
            userFriendlyMessage: _postgreserrormessagesconstants.QUERY_READ_TIMEOUT_USER_FRIENDLY_MESSAGE
        }), error);
    }
    const errorCode = 'code' in error && typeof error.code === 'string' ? error.code : undefined;
    if (error.message.includes(_postgreserrormessagesconstants.CONNECTION_TERMINATED_MESSAGE) || (0, _utils.isDefined)(errorCode) && _transientpostgreserrorcodesconstants.TRANSIENT_POSTGRESQL_ERROR_CODES.includes(errorCode)) {
        return withCause(new _twentyormexception.TwentyOrmException(error.message, _twentyormexception.TwentyOrmExceptionCode.TRANSIENT_DATABASE_ERROR, {
            userFriendlyMessage: _postgreserrormessagesconstants.TRANSIENT_DATABASE_ERROR_USER_FRIENDLY_MESSAGE
        }), error);
    }
    if (!(0, _utils.isDefined)(errorCode)) {
        return error;
    }
    if (errorCode === _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.UNIQUE_VIOLATION) {
        return withCause(new _twentyormexception.TwentyOrmException(_postgreserrormessagesconstants.DUPLICATE_ENTRY_DETECTED_MESSAGE, _twentyormexception.TwentyOrmExceptionCode.DUPLICATE_ENTRY_DETECTED, {
            userFriendlyMessage: _postgreserrormessagesconstants.DUPLICATE_ENTRY_USER_FRIENDLY_MESSAGE
        }), error);
    }
    if (errorCode === _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.INVALID_TEXT_REPRESENTATION) {
        return withCause(new _twentyormexception.TwentyOrmException(error.message, _twentyormexception.TwentyOrmExceptionCode.INVALID_INPUT, {
            userFriendlyMessage: _postgreserrormessagesconstants.INVALID_INPUT_USER_FRIENDLY_MESSAGE
        }), error);
    }
    const constraintViolationMessage = _postgreserrormessagesconstants.CONSTRAINT_VIOLATION_USER_FRIENDLY_MESSAGES[errorCode];
    if ((0, _utils.isDefined)(constraintViolationMessage)) {
        return withCause(new _twentyormexception.TwentyOrmException(error.message, _twentyormexception.TwentyOrmExceptionCode.INVALID_INPUT, {
            userFriendlyMessage: constraintViolationMessage
        }), error);
    }
    if (KNOWN_POSTGRES_ERROR_CODES.includes(errorCode)) {
        return withCause(new _postgresexception.PostgresException('Data validation error.', errorCode), error);
    }
    return error;
};

//# sourceMappingURL=compute-twenty-orm-exception.util.js.map