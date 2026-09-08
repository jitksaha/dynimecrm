"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRequestBaseUrl", {
    enumerable: true,
    get: function() {
        return getRequestBaseUrl;
    }
});
const getRequestBaseUrl = (request)=>`${request.protocol}://${request.get('host')}`;

//# sourceMappingURL=get-request-base-url.util.js.map