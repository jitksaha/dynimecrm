"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PositiveDurationConstraint", {
    enumerable: true,
    get: function() {
        return PositiveDurationConstraint;
    }
});
const _classvalidator = require("class-validator");
const _parseconfigdurationutil = require("../utils/parse-config-duration.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PositiveDurationConstraint = class PositiveDurationConstraint {
    validate(duration, args) {
        const [isZeroAllowed] = args.constraints;
        const parsedDuration = (0, _parseconfigdurationutil.parseConfigDuration)(duration);
        if (parsedDuration === undefined) {
            return false;
        }
        return isZeroAllowed ? parsedDuration >= 0 : parsedDuration > 0;
    }
    defaultMessage(args) {
        const [isZeroAllowed] = args.constraints;
        return isZeroAllowed ? '$property must be a duration ms can parse into zero or more milliseconds, e.g. 10m or 0s' : '$property must be a duration ms can parse into a positive number of milliseconds, e.g. 30d, 12h or 10m';
    }
};
PositiveDurationConstraint = _ts_decorate([
    (0, _classvalidator.ValidatorConstraint)()
], PositiveDurationConstraint);

//# sourceMappingURL=positive-duration.validator.js.map