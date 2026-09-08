"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "guideUncallableToolCallsToMetaTool", {
    enumerable: true,
    get: function() {
        return guideUncallableToolCallsToMetaTool;
    }
});
const _ai = require("ai");
const _tools = require("../../../../core-modules/tool-provider/tools");
const buildMetaToolGuidance = (toolName)=>` "${toolName}" is not directly callable. Discover its input schema with ` + `${_tools.LEARN_TOOLS_TOOL_NAME}({ toolNames: ["${toolName}"] }), then run it through ` + `${_tools.EXECUTE_TOOL_TOOL_NAME}({ toolName: "${toolName}", arguments: { ... } }).`;
const guideUncallableToolCallsToMetaTool = (parts, directlyCallableToolNames)=>parts.map((part)=>{
        if (!(0, _ai.isToolUIPart)(part) || part.state !== 'output-error') {
            return part;
        }
        const toolName = (0, _ai.getToolName)(part);
        if (directlyCallableToolNames.has(toolName)) {
            return part;
        }
        return {
            ...part,
            errorText: `${part.errorText ?? ''}${buildMetaToolGuidance(toolName)}`
        };
    });

//# sourceMappingURL=guide-uncallable-tool-calls-to-meta-tool.util.js.map