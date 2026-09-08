// Re-wraps zip entries under a new prefix path without extracting to disk.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "reprefixLambdaZipEntries", {
    enumerable: true,
    get: function() {
        return reprefixLambdaZipEntries;
    }
});
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const reprefixLambdaZipEntries = async ({ sourceBuffer, prefix })=>{
    const { default: unzipper } = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("unzipper")));
    const archiver = (await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("archiver")))).default;
    const directory = await unzipper.Open.buffer(sourceBuffer);
    const archive = archiver('zip', {
        zlib: {
            level: 9
        }
    });
    const chunks = [];
    archive.on('data', (chunk)=>chunks.push(chunk));
    for (const entry of directory.files){
        if (entry.type === 'Directory') {
            continue;
        }
        archive.append(entry.stream(), {
            name: `${prefix}/${entry.path}`
        });
    }
    await new Promise((resolve, reject)=>{
        archive.on('end', resolve);
        archive.on('error', reject);
        void archive.finalize();
    });
    return Buffer.concat(chunks);
};

//# sourceMappingURL=reprefix-lambda-zip-entries.util.js.map