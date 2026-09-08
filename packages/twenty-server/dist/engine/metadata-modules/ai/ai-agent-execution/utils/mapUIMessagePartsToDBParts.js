"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mapUIMessagePartsToDBParts", {
    enumerable: true,
    get: function() {
        return mapUIMessagePartsToDBParts;
    }
});
const _ai = require("ai");
const _ai1 = require("twenty-shared/ai");
const mapUIMessagePartsToDBParts = (uiMessageParts, messageId, workspaceId)=>{
    return uiMessageParts.map((part, index)=>{
        const basePart = {
            messageId,
            orderIndex: index,
            type: part.type,
            workspaceId
        };
        switch(part.type){
            case 'text':
                return {
                    ...basePart,
                    textContent: part.text
                };
            case 'reasoning':
                return {
                    ...basePart,
                    reasoningContent: part.text,
                    providerMetadata: part.providerMetadata ?? null
                };
            case 'file':
                {
                    if (!(0, _ai1.isExtendedFileUIPart)(part)) {
                        throw new Error('Expected file part');
                    }
                    return {
                        ...basePart,
                        fileFilename: part.filename,
                        fileId: part.fileId
                    };
                }
            case 'source-url':
                return {
                    ...basePart,
                    sourceUrlSourceId: part.sourceId,
                    sourceUrlUrl: part.url,
                    sourceUrlTitle: part.title,
                    providerMetadata: part.providerMetadata ?? null
                };
            case 'source-document':
                return {
                    ...basePart,
                    sourceDocumentSourceId: part.sourceId,
                    sourceDocumentMediaType: part.mediaType,
                    sourceDocumentTitle: part.title,
                    sourceDocumentFilename: part.filename,
                    providerMetadata: part.providerMetadata ?? null
                };
            case 'step-start':
                return basePart;
            case 'data-compaction':
                return null;
            case 'data-routing-status':
                return {
                    ...basePart,
                    textContent: part.data.text,
                    state: part.data.state
                };
            case 'data-code-execution':
                // Code execution parts are streamed during execution but don't need
                // to be persisted - the final result is captured in the tool part
                return null;
            case 'data-thread-title':
                // Thread title is a transient notification for the client
                return null;
            default:
                {
                    if ((0, _ai.isToolUIPart)(part)) {
                        return {
                            ...basePart,
                            toolName: (0, _ai.getToolName)(part),
                            toolCallId: part.toolCallId,
                            // A nullish input yields an invalid tool_use block (#21695).
                            toolInput: part.input ?? {},
                            toolOutput: part.output,
                            errorMessage: part.errorText,
                            state: part.state,
                            providerExecuted: part.providerExecuted ?? null,
                            providerMetadata: part.callProviderMetadata ?? null
                        };
                    }
                    throw new Error(`Unsupported part type: ${part.type}`);
                }
        }
    }).filter((part)=>part !== null);
};

//# sourceMappingURL=mapUIMessagePartsToDBParts.js.map