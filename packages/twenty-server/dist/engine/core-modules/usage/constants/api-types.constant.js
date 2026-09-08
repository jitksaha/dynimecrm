/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "API_TYPE_BY_PATH_PREFIX", {
    enumerable: true,
    get: function() {
        return API_TYPE_BY_PATH_PREFIX;
    }
});
const _types = require("twenty-shared/types");
const API_TYPE_BY_PATH_PREFIX = {
    [_types.ApiPath.GraphQL]: 'CORE_GQL',
    [_types.ApiPath.Rest]: 'CORE_REST',
    [_types.ApiPath.Mcp]: 'MCP'
};

//# sourceMappingURL=api-types.constant.js.map