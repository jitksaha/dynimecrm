"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "rewriteTriggerVariablesToPayload", {
    enumerable: true,
    get: function() {
        return rewriteTriggerVariablesToPayload;
    }
});
const _utils = require("twenty-shared/utils");
// Manual-trigger record fields moved from the flat trigger root
// ({{trigger.name}}) to a nested payload node ({{trigger.payload.name}}).
// The negative lookaheads keep this idempotent: references already pointing at
// `payload`/`metadata` (or the legacy `_metadata` key) are left untouched, so
// re-running is a no-op and metadata refs are never prefixed with `payload`.
// A field named exactly `payload` or `metadata` collides and is skipped — that
// risk was accepted when the nested keys were named.
const TRIGGER_VARIABLE_PREFIX_REGEX = /\{\{trigger\.(?!payload[.}])(?!metadata[.}])(?!_metadata[.}])/g;
const rewriteTriggerVariablesToPayload = (value)=>{
    if (!(0, _utils.isDefined)(value)) {
        return {
            value,
            changed: false
        };
    }
    const serialized = JSON.stringify(value);
    const rewritten = serialized.replace(TRIGGER_VARIABLE_PREFIX_REGEX, '{{trigger.payload.');
    if (rewritten === serialized) {
        return {
            value,
            changed: false
        };
    }
    return {
        value: JSON.parse(rewritten),
        changed: true
    };
};

//# sourceMappingURL=rewrite-trigger-variables-to-payload.util.js.map