"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ToolOutputSpillService", {
    enumerable: true,
    get: function() {
        return ToolOutputSpillService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _classvalidator = require("class-validator");
const _applicationservice = require("../../application/application.service");
const _filestorageservice = require("../../file-storage/services/file-storage.service");
const _maxinlinetooloutputbytesconstant = require("../tools/output-navigation-tool/constants/max-inline-tool-output-bytes.constant");
const _outputnavigationtoolnamesconstant = require("../tools/output-navigation-tool/constants/output-navigation-tool-names.constant");
const _formatbytesutil = require("../utils/format-bytes.util");
const _jsonpreviewutil = require("../utils/json-preview.util");
const _truncateheadtailutil = require("../utils/truncate-head-tail.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const OUTPUT_NAVIGATION_TOOL_NAME_SET = new Set(_outputnavigationtoolnamesconstant.OUTPUT_NAVIGATION_TOOL_NAMES);
const NAVIGATION_TOOL_TRUNCATION_GUIDANCE = 'Narrow the query (more specific pattern or paths, lower maxMatches/maxItems/contextChars) or page through the data with the offset parameter to reach the omitted middle.';
const SPILL_FAILURE_TRUNCATION_GUIDANCE = 'Re-run the tool with narrower filters or pagination to retrieve the omitted middle.';
let ToolOutputSpillService = class ToolOutputSpillService {
    async spillIfTooLarge(output, { workspaceId }, options) {
        if (!(0, _utils.isDefined)(output) || !(0, _classvalidator.isObject)(output)) {
            return output;
        }
        let serialized;
        try {
            serialized = JSON.stringify(output);
        } catch  {
            return output;
        }
        if (!(0, _utils.isDefined)(serialized)) {
            return output;
        }
        const sizeBytes = Buffer.byteLength(serialized);
        if (sizeBytes <= _maxinlinetooloutputbytesconstant.MAX_INLINE_TOOL_OUTPUT_BYTES) {
            return output;
        }
        if (OUTPUT_NAVIGATION_TOOL_NAME_SET.has(options.toolName)) {
            return this.buildTruncatedInlineOutput(output, serialized, sizeBytes, NAVIGATION_TOOL_TRUNCATION_GUIDANCE);
        }
        try {
            const preview = (0, _jsonpreviewutil.jsonPreview)(output);
            const fileId = (0, _uuid.v4)();
            const filename = `tool-output-${options.toolName}-${fileId}.json`;
            const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
                workspaceId
            });
            const savedFile = await this.fileStorageService.writeFile({
                sourceFile: Buffer.from(serialized),
                fileFolder: _types.FileFolder.AgentChat,
                applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
                workspaceId,
                resourcePath: `tool-output-spill/${fileId}.json`,
                fileId,
                settings: {
                    isTemporaryFile: false,
                    toDelete: false
                }
            });
            const hint = `Output too large to inline (${(0, _formatbytesutil.formatBytes)(sizeBytes)}). "preview" is a truncated sample (first items, all keys). To read the full data, call learn_tools with extract_json_paths (for json objects) or search_output (for text), then invoke it through execute_tool with this fileId; or use code_interpreter for analysis. These are registry tools, not directly callable.`;
            return {
                success: output.success,
                message: output.message,
                result: {
                    spilled: true,
                    outputRef: {
                        fileId: savedFile.id,
                        filename
                    },
                    preview,
                    hint
                }
            };
        } catch (error) {
            this.logger.warn(`Failed to spill large output for "${options.toolName}"; returning truncated output inline.`, error);
            return {
                ...this.buildTruncatedInlineOutput(output, serialized, sizeBytes, SPILL_FAILURE_TRUNCATION_GUIDANCE),
                warnings: [
                    ...output.warnings ?? [],
                    'Large output spill failed; the output was truncated inline.'
                ]
            };
        }
    }
    buildTruncatedInlineOutput(output, serialized, sizeBytes, guidance) {
        return {
            success: output.success,
            message: output.message,
            result: {
                truncated: true,
                originalSizeBytes: sizeBytes,
                content: (0, _truncateheadtailutil.truncateHeadTail)({
                    text: serialized,
                    maxBytes: _maxinlinetooloutputbytesconstant.MAX_INLINE_TOOL_OUTPUT_BYTES,
                    guidance
                })
            }
        };
    }
    constructor(fileStorageService, applicationService){
        this.fileStorageService = fileStorageService;
        this.applicationService = applicationService;
        this.logger = new _common.Logger(ToolOutputSpillService.name);
    }
};
ToolOutputSpillService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], ToolOutputSpillService);

//# sourceMappingURL=tool-output-spill.service.js.map