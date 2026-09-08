"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractCodeInterpreterFiles", {
    enumerable: true,
    get: function() {
        return extractCodeInterpreterFiles;
    }
});
const _ai = require("twenty-shared/ai");
const _codeinterpretermimetypesconstant = require("../constants/code-interpreter-mime-types.constant");
const extractCodeInterpreterFiles = (messages)=>{
    const extractedFiles = [];
    const processedMessages = messages.map((message)=>{
        if (message.role !== 'user' || !message.parts) {
            return message;
        }
        const newParts = [];
        const filesForThisMessage = [];
        for (const part of message.parts){
            if ((0, _ai.isExtendedFileUIPart)(part)) {
                const mimeType = part.mediaType ?? '';
                if (_codeinterpretermimetypesconstant.CODE_INTERPRETER_MIME_TYPES.has(mimeType)) {
                    filesForThisMessage.push({
                        filename: part.filename ?? 'uploaded_file',
                        fileId: part.fileId,
                        mimeType
                    });
                } else {
                    newParts.push(part);
                }
            } else {
                newParts.push(part);
            }
        }
        if (filesForThisMessage.length > 0) {
            extractedFiles.push(...filesForThisMessage);
            const fileList = filesForThisMessage.map((f)=>`- ${f.filename} (${f.mimeType})`).join('\n');
            newParts.push({
                type: 'text',
                text: `\n\n[Files available for code interpreter at /home/user/:\n${fileList}]\n\nUse the code_interpreter tool to analyze these files.`
            });
        }
        return {
            ...message,
            parts: newParts
        };
    });
    return {
        processedMessages,
        extractedFiles
    };
};

//# sourceMappingURL=extract-code-interpreter-files.util.js.map