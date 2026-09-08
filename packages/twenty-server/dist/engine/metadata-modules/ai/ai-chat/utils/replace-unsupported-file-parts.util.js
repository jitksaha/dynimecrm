"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "replaceUnsupportedFileParts", {
    enumerable: true,
    get: function() {
        return replaceUnsupportedFileParts;
    }
});
const _ai = require("twenty-shared/ai");
const _codeinterpretermimetypesconstant = require("../constants/code-interpreter-mime-types.constant");
const _getnativemimetypesformodalitiesutil = require("./get-native-mime-types-for-modalities.util");
const replaceUnsupportedFileParts = (messages, modalities = [], isCodeInterpreterEnabled)=>{
    const nativeMimeTypes = (0, _getnativemimetypesformodalitiesutil.getNativeMimeTypesForModalities)(modalities);
    return messages.map((message)=>{
        if (message.role !== 'user' || !message.parts) {
            return message;
        }
        const newParts = [];
        for (const part of message.parts){
            if ((0, _ai.isExtendedFileUIPart)(part)) {
                const mimeType = part.mediaType ?? '';
                const isSupported = isCodeInterpreterEnabled && _codeinterpretermimetypesconstant.CODE_INTERPRETER_MIME_TYPES.has(mimeType) || nativeMimeTypes.has(mimeType);
                if (isSupported) {
                    newParts.push(part);
                } else {
                    const filename = part.filename ?? 'uploaded_file';
                    newParts.push({
                        type: 'text',
                        text: `[Attached file: ${filename} (type: ${mimeType || 'unknown'}) — file type is not supported for direct analysis]`
                    });
                }
            } else {
                newParts.push(part);
            }
        }
        return {
            ...message,
            parts: newParts
        };
    });
};

//# sourceMappingURL=replace-unsupported-file-parts.util.js.map