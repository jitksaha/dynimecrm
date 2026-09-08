"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "compactMetadataOutput", {
    enumerable: true,
    get: function() {
        return compactMetadataOutput;
    }
});
const compactMetadataOutput = (metadata, config)=>{
    const result = {
        ...metadata
    };
    for (const key of config.stripWhenNullish ?? []){
        if (result[key] === null || result[key] === undefined) {
            delete result[key];
        }
    }
    for (const key of config.stripWhenFalse ?? []){
        if (result[key] === false) {
            delete result[key];
        }
    }
    for (const key of config.stripWhenTrue ?? []){
        if (result[key] === true) {
            delete result[key];
        }
    }
    return result;
};

//# sourceMappingURL=compact-metadata-output.util.js.map