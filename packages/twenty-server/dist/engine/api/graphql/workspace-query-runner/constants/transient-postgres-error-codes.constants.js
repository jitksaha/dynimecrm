"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TRANSIENT_POSTGRESQL_ERROR_CODES", {
    enumerable: true,
    get: function() {
        return TRANSIENT_POSTGRESQL_ERROR_CODES;
    }
});
const _postgreserrorcodesconstants = require("./postgres-error-codes.constants");
const TRANSIENT_POSTGRESQL_ERROR_CODES = [
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.CONNECTION_EXCEPTION,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.CONNECTION_DOES_NOT_EXIST,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.CONNECTION_FAILURE,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.SQLCLIENT_UNABLE_TO_ESTABLISH_SQLCONNECTION,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.SQLSERVER_REJECTED_ESTABLISHMENT_OF_SQLCONNECTION,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.TRANSACTION_RESOLUTION_UNKNOWN,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.IDLE_IN_TRANSACTION_SESSION_TIMEOUT,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.TRANSACTION_TIMEOUT,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.SERIALIZATION_FAILURE,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.DEADLOCK_DETECTED,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.TOO_MANY_CONNECTIONS,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.LOCK_NOT_AVAILABLE,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.ADMIN_SHUTDOWN,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.CRASH_SHUTDOWN,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.CANNOT_CONNECT_NOW,
    _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.IDLE_SESSION_TIMEOUT
];

//# sourceMappingURL=transient-postgres-error-codes.constants.js.map