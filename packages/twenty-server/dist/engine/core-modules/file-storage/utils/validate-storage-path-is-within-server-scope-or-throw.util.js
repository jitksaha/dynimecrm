"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateStoragePathIsWithinServerScopeOrThrow", {
    enumerable: true,
    get: function() {
        return validateStoragePathIsWithinServerScopeOrThrow;
    }
});
const _path = require("path");
const _filestorageexception = require("../interfaces/file-storage-exception");
const _assertstoragepathissafeutil = require("./assert-storage-path-is-safe.util");
const _serverfilestorageprefixconstant = require("../constants/server-file-storage-prefix.constant");
const validateStoragePathIsWithinServerScopeOrThrow = ({ onStoragePath, fileFolder })=>{
    (0, _assertstoragepathissafeutil.assertStoragePathIsSafe)(onStoragePath);
    const expectedPrefix = (0, _path.join)(_serverfilestorageprefixconstant.SERVER_FILE_STORAGE_PREFIX, fileFolder);
    const normalizedPath = (0, _path.normalize)(onStoragePath);
    const normalizedPrefix = (0, _path.normalize)(expectedPrefix + '/');
    if (!normalizedPath.startsWith(normalizedPrefix)) {
        throw new _filestorageexception.FileStorageException('Invalid storage path: resolved path escapes the server scope', _filestorageexception.FileStorageExceptionCode.ACCESS_DENIED);
    }
};

//# sourceMappingURL=validate-storage-path-is-within-server-scope-or-throw.util.js.map