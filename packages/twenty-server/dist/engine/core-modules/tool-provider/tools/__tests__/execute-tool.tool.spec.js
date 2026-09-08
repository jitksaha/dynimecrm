"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _executetooltool = require("../execute-tool.tool");
describe('createExecuteToolTool', ()=>{
    const context = {};
    const buildRegistry = ()=>({
            resolveAndExecute: jest.fn().mockResolvedValue({
                success: true,
                result: {}
            })
        });
    it('executes tools the predicate allows', async ()=>{
        const toolRegistry = buildRegistry();
        const executeTool = (0, _executetooltool.createExecuteToolTool)(toolRegistry, context, {
            isToolAllowed: (toolName)=>toolName === 'find_many_people'
        });
        const result = await executeTool.execute({
            toolName: 'find_many_people',
            arguments: {}
        });
        expect(toolRegistry.resolveAndExecute).toHaveBeenCalledTimes(1);
        expect(result.success).toBe(true);
    });
    it('refuses tools the predicate rejects without touching the registry', async ()=>{
        const toolRegistry = buildRegistry();
        const executeTool = (0, _executetooltool.createExecuteToolTool)(toolRegistry, context, {
            isToolAllowed: (toolName)=>toolName === 'find_many_people'
        });
        const result = await executeTool.execute({
            toolName: 'create_one_workflow',
            arguments: {}
        });
        expect(toolRegistry.resolveAndExecute).not.toHaveBeenCalled();
        expect(result.success).toBe(false);
    });
    it('executes any tool when no predicate is provided', async ()=>{
        const toolRegistry = buildRegistry();
        const executeTool = (0, _executetooltool.createExecuteToolTool)(toolRegistry, context);
        const result = await executeTool.execute({
            toolName: 'find_many_people',
            arguments: {}
        });
        expect(toolRegistry.resolveAndExecute).toHaveBeenCalledTimes(1);
        expect(result.success).toBe(true);
    });
});

//# sourceMappingURL=execute-tool.tool.spec.js.map