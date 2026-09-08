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
    get FileUploadException () {
        return FileUploadException;
    },
    get FileUploadExceptionCode () {
        return FileUploadExceptionCode;
    }
});
const _customexception = require("../../../../utils/custom-exception");
var FileUploadExceptionCode = /*#__PURE__*/ function(FileUploadExceptionCode) {
    FileUploadExceptionCode["BAD_REQUEST"] = "BAD_REQUEST";
    FileUploadExceptionCode["FILE_NOT_FOUND"] = "FILE_NOT_FOUND";
    FileUploadExceptionCode["FILE_NOT_UPLOADED"] = "FILE_NOT_UPLOADED";
    FileUploadExceptionCode["FILE_SIZE_MISMATCH"] = "FILE_SIZE_MISMATCH";
    FileUploadExceptionCode["FILE_TOO_LARGE"] = "FILE_TOO_LARGE";
    return FileUploadExceptionCode;
}({});
let FileUploadException = class FileUploadException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage }){
        super(message, code, {
            userFriendlyMessage
        });
    }
};

//# sourceMappingURL=file-upload.exception.js.map