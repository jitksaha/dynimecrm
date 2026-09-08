"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExtractJsonPathsInputZodSchema", {
    enumerable: true,
    get: function() {
        return ExtractJsonPathsInputZodSchema;
    }
});
const _zod = require("zod");
const ExtractJsonPathsInputZodSchema = _zod.z.object({
    fileId: _zod.z.string().describe('ID of the spilled output file to read (the outputRef.fileId returned when a tool result was too large to inline).'),
    paths: _zod.z.array(_zod.z.string().regex(/^\$/, 'Each path must start with "$"')).min(1).max(20).describe('JSONPath-lite expressions to extract in a single pass over the file, e.g. ["$.failedStepLogs["step-id"].entries[0:5]", "$.status"]. Each supports dot notation, bracket keys, array index, slicing [start:end] and a single-level wildcard [*]. Filters and recursive descent are not supported (use code_interpreter for those). All paths share the same maxItems and maxDepth, and each is resolved independently so one failing path does not discard the others.'),
    maxItems: _zod.z.number().int().positive().max(200).optional().describe('Maximum array items to return per array (default 20).'),
    maxDepth: _zod.z.number().int().positive().max(10).optional().describe('Maximum nesting depth before deeper structures are replaced with type markers (default 5).')
});

//# sourceMappingURL=extract-json-paths-tool.schema.js.map