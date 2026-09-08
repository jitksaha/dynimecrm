"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getImapFolderPath", {
    enumerable: true,
    get: function() {
        return getImapFolderPath;
    }
});
const _guards = require("@sniptt/guards");
const _normalizeimapunicodeutil = require("./normalize-imap-unicode.util");
const getImapFolderPath = (externalId, client)=>{
    if (!(0, _guards.isNonEmptyString)(externalId)) {
        return null;
    }
    const lastColonIndex = externalId.lastIndexOf(':');
    if (lastColonIndex === -1) {
        return (0, _normalizeimapunicodeutil.normalizeImapUnicode)(externalId, client);
    }
    const suffix = externalId.slice(lastColonIndex + 1);
    if (!/^\d+$/.test(suffix)) {
        return (0, _normalizeimapunicodeutil.normalizeImapUnicode)(externalId, client);
    }
    return (0, _normalizeimapunicodeutil.normalizeImapUnicode)(externalId.slice(0, lastColonIndex), client);
};

//# sourceMappingURL=get-imap-folder-path.util.js.map