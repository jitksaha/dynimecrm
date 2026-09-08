"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getCancelChannel", {
    enumerable: true,
    get: function() {
        return getCancelChannel;
    }
});
const getCancelChannel = (threadId, streamId)=>`ai-stream:cancel:${threadId}:${streamId}`;

//# sourceMappingURL=get-cancel-channel.util.js.map