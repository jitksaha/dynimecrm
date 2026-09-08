"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getIteratorInitialLoopStepIds", {
    enumerable: true,
    get: function() {
        return getIteratorInitialLoopStepIds;
    }
});
const _guards = require("@sniptt/guards");
const getIteratorInitialLoopStepIds = (step)=>{
    const initialLoopStepIds = step.settings.input.initialLoopStepIds;
    if ((0, _guards.isString)(initialLoopStepIds)) {
        try {
            const parsed = JSON.parse(initialLoopStepIds);
            if (Array.isArray(parsed) && parsed.every(_guards.isString)) {
                return parsed;
            }
        } catch  {
            return [];
        }
        return [];
    }
    return initialLoopStepIds ?? [];
};

//# sourceMappingURL=get-iterator-initial-loop-step-ids.util.js.map