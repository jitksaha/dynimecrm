"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildAppOAuthCallbackUrl", {
    enumerable: true,
    get: function() {
        return buildAppOAuthCallbackUrl;
    }
});
const _types = require("twenty-shared/types");
const buildAppOAuthCallbackUrl = (serverUrl)=>new URL(`/${_types.ApiPath.Auth}/apps/callback`, serverUrl).toString();

//# sourceMappingURL=build-callback-url.util.js.map