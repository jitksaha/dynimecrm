"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatBytes", {
    enumerable: true,
    get: function() {
        return formatBytes;
    }
});
const formatBytes = (bytes)=>bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} kB` : `${bytes} B`;

//# sourceMappingURL=format-bytes.util.js.map