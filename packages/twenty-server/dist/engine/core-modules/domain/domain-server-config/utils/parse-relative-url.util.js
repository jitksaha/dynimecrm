// A redirect location coming from the front can carry a query string and a
// tab anchor (e.g. /object/company/<recordId>#<tabId>). Assigning the whole
// string to URL.pathname percent-encodes '?' and '#' into the path, so split
// it into parts the URL API can reassemble. Parsing against a fixed base also
// drops any host smuggled into the value, keeping redirects on our domain.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseRelativeUrl", {
    enumerable: true,
    get: function() {
        return parseRelativeUrl;
    }
});
const parseRelativeUrl = (relativeUrl)=>{
    const { pathname, searchParams, hash } = new URL(relativeUrl, 'http://relative-url.invalid');
    return {
        pathname,
        searchParams: Object.fromEntries(searchParams.entries()),
        hash
    };
};

//# sourceMappingURL=parse-relative-url.util.js.map