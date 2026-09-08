"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isToolOutputSuccessful", {
    enumerable: true,
    get: function() {
        return isToolOutputSuccessful;
    }
});
const _guards = require("@sniptt/guards");
const isToolOutputSuccessful = (output)=>{
    const isFailure = (0, _guards.isObject)(output) && 'success' in output && output.success === false;
    return !isFailure;
};

//# sourceMappingURL=is-tool-output-successful.util.js.map