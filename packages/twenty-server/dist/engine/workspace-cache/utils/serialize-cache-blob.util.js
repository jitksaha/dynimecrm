"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get deserializeCacheBlob () {
        return deserializeCacheBlob;
    },
    get serializeCacheBlob () {
        return serializeCacheBlob;
    }
});
const serializeCacheBlob = (value)=>Buffer.from(JSON.stringify(value), 'utf8');
const deserializeCacheBlob = (blob)=>JSON.parse(blob.toString('utf8'));

//# sourceMappingURL=serialize-cache-blob.util.js.map