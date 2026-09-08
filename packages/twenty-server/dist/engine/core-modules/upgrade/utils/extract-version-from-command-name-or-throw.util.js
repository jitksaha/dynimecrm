"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractVersionFromCommandNameOrThrow", {
    enumerable: true,
    get: function() {
        return extractVersionFromCommandNameOrThrow;
    }
});
const extractVersionFromCommandNameOrThrow = (name)=>{
    const firstUnderscore = name.indexOf('_');
    if (firstUnderscore === -1) {
        throw new Error(`Upgrade command name "${name}" does not carry a version prefix`);
    }
    return name.substring(0, firstUnderscore);
};

//# sourceMappingURL=extract-version-from-command-name-or-throw.util.js.map