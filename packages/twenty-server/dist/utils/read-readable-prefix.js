"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "readReadablePrefix", {
    enumerable: true,
    get: function() {
        return readReadablePrefix;
    }
});
const readReadablePrefix = async (stream, maxBytes)=>{
    const chunks = [];
    let collected = 0;
    let settled = false;
    return new Promise((resolve, reject)=>{
        const onData = (chunk)=>{
            if (settled) {
                return;
            }
            const remaining = maxBytes - collected;
            const boundedChunk = chunk.length > remaining ? chunk.subarray(0, remaining) : chunk;
            chunks.push(boundedChunk);
            collected += boundedChunk.length;
            if (collected >= maxBytes) {
                settled = true;
                stream.off('data', onData);
                stream.off('end', onEnd);
                stream.destroy();
                resolve(Buffer.concat(chunks));
            }
        };
        const onEnd = ()=>{
            if (settled) {
                return;
            }
            settled = true;
            resolve(Buffer.concat(chunks));
        };
        const onError = (error)=>{
            if (settled) {
                return;
            }
            settled = true;
            reject(error);
        };
        stream.on('data', onData);
        stream.on('end', onEnd);
        stream.on('error', onError);
    });
};

//# sourceMappingURL=read-readable-prefix.js.map