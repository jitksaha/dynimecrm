"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toRelativeGraphUrl", {
    enumerable: true,
    get: function() {
        return toRelativeGraphUrl;
    }
});
const _guards = require("@sniptt/guards");
const GRAPH_VERSION_SEGMENTS = [
    'beta',
    'v1.0'
];
const toRelativeGraphUrl = (url)=>{
    if (!(0, _guards.isNonEmptyString)(url) || !url.startsWith('http')) {
        return url;
    }
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/').filter(_guards.isNonEmptyString);
    if (pathSegments.length > 0 && GRAPH_VERSION_SEGMENTS.includes(pathSegments[0])) {
        pathSegments.shift();
    }
    return `/${pathSegments.join('/')}${parsedUrl.search}`;
};

//# sourceMappingURL=to-relative-graph-url.util.js.map