"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isCalDavCollectionHref", {
    enumerable: true,
    get: function() {
        return isCalDavCollectionHref;
    }
});
const _utils = require("twenty-shared/utils");
const _issamecaldavresourceutil = require("./is-same-caldav-resource.util");
const isCalDavCollectionHref = (href, collectionUrl)=>{
    const resolvedHref = URL.parse(href, collectionUrl);
    if (!(0, _utils.isDefined)(resolvedHref)) {
        return false;
    }
    return resolvedHref.pathname.endsWith('/') || (0, _issamecaldavresourceutil.isSameCalDavResource)(href, collectionUrl);
};

//# sourceMappingURL=is-caldav-collection-href.util.js.map