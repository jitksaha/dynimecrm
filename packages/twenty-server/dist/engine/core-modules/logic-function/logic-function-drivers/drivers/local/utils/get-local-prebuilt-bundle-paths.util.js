"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getLocalInstalledBundlePath () {
        return getLocalInstalledBundlePath;
    },
    get getLocalInstalledChecksumPath () {
        return getLocalInstalledChecksumPath;
    },
    get getLocalPrebuiltBundleDir () {
        return getLocalPrebuiltBundleDir;
    }
});
const _path = require("path");
const _logicfunctionexecutortmpdirfolder = require("../../../constants/logic-function-executor-tmpdir-folder");
const _localdriverconstant = require("../constants/local-driver.constant");
const getLocalPrebuiltBundleDir = (flatLogicFunction)=>(0, _path.join)(_logicfunctionexecutortmpdirfolder.LOGIC_FUNCTION_EXECUTOR_TMPDIR_FOLDER, 'prebuilt', flatLogicFunction.id);
const getLocalInstalledBundlePath = (flatLogicFunction)=>(0, _path.join)(getLocalPrebuiltBundleDir(flatLogicFunction), _localdriverconstant.PREBUILT_BUNDLE_FILE_NAME);
const getLocalInstalledChecksumPath = (flatLogicFunction)=>(0, _path.join)(getLocalPrebuiltBundleDir(flatLogicFunction), _localdriverconstant.PREBUILT_CHECKSUM_FILE_NAME);

//# sourceMappingURL=get-local-prebuilt-bundle-paths.util.js.map