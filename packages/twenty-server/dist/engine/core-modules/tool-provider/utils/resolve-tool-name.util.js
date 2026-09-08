"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveToolName", {
    enumerable: true,
    get: function() {
        return resolveToolName;
    }
});
const _guards = require("@sniptt/guards");
const _tools = require("../tools");
const hasExecuteToolName = (input)=>(0, _guards.isObject)(input) && 'toolName' in input && (0, _guards.isNonEmptyString)(input.toolName);
const resolveToolName = (part)=>{
    if (part.toolName !== _tools.EXECUTE_TOOL_TOOL_NAME) {
        return part.toolName;
    }
    return hasExecuteToolName(part.input) ? part.input.toolName : `${_tools.EXECUTE_TOOL_TOOL_NAME}:unknown`;
};

//# sourceMappingURL=resolve-tool-name.util.js.map