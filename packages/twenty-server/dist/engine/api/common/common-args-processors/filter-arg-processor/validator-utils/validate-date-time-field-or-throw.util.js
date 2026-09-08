"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateDateTimeFieldOrThrow", {
    enumerable: true,
    get: function() {
        return validateDateTimeFieldOrThrow;
    }
});
const _util = require("util");
const _guards = require("@sniptt/guards");
const _datefns = require("date-fns");
const _utils = require("twenty-shared/utils");
const _commonqueryrunnerexception = require("../../../common-query-runners/errors/common-query-runner.exception");
const isValidDateTimeFormat = (value)=>{
    for (const format of _utils.ACCEPTED_DATE_TIME_FORMATS){
        const parsed = (0, _datefns.parse)(value, format, new Date());
        if ((0, _datefns.isValid)(parsed)) {
            return true;
        }
    }
    return false;
};
const validateDateTimeFieldOrThrow = (value, fieldName)=>{
    if ((0, _guards.isNull)(value)) return null;
    if ((0, _guards.isDate)(value) && (0, _datefns.isValid)(value)) {
        return value;
    }
    if ((0, _guards.isString)(value) && isValidDateTimeFormat(value)) {
        return value;
    }
    const inspectedValue = (0, _util.inspect)(value);
    throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Invalid value ${inspectedValue} for date-time field "${fieldName}". Expected format: 'YYYY-MM-DDTHH:mm:ssZ'`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_FILTER, {
        userFriendlyMessage: /*i18n*/ {
            id: "MnHbVB",
            message: "Invalid value for date-time: \"{inspectedValue}\". Expected format: 'YYYY-MM-DDTHH:mm:ssZ'",
            values: {
                inspectedValue: inspectedValue
            }
        }
    });
};

//# sourceMappingURL=validate-date-time-field-or-throw.util.js.map