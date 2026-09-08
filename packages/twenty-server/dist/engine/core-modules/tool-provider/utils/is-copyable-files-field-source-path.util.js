"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isCopyableFilesFieldSourcePath", {
    enumerable: true,
    get: function() {
        return isCopyableFilesFieldSourcePath;
    }
});
const _filesfieldcopyablesourcefoldersconstant = require("../constants/files-field-copyable-source-folders.constant");
const isCopyableFilesFieldSourcePath = (path)=>_filesfieldcopyablesourcefoldersconstant.FILES_FIELD_COPYABLE_SOURCE_FOLDERS.some((folder)=>path.startsWith(`${folder}/`));

//# sourceMappingURL=is-copyable-files-field-source-path.util.js.map