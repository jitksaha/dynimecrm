"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeMessageText", {
    enumerable: true,
    get: function() {
        return normalizeMessageText;
    }
});
const normalizeMessageText = (text)=>text.replace(/\r\n?/g, '\n').replace(/ /g, ' ').replace(/[^\S\n]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();

//# sourceMappingURL=normalize-message-text.util.js.map