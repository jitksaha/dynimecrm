"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUrlWithPathnameAndSearchParams", {
    enumerable: true,
    get: function() {
        return buildUrlWithPathnameAndSearchParams;
    }
});
const _appendsearchparamstourlutil = require("./append-search-params-to-url.util");
const buildUrlWithPathnameAndSearchParams = ({ baseUrl, pathname, searchParams, hash })=>{
    const url = baseUrl;
    if (pathname) {
        url.pathname = pathname;
    }
    if (searchParams) {
        (0, _appendsearchparamstourlutil.appendSearchParamsToUrl)(url, searchParams);
    }
    if (hash) {
        url.hash = hash;
    }
    return url;
};

//# sourceMappingURL=build-url-with-pathname-and-search-params.util.js.map