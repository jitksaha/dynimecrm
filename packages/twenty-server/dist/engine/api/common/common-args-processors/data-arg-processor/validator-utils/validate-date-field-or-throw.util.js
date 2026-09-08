"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateDateFieldOrThrow", {
    enumerable: true,
    get: function() {
        return validateDateFieldOrThrow;
    }
});
const _util = require("util");
const _guards = require("@sniptt/guards");
const _datefns = require("date-fns");
const _utils = require("twenty-shared/utils");
const _commonqueryrunnerexception = require("../../../common-query-runners/errors/common-query-runner.exception");
const isValidDateFormat = (value)=>{
    for (const format of _utils.ACCEPTED_DATE_FORMATS){
        const parsed = (0, _datefns.parse)(value, format, new Date());
        if ((0, _datefns.isValid)(parsed)) {
            return true;
        }
    }
    return false;
};
const validateDateFieldOrThrow = (value, fieldName)=>{
    if ((0, _guards.isNull)(value)) return null;
    if ((0, _guards.isDate)(value) && (0, _datefns.isValid)(value)) {
        return value;
    }
    if ((0, _guards.isString)(value) && isValidDateFormat(value)) {
        return value;
    }
    const inspectedValue = (0, _util.inspect)(value);
    throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Invalid value ${inspectedValue} for date field "${fieldName}". Expected format: 'YYYY-MM-DD'`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_DATA, {
        userFriendlyMessage: /*i18n*/ {
            id: "U4Wdjc",
            message: "Invalid value for date: \"{inspectedValue}\". Expected format: 'YYYY-MM-DD'",
            values: {
                inspectedValue: inspectedValue
            }
        }
    });
};

//# sourceMappingURL=validate-date-field-or-throw.util.js.map