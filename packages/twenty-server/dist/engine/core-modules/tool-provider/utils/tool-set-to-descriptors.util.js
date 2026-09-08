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
    get humanizeToolName () {
        return humanizeToolName;
    },
    get toolSetToDescriptors () {
        return toolSetToDescriptors;
    }
});
const _totooljsonschemautil = require("../../record-crud/utils/to-tool-json-schema.util");
const humanizeToolName = (name)=>name.split('_').filter((word)=>word.length > 0).map((word)=>`${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
const toolSetToDescriptors = (toolSet, category, options)=>{
    const includeSchemas = options?.includeSchemas ?? true;
    return Object.entries(toolSet).map(([name, tool])=>{
        const base = {
            name,
            label: humanizeToolName(name),
            description: tool.description ?? '',
            category,
            executionRef: {
                kind: 'static',
                toolId: name
            },
            ...options?.icon && {
                icon: options.icon
            }
        };
        if (!includeSchemas) {
            return base;
        }
        let inputSchema;
        try {
            inputSchema = (0, _totooljsonschemautil.toToolJsonSchema)(tool.inputSchema);
        } catch  {
            inputSchema = tool.inputSchema ?? {};
        }
        return {
            ...base,
            inputSchema
        };
    });
};

//# sourceMappingURL=tool-set-to-descriptors.util.js.map