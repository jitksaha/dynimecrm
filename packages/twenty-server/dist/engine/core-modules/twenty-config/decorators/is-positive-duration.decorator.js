"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IsPositiveDuration", {
    enumerable: true,
    get: function() {
        return IsPositiveDuration;
    }
});
const _classvalidator = require("class-validator");
const _positivedurationvalidator = require("../validators/positive-duration.validator");
const IS_ZERO_ALLOWED = false;
const IsPositiveDuration = (validationOptions)=>(object, propertyName)=>{
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

//# sourceMappingURL=is-positive-duration.decorator.js.map