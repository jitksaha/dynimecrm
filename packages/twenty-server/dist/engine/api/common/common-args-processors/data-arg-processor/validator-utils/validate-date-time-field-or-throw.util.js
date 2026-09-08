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
const _temporalpolyfill = require("temporal-polyfill");
const _utils = require("twenty-shared/utils");
const _commonqueryrunnerexception = require("../../../common-query-runners/errors/common-query-runner.exception");
const throwInvalidDateTimeFieldException = (value, fieldName)=>{
    const inspectedValue = (0, _util.inspect)(value);
    throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Invalid value ${inspectedValue} for date-time field "${fieldName}". Expected format: 'YYYY-MM-DDTHH:mm:ssZ'`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_DATA, {
        userFriendlyMessage: /*i18n*/ {
            id: "MnHbVB",
            message: "Invalid value for date-time: \"{inspectedValue}\". Expected format: 'YYYY-MM-DDTHH:mm:ssZ'",
            values: {
                inspectedValue: inspectedValue
            }
        }
    });
};
const validateDateTimeFieldOrThrow = (value, fieldName)=>{
    if ((0, _guards.isNull)(value)) return null;
    if ((0, _guards.isDate)(value) && (0, _datefns.isValid)(value)) {
        return _temporalpolyfill.Temporal.Instant.fromEpochMilliseconds(value.getTime()).toString();
    }
    if ((0, _guards.isString)(value)) {
        try {
            return (0, _utils.parseToInstantOrThrow)(value).toString();
        } catch  {
            throwInvalidDateTimeFieldException(value, fieldName);
        }
    }
    throwInvalidDateTimeFieldException(value, fieldName);
};

//# sourceMappingURL=validate-date-time-field-or-throw.util.js.map