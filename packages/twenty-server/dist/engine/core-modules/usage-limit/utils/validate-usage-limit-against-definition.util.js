"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateUsageLimitAgainstDefinition", {
    enumerable: true,
    get: function() {
        return validateUsageLimitAgainstDefinition;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _usagelimitexception = require("../exceptions/usage-limit.exception");
const _findusagelimitdefinitionutil = require("./find-usage-limit-definition.util");
const validateUsageLimitAgainstDefinition = (input)=>{
    const definition = (0, _findusagelimitdefinitionutil.findUsageLimitDefinition)({
        resourceType: input.resourceType,
        limitKind: input.limitKind
    });
    if (!(0, _utils.isDefined)(definition)) {
        throw new _usagelimitexception.UsageLimitException(`No ${input.limitKind} limit is defined for ${input.resourceType}`, _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID);
    }
    if (!definition.allowedOperationTypes.includes(input.operationType)) {
        throw new _usagelimitexception.UsageLimitException(`${input.resourceType} ${input.limitKind} limits cannot target the ${input.operationType} operation`, _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID);
    }
    if (!definition.allowedSpenderTypes.includes(input.spenderType)) {
        throw new _usagelimitexception.UsageLimitException(`${input.resourceType} ${input.limitKind} limits cannot be scoped to ${input.spenderType}`, _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID);
    }
    if ((0, _guards.isNonEmptyString)(input.spenderId) && !(0, _utils.isValidUuid)(input.spenderId)) {
        throw new _usagelimitexception.UsageLimitException(`${input.spenderId} is not a valid ${input.spenderType} id`, _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID);
    }
    if (input.limitKind === 'speed' && input.windowSeconds <= 0) {
        throw new _usagelimitexception.UsageLimitException('A speed limit needs a window longer than zero seconds', _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID);
    }
};

//# sourceMappingURL=validate-usage-limit-against-definition.util.js.map