"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ToolRegistryService", {
    enumerable: true,
    get: function() {
        return ToolRegistryService;
    }
});
const _common = require("@nestjs/common");
const _ai = require("ai");
const _toolproviderstoken = require("../constants/tool-providers.token");
const _compacttooloutpututil = require("../output-transforms/compact-tool-output.util");
const _toolexecutorservice = require("./tool-executor.service");
const _findsimilartoolnamesutil = require("../utils/find-similar-tool-names.util");
const _toolerrorutil = require("../utils/tool-error.util");
const _tooloutputspillservice = require("../../tool/services/tool-output-spill.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ToolRegistryService = class ToolRegistryService {
    async getCatalog(context) {
        const results = await Promise.all(this.providers.map(async (provider)=>{
            if (await provider.isAvailable(context)) {
                return provider.generateDescriptors(context, {
                    includeSchemas: false
                });
            }
            return [];
        }));
        return results.flat();
    }
    async resolveSchemas({ toolNames, context, precomputedCatalog }) {
        const index = precomputedCatalog ?? await this.getCatalog(context);
        const nameSet = new Set(toolNames);
        const matchingEntries = index.filter((entry)=>nameSet.has(entry.name));
        const byCategory = new Map();
        for (const entry of matchingEntries){
            const existing = byCategory.get(entry.category) ?? [];
            existing.push(entry);
            byCategory.set(entry.category, existing);
        }
        const schemas = new Map();
        for (const [category, entries] of byCategory){
            const provider = this.providers.find((providerItem)=>providerItem.category === category);
            if (!provider) {
                continue;
            }
            const entryNameSet = new Set(entries.map((entry)=>entry.name));
            const descriptors = await provider.generateDescriptors(context, {
                includeSchemas: true,
                toolNames: entryNameSet
            });
            for (const descriptor of descriptors){
                if (entryNameSet.has(descriptor.name) && 'inputSchema' in descriptor && descriptor.inputSchema) {
                    schemas.set(descriptor.name, descriptor.inputSchema);
                }
            }
        }
        return schemas;
    }
    hydrateToolSet(descriptors, context, options) {
        const toolSet = {};
        const compactOutput = options?.compactOutput ?? false;
        const spillLargeOutput = options?.spillLargeOutput ?? false;
        for (const descriptor of descriptors){
            const schema = descriptor.inputSchema;
            const executeFn = async (args)=>{
                const result = await this.toolExecutorService.dispatch(descriptor, args, context);
                const compacted = compactOutput ? (0, _compacttooloutpututil.compactToolOutput)(result) : result;
                return spillLargeOutput ? this.toolOutputSpillService.spillIfTooLarge(compacted, {
                    workspaceId: context.workspaceId
                }, {
                    toolName: descriptor.name
                }) : compacted;
            };
            toolSet[descriptor.name] = {
                description: descriptor.description,
                inputSchema: (0, _ai.jsonSchema)(schema),
                execute: options?.wrapWithErrorContext ? (0, _toolerrorutil.wrapWithErrorHandler)(descriptor.name, executeFn) : executeFn
            };
        }
        return toolSet;
    }
    async buildToolIndex(workspaceId, roleId, options) {
        const context = this.buildContextFromToolContext({
            workspaceId,
            roleId,
            rolePermissionConfig: options?.rolePermissionConfig,
            userId: options?.userId,
            userWorkspaceId: options?.userWorkspaceId,
            locale: options?.locale
        });
        return this.getCatalog(context);
    }
    async getToolsByName(names, context, options) {
        const fullContext = this.buildContextFromToolContext(context);
        const catalog = await this.getCatalog(fullContext);
        const nameSet = new Set(names);
        const matchingEntries = catalog.filter((entry)=>nameSet.has(entry.name));
        const schemas = await this.resolveSchemas({
            toolNames: names,
            context: fullContext,
            precomputedCatalog: catalog
        });
        const descriptors = matchingEntries.filter((entry)=>schemas.has(entry.name)).map((entry)=>({
                ...entry,
                inputSchema: schemas.get(entry.name)
            }));
        return this.hydrateToolSet(descriptors, fullContext, {
            compactOutput: options?.compactOutput,
            spillLargeOutput: options?.spillLargeOutput
        });
    }
    async getToolInfo(names, context, aspects = [
        'description',
        'schema'
    ]) {
        const fullContext = this.buildContextFromToolContext(context);
        const catalog = await this.getCatalog(fullContext);
        const nameSet = new Set(names);
        const matchingEntries = catalog.filter((entry)=>nameSet.has(entry.name));
        let schemas;
        if (aspects.includes('schema')) {
            schemas = await this.resolveSchemas({
                toolNames: names,
                context: fullContext,
                precomputedCatalog: catalog
            });
        }
        return matchingEntries.map((entry)=>{
            const info = {
                name: entry.name
            };
            if (aspects.includes('description')) {
                info.description = entry.description;
            }
            if (aspects.includes('schema') && schemas) {
                info.inputSchema = schemas.get(entry.name);
            }
            return info;
        });
    }
    async suggestSimilarToolNames(toolNames, context) {
        const fullContext = this.buildContextFromToolContext(context);
        const catalog = await this.getCatalog(fullContext);
        const candidateToolNames = catalog.map((entry)=>entry.name);
        const suggestionsByToolName = {};
        for (const toolName of toolNames){
            const similarToolNames = (0, _findsimilartoolnamesutil.findSimilarToolNames)(toolName, candidateToolNames);
            if (similarToolNames.length > 0) {
                suggestionsByToolName[toolName] = similarToolNames;
            }
        }
        return suggestionsByToolName;
    }
    async resolveAndExecute(toolName, args, context, options) {
        try {
            const fullContext = this.buildContextFromToolContext(context);
            const index = await this.getCatalog(fullContext);
            const entry = index.find((indexEntry)=>indexEntry.name === toolName);
            if (!entry) {
                const similarToolNames = (0, _findsimilartoolnamesutil.findSimilarToolNames)(toolName, index.map((indexEntry)=>indexEntry.name));
                const suggestionHint = similarToolNames.length > 0 ? ` Did you mean: ${similarToolNames.join(', ')}?` : '';
                return {
                    success: false,
                    message: `Tool "${toolName}" not found`,
                    error: `Tool "${toolName}" not found.${suggestionHint} Use learn_tools to discover available tools.`
                };
            }
            const result = await this.toolExecutorService.dispatch(entry, args, fullContext);
            const compacted = options?.compactOutput ? (0, _compacttooloutpututil.compactToolOutput)(result) : result;
            return options?.spillLargeOutput ? this.toolOutputSpillService.spillIfTooLarge(compacted, {
                workspaceId: fullContext.workspaceId
            }, {
                toolName
            }) : compacted;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error executing tool "${toolName}": ${errorMessage}`);
            return {
                success: false,
                message: `Failed to execute ${toolName}`,
                error: errorMessage
            };
        }
    }
    async spillToolOutputIfTooLarge(output, context, toolName) {
        return this.toolOutputSpillService.spillIfTooLarge(output, {
            workspaceId: context.workspaceId
        }, {
            toolName
        });
    }
    // Eager loading tools by categories (MCP, workflow agent).
    // These paths need full schemas, so generate with includeSchemas: true.
    async getToolsByCategories(context, options = {}) {
        const { categories, excludeTools, wrapWithErrorContext, compactOutput, spillLargeOutput } = options;
        const categorySet = categories ? new Set(categories) : undefined;
        const results = await Promise.all(this.providers.filter((provider)=>!categorySet || categorySet.has(provider.category)).map(async (provider)=>{
            if (await provider.isAvailable(context)) {
                return provider.generateDescriptors(context, {
                    includeSchemas: true
                });
            }
            return [];
        }));
        const descriptors = results.flat();
        let filteredDescriptors = descriptors;
        if (excludeTools?.length) {
            const excludeSet = new Set(excludeTools);
            filteredDescriptors = filteredDescriptors.filter((descriptor)=>!excludeSet.has(descriptor.name));
        }
        const toolSet = this.hydrateToolSet(filteredDescriptors, context, {
            wrapWithErrorContext,
            compactOutput,
            spillLargeOutput
        });
        this.logger.log(`Generated ${Object.keys(toolSet).length} tools for categories: [${categories?.join(', ') ?? 'all'}]`);
        return toolSet;
    }
    buildContextFromToolContext(context) {
        const rolePermissionConfig = context.rolePermissionConfig ?? {
            unionOf: [
                context.roleId
            ]
        };
        return {
            workspaceId: context.workspaceId,
            roleId: context.roleId,
            rolePermissionConfig,
            authContext: context.authContext,
            actorContext: context.actorContext,
            userId: context.userId,
            userWorkspaceId: context.userWorkspaceId,
            threadId: context.threadId,
            locale: context.locale,
            onCodeExecutionUpdate: context.onCodeExecutionUpdate
        };
    }
    constructor(providers, toolExecutorService, toolOutputSpillService){
        this.providers = providers;
        this.toolExecutorService = toolExecutorService;
        this.toolOutputSpillService = toolOutputSpillService;
        this.logger = new _common.Logger(ToolRegistryService.name);
    }
};
ToolRegistryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_toolproviderstoken.TOOL_PROVIDERS)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        typeof _toolexecutorservice.ToolExecutorService === "undefined" ? Object : _toolexecutorservice.ToolExecutorService,
        typeof _tooloutputspillservice.ToolOutputSpillService === "undefined" ? Object : _tooloutputspillservice.ToolOutputSpillService
    ])
], ToolRegistryService);

//# sourceMappingURL=tool-registry.service.js.map