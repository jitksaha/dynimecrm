"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "collectUploadedFileReferences", {
    enumerable: true,
    get: function() {
        return collectUploadedFileReferences;
    }
});
const _ai = require("twenty-shared/ai");
const _utils = require("twenty-shared/utils");
const collectUploadedFileReferences = (messages)=>{
    const referencesByFileId = new Map();
    for (const message of messages){
        if (message.role !== 'user' || !(0, _utils.isDefined)(message.parts)) {
            continue;
        }
        for (const part of message.parts){
            if ((0, _ai.isExtendedFileUIPart)(part)) {
                referencesByFileId.set(part.fileId, {
                    filename: part.filename ?? 'uploaded_file',
                    fileId: part.fileId
                });
            }
        }
    }
    return [
        ...referencesByFileId.values()
    ];
};

//# sourceMappingURL=collect-uploaded-file-references.util.js.map