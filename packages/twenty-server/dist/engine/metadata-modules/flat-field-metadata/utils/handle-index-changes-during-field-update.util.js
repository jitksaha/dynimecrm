"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "handleIndexChangesDuringFieldUpdate", {
    enumerable: true,
    get: function() {
        return handleIndexChangesDuringFieldUpdate;
    }
});
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _findfieldrelatedindexutil = require("./find-field-related-index.util");
const _recomputeindexonflatfieldmetadatanameupdateutil = require("./recompute-index-on-flat-field-metadata-name-update.util");
const _issystemuniqueflatindexmetadatautil = require("../../flat-index-metadata/utils/is-system-unique-flat-index-metadata.util");
const FIELD_METADATA_UPDATE_INDEX_SIDE_EFFECT = {
    flatIndexMetadatasToUpdate: [],
    flatIndexMetadatasToDelete: [],
    flatIndexMetadatasToCreate: []
};
const handleIndexChangesDuringFieldUpdate = ({ fromFlatFieldMetadata, toFlatFieldMetadata, flatIndexMaps, flatObjectMetadataMaps, flatFieldMetadataMaps })=>{
    if (fromFlatFieldMetadata.name === toFlatFieldMetadata.name) {
        return {
            status: 'success',
            result: FIELD_METADATA_UPDATE_INDEX_SIDE_EFFECT
        };
    }
    const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
        flatEntityMaps: flatObjectMetadataMaps,
        flatEntityId: fromFlatFieldMetadata.objectMetadataId
    });
    const relatedIndexes = (0, _findfieldrelatedindexutil.findFieldRelatedIndexes)({
        flatFieldMetadata: fromFlatFieldMetadata,
        flatObjectMetadata,
        flatIndexMaps
    }).filter((flatIndexMetadata)=>!(0, _issystemuniqueflatindexmetadatautil.isSystemUniqueFlatIndexMetadata)(flatIndexMetadata));
    if (relatedIndexes.length === 0) {
        return {
            status: 'success',
            result: FIELD_METADATA_UPDATE_INDEX_SIDE_EFFECT
        };
    }
    const updatedIndexes = (0, _recomputeindexonflatfieldmetadatanameupdateutil.recomputeIndexOnFlatFieldMetadataNameUpdate)({
        flatFieldMetadataMaps,
        flatObjectMetadata,
        fromFlatFieldMetadata,
        toFlatFieldMetadata: {
            name: toFlatFieldMetadata.name,
            isUnique: toFlatFieldMetadata.isUnique
        },
        relatedFlatIndexMetadata: relatedIndexes
    });
    return {
        status: 'success',
        result: {
            ...FIELD_METADATA_UPDATE_INDEX_SIDE_EFFECT,
            flatIndexMetadatasToUpdate: updatedIndexes
        }
    };
};

//# sourceMappingURL=handle-index-changes-during-field-update.util.js.map