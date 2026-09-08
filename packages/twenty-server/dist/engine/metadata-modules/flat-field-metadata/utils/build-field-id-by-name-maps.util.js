"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildFieldIdByNameMaps", {
    enumerable: true,
    get: function() {
        return buildFieldIdByNameMaps;
    }
});
const _utils = require("twenty-shared/utils");
const _buildfieldbyobjectidandnamekeyutil = require("./build-field-by-object-id-and-name-key.util");
const buildFieldIdByNameMaps = (flatFieldMetadataMaps)=>{
    const fieldIdByObjectIdAndName = new Map();
    const fieldById = new Map();
    for (const fieldMetadata of Object.values(flatFieldMetadataMaps.byUniversalIdentifier)){
        if (!(0, _utils.isDefined)(fieldMetadata)) {
            continue;
        }
        fieldIdByObjectIdAndName.set((0, _buildfieldbyobjectidandnamekeyutil.buildFieldByObjectIdAndNameKey)(fieldMetadata.objectMetadataId, fieldMetadata.name), fieldMetadata.id);
        fieldById.set(fieldMetadata.id, {
            type: fieldMetadata.type
        });
    }
    return {
        fieldIdByObjectIdAndName,
        fieldById
    };
};

//# sourceMappingURL=build-field-id-by-name-maps.util.js.map