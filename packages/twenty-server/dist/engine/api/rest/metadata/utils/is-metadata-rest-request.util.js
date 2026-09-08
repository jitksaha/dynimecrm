"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isMetadataRestRequest", {
    enumerable: true,
    get: function() {
        return isMetadataRestRequest;
    }
});
const isMetadataRestRequest = (request)=>request.originalUrl.startsWith('/rest/metadata/');

//# sourceMappingURL=is-metadata-rest-request.util.js.map