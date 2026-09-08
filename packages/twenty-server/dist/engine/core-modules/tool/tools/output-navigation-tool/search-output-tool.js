"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchOutputTool", {
    enumerable: true,
    get: function() {
        return SearchOutputTool;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _fileservice = require("../../../file/services/file.service");
const _defaultsearchoutputcontextcharsconstant = require("./constants/default-search-output-context-chars.constant");
const _defaultsearchoutputmaxmatchesconstant = require("./constants/default-search-output-max-matches.constant");
const _searchoutputtoolschema = require("./search-output-tool.schema");
const _searchoutpututil = require("./utils/search-output.util");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SearchOutputTool = class SearchOutputTool {
    async execute(parameters, context) {
        const { workspaceId } = context;
        const parseResult = _searchoutputtoolschema.SearchOutputInputZodSchema.safeParse(parameters);
        if (!parseResult.success) {
            return {
                success: false,
                message: 'Invalid input for search output',
                error: parseResult.error.issues.map((issue)=>`${issue.path.join('.') || '(root)'}: ${issue.message}`).join('; ')
            };
        }
        const { fileId, pattern, maxMatches, offset, contextChars } = parseResult.data;
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
        if (!(0, _utils.isDefined)(fileContent)) {
            return {
                success: false,
                message: 'Output file not found',
                error: `File "${fileId}" not found or no longer available.`
            };
        }
        const content = fileContent.buffer.toString('utf-8');
        const result = (0, _searchoutpututil.searchOutput)({
            content,
            pattern,
            maxMatches: maxMatches ?? _defaultsearchoutputmaxmatchesconstant.DEFAULT_SEARCH_OUTPUT_MAX_MATCHES,
            offset: offset ?? 0,
            contextChars: contextChars ?? _defaultsearchoutputcontextcharsconstant.DEFAULT_SEARCH_OUTPUT_CONTEXT_CHARS
        });
        return {
            success: true,
            message: result.totalMatches === 0 ? `No matches for "${pattern}"` : `Found ${result.totalMatches} occurrence(s) for "${pattern}"`,
            result
        };
    }
    constructor(fileService){
        this.fileService = fileService;
        this.logger = new _common.Logger(SearchOutputTool.name);
        this.description = 'Search (grep -o style) within a large spilled tool output for a text or regex pattern, returning every occurrence with surrounding characters of context. Works on raw text of any shape (CSV, HTML, stringified JSON, plain text), including single-line content. Supports stateless pagination via offset. Use this to locate an error message or key in a file too large to inline.';
        this.inputSchema = _searchoutputtoolschema.SearchOutputInputZodSchema;
    }
};
SearchOutputTool = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fileservice.FileService === "undefined" ? Object : _fileservice.FileService
    ])
], SearchOutputTool);

//# sourceMappingURL=search-output-tool.js.map