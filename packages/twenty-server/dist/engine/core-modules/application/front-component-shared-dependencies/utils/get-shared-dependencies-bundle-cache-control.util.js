"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getSharedDependenciesBundleCacheControl", {
    enumerable: true,
    get: function() {
        return getSharedDependenciesBundleCacheControl;
    }
});
const _utils = require("twenty-shared/utils");
const _filefolderinterface = require("../../../file/interfaces/file-folder.interface");
const getSharedDependenciesBundleCacheControl = ({ requestedChecksum, frontComponentSharedDependenciesChecksum })=>(0, _utils.isDefined)(requestedChecksum) && requestedChecksum === frontComponentSharedDependenciesChecksum ? _filefolderinterface.IMMUTABLE_FILE_CACHE_CONTROL : _filefolderinterface.PRESIGNED_URL_NO_STORE_CACHE_CONTROL;

//# sourceMappingURL=get-shared-dependencies-bundle-cache-control.util.js.map