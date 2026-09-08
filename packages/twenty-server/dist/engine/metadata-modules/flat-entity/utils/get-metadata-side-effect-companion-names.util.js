"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getMetadataSideEffectCompanionNames", {
    enumerable: true,
    get: function() {
        return getMetadataSideEffectCompanionNames;
    }
});
const _allmetadatasideeffectcompanionmetadatanamesconstant = require("../constant/all-metadata-side-effect-companion-metadata-names.constant");
const getMetadataSideEffectCompanionNames = (metadataName)=>{
    const companionMetadataNamesByMetadataName = _allmetadatasideeffectcompanionmetadatanamesconstant.ALL_METADATA_SIDE_EFFECT_COMPANION_METADATA_NAMES;
    return companionMetadataNamesByMetadataName[metadataName] ?? [];
};

//# sourceMappingURL=get-metadata-side-effect-companion-names.util.js.map