"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "settings", {
    enumerable: true,
    get: function() {
        return settings;
    }
});
const settings = {
    storage: {
        maxFileSize: '10MB',
        // Direct uploads (createFileUpload/completeFileUpload) stream to storage
        // without transiting the server memory, so they get a much higher cap
        // than multipart uploads.
        maxDirectUploadFileSize: '1GB'
    },
    minLengthOfStringForDuplicateCheck: 3,
    maxVisibleViewFields: 30
};

//# sourceMappingURL=index.js.map