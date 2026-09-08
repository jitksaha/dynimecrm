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
    get LEARN_TOOLS_TOOL_NAME () {
        return LEARN_TOOLS_TOOL_NAME;
    },
    get createLearnToolsTool () {
        return createLearnToolsTool;
    },
    get learnToolsInputSchema () {
        return learnToolsInputSchema;
    }
});
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const LEARN_TOOLS_TOOL_NAME = 'learn_tools';
const learnToolsAspectSchema = _zod.z.enum([
    'description',
    'schema'
]);
const learnToolsInputSchema = _zod.z.object({
    toolNames: _zod.z.array(_zod.z.string()).describe('Exact tool names. Do not guess tool names. Pass every tool you need to learn in this single array — do not make separate learn_tools calls per tool.'),
    aspects: _zod.z.array(learnToolsAspectSchema).optional().default([
        'description',
        'schema'
    ]).describe('What to learn: ["description"], ["schema"], or ["description", "schema"].')
});
const createLearnToolsTool = (toolRegistry, context, options)=>({
        description: 'Get input schemas for tools. Pass all the tool names you need in a single call (toolNames accepts an array) rather than calling learn_tools once per tool. Call this with exact tool names to learn the required arguments before calling execute_tool.',
        inputSchema: learnToolsInputSchema,
        execute: async (parameters)=>{
            const { toolNames, aspects } = parameters;
            const { isToolAllowed } = options ?? {};
            const allowedNames = isToolAllowed ? toolNames.filter((name)=>isToolAllowed(name)) : toolNames;
            const toolInfos = await toolRegistry.getToolInfo(allowedNames, context, aspects);
            const foundNames = new Set(toolInfos.map((toolInfo)=>toolInfo.name));
            // Base notFound on allowedNames so excluded tools aren't surfaced as
            // missing (which would also trigger misleading suggestions).
            const notFound = allowedNames.filter((name)=>!foundNames.has(name));
            const suggestions = notFound.length > 0 ? await toolRegistry.suggestSimilarToolNames(notFound, context) : {};
            const messageParts = [];
            if (toolInfos.length > 0) {
                const learnedNames = toolInfos.map((toolInfo)=>toolInfo.name);
                const toolNoun = learnedNames.length === 1 ? 'tool' : 'tools';
                messageParts.push(`Learned ${learnedNames.length} ${toolNoun}: ${learnedNames.join(', ')}`);
            }
            if (notFound.length > 0) {
                const notFoundDescription = notFound.map((name)=>{
                    const similarToolNames = suggestions[name];
                    return similarToolNames?.length ? `${name} (did you mean: ${similarToolNames.join(', ')}?)` : name;
                }).join('; ');
                messageParts.push(`Could not find: ${notFoundDescription}`);
            }
            const learnToolsResult = {
                tools: toolInfos,
                notFound,
                ...Object.keys(suggestions).length > 0 && {
                    suggestions
                },
                message: messageParts.length > 0 ? `${messageParts.join('. ')}.` : 'No matching tools found.'
            };
            if (options?.spillLargeOutput !== true) {
                return learnToolsResult;
            }
            const spillCandidate = {
                success: true,
                message: learnToolsResult.message,
                result: {
                    tools: learnToolsResult.tools
                }
            };
            const spillOutcome = await toolRegistry.spillToolOutputIfTooLarge(spillCandidate, context, LEARN_TOOLS_TOOL_NAME);
            if (spillOutcome === spillCandidate) {
                return learnToolsResult;
            }
            return {
                ...learnToolsResult,
                tools: [],
                ...(0, _utils.isDefined)(spillOutcome.result) && {
                    spilledTools: spillOutcome.result
                },
                ...(0, _utils.isDefined)(spillOutcome.warnings) && {
                    warnings: spillOutcome.warnings
                }
            };
        }
    });

//# sourceMappingURL=learn-tools.tool.js.map