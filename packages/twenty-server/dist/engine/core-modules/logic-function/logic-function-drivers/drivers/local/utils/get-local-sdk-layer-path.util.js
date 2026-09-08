"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getLocalSdkLayerPath", {
    enumerable: true,
    get: function() {
        return getLocalSdkLayerPath;
    }
});
const _path = require("path");
const _logicfunctionexecutortmpdirfolder = require("../../../constants/logic-function-executor-tmpdir-folder");
const getLocalSdkLayerPath = ({ workspaceId, applicationUniversalIdentifier })=>(0, _path.join)(_logicfunctionexecutortmpdirfolder.LOGIC_FUNCTION_EXECUTOR_TMPDIR_FOLDER, 'sdk', `${workspaceId}-${applicationUniversalIdentifier}`);

//# sourceMappingURL=get-local-sdk-layer-path.util.js.map