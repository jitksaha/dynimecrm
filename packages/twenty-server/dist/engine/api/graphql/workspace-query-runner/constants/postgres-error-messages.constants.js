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
    get CONNECTION_TERMINATED_MESSAGE () {
        return CONNECTION_TERMINATED_MESSAGE;
    },
    get CONSTRAINT_VIOLATION_USER_FRIENDLY_MESSAGES () {
        return CONSTRAINT_VIOLATION_USER_FRIENDLY_MESSAGES;
    },
    get DUPLICATE_ENTRY_DETECTED_MESSAGE () {
        return DUPLICATE_ENTRY_DETECTED_MESSAGE;
    },
    get DUPLICATE_ENTRY_USER_FRIENDLY_MESSAGE () {
        return DUPLICATE_ENTRY_USER_FRIENDLY_MESSAGE;
    },
    get INVALID_INPUT_USER_FRIENDLY_MESSAGE () {
        return INVALID_INPUT_USER_FRIENDLY_MESSAGE;
    },
    get QUERY_READ_TIMEOUT_MESSAGE () {
        return QUERY_READ_TIMEOUT_MESSAGE;
    },
    get QUERY_READ_TIMEOUT_USER_FRIENDLY_MESSAGE () {
        return QUERY_READ_TIMEOUT_USER_FRIENDLY_MESSAGE;
    },
    get TRANSIENT_DATABASE_ERROR_USER_FRIENDLY_MESSAGE () {
        return TRANSIENT_DATABASE_ERROR_USER_FRIENDLY_MESSAGE;
    }
});
const _postgreserrorcodesconstants = require("./postgres-error-codes.constants");
const QUERY_READ_TIMEOUT_MESSAGE = 'Query read timeout';
const CONNECTION_TERMINATED_MESSAGE = 'Connection terminated';
const DUPLICATE_ENTRY_DETECTED_MESSAGE = 'A duplicate entry was detected';
const QUERY_READ_TIMEOUT_USER_FRIENDLY_MESSAGE = /*i18n*/ {
    id: "xvV2NJ",
    message: "We are experiencing a temporary issue with our database. Please try again later."
};
const TRANSIENT_DATABASE_ERROR_USER_FRIENDLY_MESSAGE = /*i18n*/ {
    id: "xvV2NJ",
    message: "We are experiencing a temporary issue with our database. Please try again later."
};
const DUPLICATE_ENTRY_USER_FRIENDLY_MESSAGE = /*i18n*/ {
    id: "TjUnO1",
    message: "This record already exists. Please check your data and try again."
};
const INVALID_INPUT_USER_FRIENDLY_MESSAGE = /*i18n*/ {
    id: "t7SpQO",
    message: "Invalid input provided."
};
const CONSTRAINT_VIOLATION_USER_FRIENDLY_MESSAGES = {
    [_postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.NOT_NULL_VIOLATION]: /*i18n*/ {
        id: "/ffPWJ",
        message: "A required field is missing. Please provide all required values and try again."
    },
    [_postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.FOREIGN_KEY_VIOLATION]: /*i18n*/ {
        id: "fxy039",
        message: "This operation references a record that does not exist or cannot be modified due to existing relationships."
    },
    [_postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.RESTRICT_VIOLATION]: /*i18n*/ {
        id: "BQ4MUY",
        message: "This record cannot be deleted because it is still referenced by other records."
    }
};

//# sourceMappingURL=postgres-error-messages.constants.js.map