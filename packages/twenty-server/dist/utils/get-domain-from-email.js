"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDomainFromEmail", {
    enumerable: true,
    get: function() {
        return getDomainFromEmail;
    }
});
const getDomainFromEmail = (email)=>{
    const lastAtIndex = email.lastIndexOf('@');
    if (lastAtIndex === -1) {
        return undefined;
    }
    return email.slice(lastAtIndex + 1);
};

//# sourceMappingURL=get-domain-from-email.js.map