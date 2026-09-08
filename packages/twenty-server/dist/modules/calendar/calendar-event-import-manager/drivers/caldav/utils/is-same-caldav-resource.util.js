"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isSameCalDavResource", {
    enumerable: true,
    get: function() {
        return isSameCalDavResource;
    }
});
const _utils = require("twenty-shared/utils");
const isSameCalDavResource = (href, otherHref)=>{
    const resolvedHref = URL.parse(href, otherHref);
    const resolvedOtherHref = URL.parse(otherHref);
    if (!(0, _utils.isDefined)(resolvedHref) || !(0, _utils.isDefined)(resolvedOtherHref)) {
        return false;
    }
    return resolvedHref.origin === resolvedOtherHref.origin && resolvedHref.pathname.replace(/\/+$/, '') === resolvedOtherHref.pathname.replace(/\/+$/, '');
};

//# sourceMappingURL=is-same-caldav-resource.util.js.map