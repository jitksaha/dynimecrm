"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IsNonNegativeDuration", {
    enumerable: true,
    get: function() {
        return IsNonNegativeDuration;
    }
});
const _classvalidator = require("class-validator");
const _positivedurationvalidator = require("../validators/positive-duration.validator");
const IS_ZERO_ALLOWED = true;
const IsNonNegativeDuration = (validationOptions)=>(object, propertyName)=>{
        (0, _classvalidator.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [
                IS_ZERO_ALLOWED
            ],
            validator: _positivedurationvalidator.PositiveDurationConstraint
        });
    };

//# sourceMappingURL=is-non-negative-duration.decorator.js.map