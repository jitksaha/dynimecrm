"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExtractJsonPathsTool", {
    enumerable: true,
    get: function() {
        return ExtractJsonPathsTool;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _fileservice = require("../../../file/services/file.service");
const _defaultextractjsonpathsmaxdepthconstant = require("./constants/default-extract-json-paths-max-depth.constant");
const _defaultextractjsonpathsmaxitemsconstant = require("./constants/default-extract-json-paths-max-items.constant");
const _extractjsonpathstoolschema = require("./extract-json-paths-tool.schema");
const _extractjsonpathutil = require("./utils/extract-json-path.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ExtractJsonPathsTool = class ExtractJsonPathsTool {
    async execute(parameters, context) {
        const { workspaceId } = context;
        const { fileId, paths, maxItems, maxDepth } = parameters;
        const effectiveMaxItems = maxItems ?? _defaultextractjsonpathsmaxitemsconstant.DEFAULT_EXTRACT_JSON_PATHS_MAX_ITEMS;
        const effectiveMaxDepth = maxDepth ?? _defaultextractjsonpathsmaxdepthconstant.DEFAULT_EXTRACT_JSON_PATHS_MAX_DEPTH;
        let fileContent;
        try {
            fileContent = await this.fileService.getFileContentById({
                fileId,
                workspaceId,
                fileFolder: _types.FileFolder.AgentChat
            });
        } catch (error) {
            this.logger.warn(`Failed to read file ${fileId}`, error);
            return {
                success: false,
                message: 'Failed to read output file',
                error: error instanceof Error ? error.message : String(error)
            };
        }
        if (fileContent === null) {
            return {
                success: false,
                message: 'Output file not found',
                error: `File "${fileId}" not found or no longer available.`
            };
        }
        let data;
        try {
            data = JSON.parse(fileContent.buffer.toString('utf-8'));
        } catch  {
            return {
                success: false,
                message: 'Output file is not valid JSON',
                error: 'The referenced file could not be parsed as JSON. Use search_output for free-text content.'
            };
        }
        const results = paths.map((path)=>{
            try {
                const value = (0, _extractjsonpathutil.extractJsonPath)({
                    data,
                    path,
                    maxItems: effectiveMaxItems,
                    maxDepth: effectiveMaxDepth
                });
                return {
                    path,
                    value
                };
            } catch (error) {
                if (error instanceof _extractjsonpathutil.JsonPathError) {
                    return {
                        path,
                        error: error.message
                    };
                }
                throw error;
            }
        });
        const resolvedCount = results.filter((result)=>'value' in result).length;
        if (resolvedCount === 0) {
            return {
                success: false,
                message: 'Could not resolve any path',
                result: {
                    results
                }
            };
        }
        return {
            success: true,
            message: `Extracted ${resolvedCount}/${paths.length} path(s)`,
            result: {
                results
            }
        };
    }
    constructor(fileService){
        this.fileService = fileService;
        this.logger = new _common.Logger(ExtractJsonPathsTool.name);
        this.description = 'Extract one or more sub-trees from a large spilled tool output (JSON) by path, without loading the whole file into context. Use the shape/skeleton returned with an outputRef to target paths. Reads and parses the file once, then resolves every path independently (a failing path does not discard the others). Each value is bounded by maxItems and maxDepth.';
        this.inputSchema = _extractjsonpathstoolschema.ExtractJsonPathsInputZodSchema;
    }
};
ExtractJsonPathsTool = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fileservice.FileService === "undefined" ? Object : _fileservice.FileService
    ])
], ExtractJsonPathsTool);

//# sourceMappingURL=extract-json-paths-tool.js.map