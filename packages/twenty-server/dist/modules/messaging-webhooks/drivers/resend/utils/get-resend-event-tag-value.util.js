"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getResendEventTagValue", {
    enumerable: true,
    get: function() {
        return getResendEventTagValue;
    }
});
const _guards = require("@sniptt/guards");
const getResendEventTagValue = (tags, tagName)=>{
    if (!tags) {
        return null;
    }
    if (Array.isArray(tags)) {
        const matchingTag = tags.find((tag)=>tag.name === tagName);
        return (0, _guards.isNonEmptyString)(matchingTag?.value) ? matchingTag.value : null;
    }
    const value = tags[tagName];
    return (0, _guards.isNonEmptyString)(value) ? value : null;
};

//# sourceMappingURL=get-resend-event-tag-value.util.js.map