"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeLogicFunctionExecutionCreditsMicro", {
    enumerable: true,
    get: function() {
        return computeLogicFunctionExecutionCreditsMicro;
    }
});
const _logicfunctionbillingconstant = require("../constants/logic-function-billing.constant");
const computeLogicFunctionExecutionCreditsMicro = ({ durationMs, isBillingExempt })=>{
    if (isBillingExempt) {
        return {
            invocationCreditsMicro: 0,
            durationCreditsMicro: 0,
            billedDurationMs: 0
        };
    }
    const billedDurationMs = Math.max(Math.floor(durationMs), 0);
    return {
        invocationCreditsMicro: _logicfunctionbillingconstant.LOGIC_FUNCTION_INVOCATION_CREDITS_MICRO,
        durationCreditsMicro: Math.floor(billedDurationMs * _logicfunctionbillingconstant.LOGIC_FUNCTION_DURATION_CREDITS_MICRO_PER_MS),
        billedDurationMs
    };
};

//# sourceMappingURL=compute-logic-function-execution-credits-micro.util.js.map