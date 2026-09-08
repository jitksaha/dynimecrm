"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getLocalDepsLayerPath", {
    enumerable: true,
    get: function() {
        return getLocalDepsLayerPath;
    }
});
const _path = require("path");
const _logicfunctionexecutortmpdirfolder = require("../../../constants/logic-function-executor-tmpdir-folder");
const getLocalDepsLayerPath = (flatApplication)=>{
    const checksum = flatApplication.yarnLockChecksum ?? 'default';
    return (0, _path.join)(_logicfunctionexecutortmpdirfolder.LOGIC_FUNCTION_EXECUTOR_TMPDIR_FOLDER, 'deps', checksum);
};

//# sourceMappingURL=get-local-deps-layer-path.util.js.map