"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CodeInterpreterInputZodSchema", {
    enumerable: true,
    get: function() {
        return CodeInterpreterInputZodSchema;
    }
});
const _zod = require("zod");
const CodeInterpreterInputZodSchema = _zod.z.object({
    code: _zod.z.string().describe('Python code to execute'),
    files: _zod.z.array(_zod.z.object({
        filename: _zod.z.string().describe('Name of the file'),
        fileId: _zod.z.string().describe('ID of the uploaded file (from user attachments)')
    })).optional().describe('Files to make available in the execution environment'),
    loadingMessage: _zod.z.string().describe("A brief, present-tense status message shown to the user while the code runs (e.g., 'Analyzing sales data')."),
    completedMessage: _zod.z.string().optional().describe("A brief, past-tense status message shown to the user after the code finishes (e.g., 'Analyzed sales data'). No exclamation marks. Don't be optimistic, stay neutral on completion state. Falls back to the loading message when omitted.")
});

//# sourceMappingURL=code-interpreter-tool.schema.js.map