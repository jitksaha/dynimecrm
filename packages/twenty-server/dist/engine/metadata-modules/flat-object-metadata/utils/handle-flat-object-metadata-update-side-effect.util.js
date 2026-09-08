"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "handleFlatObjectMetadataUpdateSideEffect", {
    enumerable: true,
    get: function() {
        return handleFlatObjectMetadataUpdateSideEffect;
    }
});
const _utils = require("twenty-shared/utils");
const _computesearchfieldmetadatatocreateonlabelidentifierupdateutil = require("./compute-search-field-metadata-to-create-on-label-identifier-update.util");
const _recomputeindexafterflatobjectmetadatasingularnameupdateutil = require("./recompute-index-after-flat-object-metadata-singular-name-update.util");
const _recomputeviewfieldidentifierafterflatobjectidentifierupdateutil = require("./recompute-view-field-identifier-after-flat-object-identifier-update.util");
const _renamerelatedmorphfieldonobjectnamesupdateutil = require("./rename-related-morph-field-on-object-names-update.util");
const handleFlatObjectMetadataUpdateSideEffect = ({ flatIndexMaps, flatFieldMetadataMaps, flatObjectMetadataMaps, flatViewFieldMaps, flatViewMaps, flatSearchFieldMetadataMaps, fromFlatObjectMetadata, toFlatObjectMetadata })=>{
    const { morphRelatedFlatIndexesToUpdate, morphFlatFieldMetadatasToUpdate } = fromFlatObjectMetadata.nameSingular !== toFlatObjectMetadata.nameSingular || fromFlatObjectMetadata.namePlural !== toFlatObjectMetadata.namePlural ? (0, _renamerelatedmorphfieldonobjectnamesupdateutil.renameRelatedMorphFieldOnObjectNamesUpdate)({
        flatFieldMetadataMaps,
        fromFlatObjectMetadata,
        toFlatObjectMetadata,
        flatObjectMetadataMaps,
        flatIndexMaps,
        systemSideEffectMorphFieldsOnly: false
    }) : {
        morphRelatedFlatIndexesToUpdate: [],
        morphFlatFieldMetadatasToUpdate: []
    };
    const flatIndexMetadatasToUpdate = fromFlatObjectMetadata.nameSingular !== toFlatObjectMetadata.nameSingular ? (0, _recomputeindexafterflatobjectmetadatasingularnameupdateutil.recomputeIndexAfterFlatObjectMetadataSingularNameUpdate)({
        flatFieldMetadataMaps,
        existingFlatObjectMetadata: fromFlatObjectMetadata,
        flatIndexMaps,
        updatedSingularName: toFlatObjectMetadata.nameSingular
    }) : [];
    const { flatViewFieldsToCreate, flatViewFieldsToUpdate } = fromFlatObjectMetadata.labelIdentifierFieldMetadataId !== toFlatObjectMetadata.labelIdentifierFieldMetadataId && (0, _utils.isDefined)(toFlatObjectMetadata.labelIdentifierFieldMetadataId) && (0, _utils.isDefined)(fromFlatObjectMetadata.labelIdentifierFieldMetadataId) ? (0, _recomputeviewfieldidentifierafterflatobjectidentifierupdateutil.recomputeViewFieldIdentifierAfterFlatObjectIdentifierUpdate)({
        existingFlatObjectMetadata: fromFlatObjectMetadata,
        flatViewFieldMaps,
        flatViewMaps,
        flatFieldMetadataMaps,
        updatedLabelIdentifierFieldMetadataId: toFlatObjectMetadata.labelIdentifierFieldMetadataId
    }) : {
        flatViewFieldsToCreate: [],
        flatViewFieldsToUpdate: []
    };
    const { searchFieldMetadatasToCreate } = (0, _computesearchfieldmetadatatocreateonlabelidentifierupdateutil.computeSearchFieldMetadataToCreateOnLabelIdentifierUpdate)({
        fromFlatObjectMetadata,
        toFlatObjectMetadata,
        flatFieldMetadataMaps,
        flatSearchFieldMetadataMaps
    });
    return {
        flatIndexMetadatasToUpdate: [
            ...morphRelatedFlatIndexesToUpdate,
            ...flatIndexMetadatasToUpdate
        ],
        flatViewFieldsToCreate,
        flatViewFieldsToUpdate,
        otherObjectFlatFieldMetadatasToUpdate: morphFlatFieldMetadatasToUpdate,
        searchFieldMetadatasToCreate
    };
};

//# sourceMappingURL=handle-flat-object-metadata-update-side-effect.util.js.map