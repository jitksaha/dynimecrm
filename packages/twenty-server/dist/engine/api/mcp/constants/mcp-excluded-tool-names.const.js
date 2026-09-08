"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MCP_EXCLUDED_TOOL_NAMES", {
    enumerable: true,
    get: function() {
        return MCP_EXCLUDED_TOOL_NAMES;
    }
});
const _outputnavigationtoolnamesconstant = require("../../../core-modules/tool/tools/output-navigation-tool/constants/output-navigation-tool-names.constant");
const MCP_EXCLUDED_TOOL_NAMES = new Set([
    'code_interpreter',
    'http_request',
    ..._outputnavigationtoolnamesconstant.OUTPUT_NAVIGATION_TOOL_NAMES
]);

//# sourceMappingURL=mcp-excluded-tool-names.const.js.map