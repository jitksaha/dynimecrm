"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createGetLogicFunctionSourceTool", {
    enumerable: true,
    get: function() {
        return createGetLogicFunctionSourceTool;
    }
});
const _zod = require("zod");
const getLogicFunctionSourceSchema = _zod.z.object({
    logicFunctionId: _zod.z.string().uuid().describe('The ID of the logic function to read (from the code step settings.input.logicFunctionId)')
});
const createGetLogicFunctionSourceTool = (deps, context)=>({
        name: 'get_logic_function_source',
        description: `Read the current TypeScript source code of a logic function used in a workflow CODE step.

Use this to inspect the code that runs when a CODE step executes — for example, before editing an existing function with update_logic_function_source, so the edit is based on the real current source rather than a guess.

To find the logicFunctionId, look at the code step's settings.input.logicFunctionId field.`,
        inputSchema: getLogicFunctionSourceSchema,
        execute: async (parameters)=>{
            try {
                const { logicFunctionId } = parameters;
                const { workspaceId } = context;
                const sourceHandlerCode = await deps.logicFunctionFromSourceService.getSourceCode({
                    id: logicFunctionId,
                    workspaceId
                });
                return {
                    success: true,
                    logicFunctionId,
                    sourceHandlerCode
                };
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                return {
                    success: false,
                    error: message,
                    message: `Failed to read logic function source: ${message}`
                };
            }
        }
    });

//# sourceMappingURL=get-logic-function-source.tool.js.map