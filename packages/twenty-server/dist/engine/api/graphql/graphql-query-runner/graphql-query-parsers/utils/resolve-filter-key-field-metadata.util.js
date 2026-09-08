"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveFilterKeyFieldMetadata", {
    enumerable: true,
    get: function() {
        return resolveFilterKeyFieldMetadata;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const resolveFilterKeyFieldMetadata = ({ filterKey, fieldIdByName, fieldIdByJoinColumnName, flatFieldMetadataMaps })=>{
    const isReferencedByFieldName = (0, _utils.isDefined)(fieldIdByName[filterKey]);
    const fieldMetadataId = fieldIdByName[filterKey] ?? fieldIdByJoinColumnName[filterKey];
    const fieldMetadata = (0, _utils.isDefined)(fieldMetadataId) ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: fieldMetadataId,
        flatEntityMaps: flatFieldMetadataMaps
    }) : undefined;
    return {
        fieldMetadata,
        isReferencedByFieldName
    };
};

//# sourceMappingURL=resolve-filter-key-field-metadata.util.js.map