"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeImapUnicode", {
    enumerable: true,
    get: function() {
        return normalizeImapUnicode;
    }
});
const normalizeImapUnicode = (value, client)=>client?.enabled.has('UTF8=ACCEPT') ? value.normalize('NFC') : value;

//# sourceMappingURL=normalize-imap-unicode.util.js.map