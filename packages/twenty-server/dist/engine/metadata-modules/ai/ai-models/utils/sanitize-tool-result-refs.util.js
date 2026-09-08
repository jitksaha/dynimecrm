"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeToolResultRefs", {
    enumerable: true,
    get: function() {
        return sanitizeToolResultRefs;
    }
});
const _guards = require("@sniptt/guards");
const containsJsonSchemaDefsRef = (value)=>{
    if ((0, _guards.isArray)(value)) {
        return value.some(containsJsonSchemaDefsRef);
    }
    if (!(0, _guards.isObject)(value)) {
        return false;
    }
    return '$ref' in value && (0, _guards.isString)(value.$ref) || '$defs' in value || Object.values(value).some(containsJsonSchemaDefsRef);
};
const sanitizeToolResultPart = (part)=>{
    if (part.output.type !== 'json' && part.output.type !== 'error-json' || !containsJsonSchemaDefsRef(part.output.value)) {
        return part;
    }
    const value = JSON.stringify(part.output.value);
    const providerOptions = part.output.providerOptions ? {
        providerOptions: part.output.providerOptions
    } : {};
    return {
        ...part,
        output: part.output.type === 'error-json' ? {
            type: 'error-text',
            value,
            ...providerOptions
        } : {
            type: 'text',
            value,
            ...providerOptions
        }
    };
};
const sanitizeToolResultRefs = (prompt)=>prompt.map((message)=>message.role === 'tool' ? {
            ...message,
            content: message.content.map(sanitizeToolResultPart)
        } : message);

//# sourceMappingURL=sanitize-tool-result-refs.util.js.map