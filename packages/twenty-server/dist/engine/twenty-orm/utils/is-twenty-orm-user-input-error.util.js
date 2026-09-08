"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isTwentyOrmUserInputError", {
    enumerable: true,
    get: function() {
        return isTwentyOrmUserInputError;
    }
});
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const isTwentyOrmUserInputError = (error)=>{
    switch(error.code){
        case _twentyormexception.TwentyOrmExceptionCode.INVALID_INPUT:
        case _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER:
        case _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_OBJECT:
        case _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_COLUMN:
        case _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION:
        case _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION:
        case _twentyormexception.TwentyOrmExceptionCode.TOO_MANY_RECORDS_TO_UPDATE:
        case _twentyormexception.TwentyOrmExceptionCode.ENTITY_NOT_FOUND:
        case _twentyormexception.TwentyOrmExceptionCode.DUPLICATE_ENTRY_DETECTED:
        case _twentyormexception.TwentyOrmExceptionCode.CONNECT_RECORD_NOT_FOUND:
        case _twentyormexception.TwentyOrmExceptionCode.CONNECT_NOT_ALLOWED:
        case _twentyormexception.TwentyOrmExceptionCode.CONNECT_UNIQUE_CONSTRAINT_ERROR:
        case _twentyormexception.TwentyOrmExceptionCode.RLS_VALIDATION_FAILED:
            return true;
        default:
            return false;
    }
};

//# sourceMappingURL=is-twenty-orm-user-input-error.util.js.map