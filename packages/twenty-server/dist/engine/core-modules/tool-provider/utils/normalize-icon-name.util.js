"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeIconName", {
    enumerable: true,
    get: function() {
        return normalizeIconName;
    }
});
const _guards = require("@sniptt/guards");
const ICON_NAME_PATTERN = /^Icon[A-Za-z0-9]+$/;
const normalizeIconName = (requestedIconName)=>{
    if (!(0, _guards.isNonEmptyString)(requestedIconName)) {
        return undefined;
    }
    const trimmedIconName = requestedIconName.trim();
    if (ICON_NAME_PATTERN.test(trimmedIconName)) {
        return trimmedIconName;
    }
    const words = trimmedIconName.replace(/^icon[\s_-]*/i, '').split(/[^A-Za-z0-9]+/).filter((word)=>word.length > 0).map((word)=>word === word.toUpperCase() ? word.charAt(0) + word.slice(1).toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1));
    if (words.length === 0) {
        return undefined;
    }
    const normalizedIconName = `Icon${words.join('')}`;
    return ICON_NAME_PATTERN.test(normalizedIconName) ? normalizedIconName : undefined;
};

//# sourceMappingURL=normalize-icon-name.util.js.map