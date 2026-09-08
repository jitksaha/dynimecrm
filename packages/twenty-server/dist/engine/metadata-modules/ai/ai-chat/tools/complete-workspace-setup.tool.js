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
    get COMPLETE_WORKSPACE_SETUP_TOOL_NAME () {
        return _ai.COMPLETE_WORKSPACE_SETUP_TOOL_NAME;
    },
    get completeWorkspaceSetupInputSchema () {
        return completeWorkspaceSetupInputSchema;
    },
    get createCompleteWorkspaceSetupTool () {
        return createCompleteWorkspaceSetupTool;
    }
});
const _zod = require("zod");
const _ai = require("twenty-shared/ai");
const completeWorkspaceSetupInputSchema = _zod.z.object({});
const createCompleteWorkspaceSetupTool = ()=>({
        description: 'Mark the workspace setup conversation as finished. Call it exactly once, at the very end ' + 'of your final reply, right after the closing recap, and only once every remaining ' + 'capability has been accepted and built or declined, or the user says they are done. The ' + 'call closes the full-page setup screen: the user lands on their Companies view and this ' + 'conversation continues in a side panel next to their work. Never call it while a question ' + 'is unanswered or while anything the user accepted is still unbuilt, and never call it twice.',
        inputSchema: completeWorkspaceSetupInputSchema,
        execute: async ()=>({
                success: true,
                message: 'Setup marked as finished. The setup screen is closing; the user now sees their ' + 'Companies view and this conversation continues in the side panel.'
            })
    });

//# sourceMappingURL=complete-workspace-setup.tool.js.map