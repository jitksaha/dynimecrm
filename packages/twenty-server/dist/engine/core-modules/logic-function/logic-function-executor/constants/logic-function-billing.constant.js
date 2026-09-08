// Flat charge per invocation: $0.0001 (1 micro credit = $0.000001).
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
    get LOGIC_FUNCTION_DURATION_CREDITS_MICRO_PER_MS () {
        return LOGIC_FUNCTION_DURATION_CREDITS_MICRO_PER_MS;
    },
    get LOGIC_FUNCTION_INVOCATION_CREDITS_MICRO () {
        return LOGIC_FUNCTION_INVOCATION_CREDITS_MICRO;
    }
});
const LOGIC_FUNCTION_INVOCATION_CREDITS_MICRO = 100;
const LOGIC_FUNCTION_DURATION_CREDITS_MICRO_PER_MS = 0.1;

//# sourceMappingURL=logic-function-billing.constant.js.map