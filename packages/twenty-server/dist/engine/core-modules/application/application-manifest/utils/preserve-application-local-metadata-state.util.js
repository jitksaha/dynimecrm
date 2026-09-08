"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "preserveApplicationLocalMetadataState", {
    enumerable: true,
    get: function() {
        return preserveApplicationLocalMetadataState;
    }
});
const APPLICATION_LOCAL_METADATA_PROPERTIES = [
    'overrides',
    'universalOverrides',
    'isActive'
];
const preserveApplicationLocalMetadataState = ({ existingEntity, manifestEntity })=>{
    const existingEntityRecord = existingEntity;
    const mergedEntityRecord = {
        ...manifestEntity
    };
    const supportsOverrides = [
        'overrides',
        'universalOverrides'
    ].some((property)=>property in existingEntityRecord && property in mergedEntityRecord);
    if (!supportsOverrides) {
        return manifestEntity;
    }
    for (const property of APPLICATION_LOCAL_METADATA_PROPERTIES){
        if (property in existingEntityRecord && property in mergedEntityRecord) {
            mergedEntityRecord[property] = existingEntityRecord[property];
        }
    }
    return mergedEntityRecord;
};

//# sourceMappingURL=preserve-application-local-metadata-state.util.js.map