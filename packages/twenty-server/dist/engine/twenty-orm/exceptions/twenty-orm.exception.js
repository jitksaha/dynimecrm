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
    get TwentyOrmException () {
        return TwentyOrmException;
    },
    get TwentyOrmExceptionCode () {
        return TwentyOrmExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _standarderrormessageconstant = require("../../api/common/common-query-runners/errors/standard-error-message.constant");
const _postgreserrormessagesconstants = require("../../api/graphql/workspace-query-runner/constants/postgres-error-messages.constants");
const _customexception = require("../../../utils/custom-exception");
var TwentyOrmExceptionCode = /*#__PURE__*/ function(TwentyOrmExceptionCode) {
    TwentyOrmExceptionCode["WORKSPACE_SCHEMA_NOT_FOUND"] = "WORKSPACE_SCHEMA_NOT_FOUND";
    TwentyOrmExceptionCode["ROLES_PERMISSIONS_VERSION_NOT_FOUND"] = "ROLES_PERMISSIONS_VERSION_NOT_FOUND";
    TwentyOrmExceptionCode["FEATURE_FLAG_MAP_VERSION_NOT_FOUND"] = "FEATURE_FLAG_MAP_VERSION_NOT_FOUND";
    TwentyOrmExceptionCode["USER_WORKSPACE_ROLE_MAP_VERSION_NOT_FOUND"] = "USER_WORKSPACE_ROLE_MAP_VERSION_NOT_FOUND";
    TwentyOrmExceptionCode["API_KEY_ROLE_MAP_VERSION_NOT_FOUND"] = "API_KEY_ROLE_MAP_VERSION_NOT_FOUND";
    TwentyOrmExceptionCode["MALFORMED_METADATA"] = "MALFORMED_METADATA";
    TwentyOrmExceptionCode["WORKSPACE_NOT_FOUND"] = "WORKSPACE_NOT_FOUND";
    TwentyOrmExceptionCode["CONNECT_RECORD_NOT_FOUND"] = "CONNECT_RECORD_NOT_FOUND";
    TwentyOrmExceptionCode["CONNECT_NOT_ALLOWED"] = "CONNECT_NOT_ALLOWED";
    TwentyOrmExceptionCode["CONNECT_UNIQUE_CONSTRAINT_ERROR"] = "CONNECT_UNIQUE_CONSTRAINT_ERROR";
    TwentyOrmExceptionCode["MISSING_MAIN_ALIAS_TARGET"] = "MISSING_MAIN_ALIAS_TARGET";
    TwentyOrmExceptionCode["METHOD_NOT_ALLOWED"] = "METHOD_NOT_ALLOWED";
    TwentyOrmExceptionCode["ENUM_TYPE_NAME_NOT_FOUND"] = "ENUM_TYPE_NAME_NOT_FOUND";
    TwentyOrmExceptionCode["QUERY_READ_TIMEOUT"] = "QUERY_READ_TIMEOUT";
    TwentyOrmExceptionCode["TRANSIENT_DATABASE_ERROR"] = "TRANSIENT_DATABASE_ERROR";
    TwentyOrmExceptionCode["DUPLICATE_ENTRY_DETECTED"] = "DUPLICATE_ENTRY_DETECTED";
    TwentyOrmExceptionCode["TOO_MANY_RECORDS_TO_UPDATE"] = "TOO_MANY_RECORDS_TO_UPDATE";
    TwentyOrmExceptionCode["INVALID_INPUT"] = "INVALID_INPUT";
    TwentyOrmExceptionCode["ORM_EVENT_DATA_CORRUPTED"] = "ORM_EVENT_DATA_CORRUPTED";
    TwentyOrmExceptionCode["RLS_VALIDATION_FAILED"] = "RLS_VALIDATION_FAILED";
    TwentyOrmExceptionCode["NO_ROLE_FOUND_FOR_USER_WORKSPACE"] = "NO_ROLE_FOUND_FOR_USER_WORKSPACE";
    TwentyOrmExceptionCode["MISSING_PARAMETER"] = "MISSING_PARAMETER";
    TwentyOrmExceptionCode["INVALID_PARAMETER"] = "INVALID_PARAMETER";
    TwentyOrmExceptionCode["MALFORMED_SQL"] = "MALFORMED_SQL";
    TwentyOrmExceptionCode["UNKNOWN_OBJECT"] = "UNKNOWN_OBJECT";
    TwentyOrmExceptionCode["UNKNOWN_COLUMN"] = "UNKNOWN_COLUMN";
    TwentyOrmExceptionCode["UNKNOWN_RELATION"] = "UNKNOWN_RELATION";
    TwentyOrmExceptionCode["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
    TwentyOrmExceptionCode["MISSING_ALIAS"] = "MISSING_ALIAS";
    TwentyOrmExceptionCode["INVALID_QUERY"] = "INVALID_QUERY";
    TwentyOrmExceptionCode["ENTITY_NOT_FOUND"] = "ENTITY_NOT_FOUND";
    return TwentyOrmExceptionCode;
}({});
const getTwentyOrmExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "WORKSPACE_SCHEMA_NOT_FOUND":
            return /*i18n*/ {
                id: "7wxAZI",
                message: "Workspace schema not found."
            };
        case "ROLES_PERMISSIONS_VERSION_NOT_FOUND":
            return /*i18n*/ {
                id: "Ub8R48",
                message: "Roles and permissions configuration not found."
            };
        case "FEATURE_FLAG_MAP_VERSION_NOT_FOUND":
            return /*i18n*/ {
                id: "Ai7knL",
                message: "Feature configuration not found."
            };
        case "USER_WORKSPACE_ROLE_MAP_VERSION_NOT_FOUND":
            return /*i18n*/ {
                id: "9mCrQp",
                message: "User workspace role configuration not found."
            };
        case "API_KEY_ROLE_MAP_VERSION_NOT_FOUND":
            return /*i18n*/ {
                id: "TLSelA",
                message: "API key role configuration not found."
            };
        case "MALFORMED_METADATA":
            return /*i18n*/ {
                id: "Bv/LBb",
                message: "Data structure is invalid."
            };
        case "WORKSPACE_NOT_FOUND":
            return /*i18n*/ {
                id: "EhVOPs",
                message: "Workspace not found."
            };
        case "CONNECT_RECORD_NOT_FOUND":
            return /*i18n*/ {
                id: "2dNwZB",
                message: "Related record not found."
            };
        case "CONNECT_NOT_ALLOWED":
            return /*i18n*/ {
                id: "ADtO2E",
                message: "This connection is not allowed."
            };
        case "CONNECT_UNIQUE_CONSTRAINT_ERROR":
            return /*i18n*/ {
                id: "sieBE7",
                message: "A record with this relationship already exists."
            };
        case "MISSING_MAIN_ALIAS_TARGET":
            return /*i18n*/ {
                id: "u8IV9J",
                message: "Missing main alias target."
            };
        case "METHOD_NOT_ALLOWED":
            return /*i18n*/ {
                id: "7ZdJO2",
                message: "This operation is not allowed."
            };
        case "QUERY_READ_TIMEOUT":
            return /*i18n*/ {
                id: "6H9kMC",
                message: "Query timed out. Please try again."
            };
        case "TRANSIENT_DATABASE_ERROR":
            return _postgreserrormessagesconstants.TRANSIENT_DATABASE_ERROR_USER_FRIENDLY_MESSAGE;
        case "DUPLICATE_ENTRY_DETECTED":
            return /*i18n*/ {
                id: "Hjj8vT",
                message: "A duplicate entry was detected."
            };
        case "TOO_MANY_RECORDS_TO_UPDATE":
            return /*i18n*/ {
                id: "ExheIC",
                message: "Too many records to update at once."
            };
        case "INVALID_INPUT":
            return _postgreserrormessagesconstants.INVALID_INPUT_USER_FRIENDLY_MESSAGE;
        case "RLS_VALIDATION_FAILED":
            return /*i18n*/ {
                id: "EESfI5",
                message: "Record does not satisfy security constraints."
            };
        case "NO_ROLE_FOUND_FOR_USER_WORKSPACE":
            return /*i18n*/ {
                id: "ISCcTE",
                message: "No role found for user."
            };
        case "ENUM_TYPE_NAME_NOT_FOUND":
        case "ORM_EVENT_DATA_CORRUPTED":
        case "MISSING_PARAMETER":
        case "INVALID_PARAMETER":
        case "MALFORMED_SQL":
        case "UNKNOWN_OBJECT":
        case "UNKNOWN_COLUMN":
        case "UNKNOWN_RELATION":
        case "UNSUPPORTED_OPERATION":
        case "MISSING_ALIAS":
        case "INVALID_QUERY":
        case "ENTITY_NOT_FOUND":
            return _standarderrormessageconstant.STANDARD_ERROR_MESSAGE;
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let TwentyOrmException = class TwentyOrmException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getTwentyOrmExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=twenty-orm.exception.js.map