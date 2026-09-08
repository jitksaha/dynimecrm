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
    get FLAT_FIELD_METADATA_UPDATE_EMPTY_SIDE_EFFECTS () {
        return FLAT_FIELD_METADATA_UPDATE_EMPTY_SIDE_EFFECTS;
    },
    get handleFlatFieldMetadataUpdateSideEffect () {
        return handleFlatFieldMetadataUpdateSideEffect;
    }
});
const _handleenumflatfieldmetadataupdatesideeffectsutil = require("./handle-enum-flat-field-metadata-update-side-effects.util");
const _handlefieldmetadatadeactivationsideeffectsutil = require("./handle-field-metadata-deactivation-side-effects.util");
const _handleindexchangesduringfieldupdateutil = require("./handle-index-changes-during-field-update.util");
const _isenumflatfieldmetadatautil = require("./is-enum-flat-field-metadata.util");
const FLAT_FIELD_METADATA_UPDATE_EMPTY_SIDE_EFFECTS = {
    flatIndexMetadatasToUpdate: [],
    flatViewFiltersToDelete: [],
    flatViewFiltersToUpdate: [],
    flatViewGroupsToCreate: [],
    flatViewGroupsToDelete: [],
    flatIndexMetadatasToDelete: [],
    flatIndexMetadatasToCreate: [],
    flatViewGroupsToUpdate: [],
    flatViewsToDelete: [],
    flatViewFieldsToDelete: [],
    flatViewsToUpdate: []
};
const handleFlatFieldMetadataUpdateSideEffect = ({ fromFlatFieldMetadata, toFlatFieldMetadata, flatObjectMetadataMaps, flatIndexMaps, flatFieldMetadataMaps, flatViewFilterMaps, flatViewGroupMaps, flatViewMaps, flatViewFieldMaps })=>{
    const sideEffectResult = structuredClone(FLAT_FIELD_METADATA_UPDATE_EMPTY_SIDE_EFFECTS);
    const isDeactivation = fromFlatFieldMetadata.isActive === true && toFlatFieldMetadata.isActive === false;
    if (isDeactivation) {
        const { flatViewsToDelete, flatViewFieldsToDelete, flatViewFiltersToDelete, flatViewsToUpdate } = (0, _handlefieldmetadatadeactivationsideeffectsutil.handleFieldMetadataDeactivationSideEffects)({
            flatViewMaps,
            fromFlatFieldMetadata,
            toFlatFieldMetadata,
            flatViewFieldMaps,
            flatViewFilterMaps,
            flatViewGroupMaps
        });
        sideEffectResult.flatViewsToUpdate.push(...flatViewsToUpdate);
        sideEffectResult.flatViewsToDelete.push(...flatViewsToDelete);
        sideEffectResult.flatViewFieldsToDelete.push(...flatViewFieldsToDelete);
        sideEffectResult.flatViewFiltersToDelete.push(...flatViewFiltersToDelete);
    } else if ((0, _isenumflatfieldmetadatautil.isEnumFlatFieldMetadata)(toFlatFieldMetadata) && (0, _isenumflatfieldmetadatautil.isEnumFlatFieldMetadata)(fromFlatFieldMetadata)) {
        const { flatViewFiltersToDelete, flatViewFiltersToUpdate, flatViewGroupsToCreate, flatViewGroupsToDelete, flatViewGroupsToUpdate } = (0, _handleenumflatfieldmetadataupdatesideeffectsutil.handleEnumFlatFieldMetadataUpdateSideEffects)({
            flatViewMaps,
            flatViewFilterMaps,
            flatViewGroupMaps,
            fromFlatFieldMetadata,
            toFlatFieldMetadata
        });
        sideEffectResult.flatViewFiltersToUpdate.push(...flatViewFiltersToUpdate);
        sideEffectResult.flatViewGroupsToCreate.push(...flatViewGroupsToCreate);
        sideEffectResult.flatViewGroupsToDelete.push(...flatViewGroupsToDelete);
        sideEffectResult.flatViewGroupsToUpdate.push(...flatViewGroupsToUpdate);
        sideEffectResult.flatViewFiltersToDelete.push(...flatViewFiltersToDelete);
    }
    const indexChangesSideEffectResult = (0, _handleindexchangesduringfieldupdateutil.handleIndexChangesDuringFieldUpdate)({
        fromFlatFieldMetadata,
        toFlatFieldMetadata,
        flatIndexMaps,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps
    });
    if (indexChangesSideEffectResult.status === 'fail') {
        return indexChangesSideEffectResult;
    }
    const { flatIndexMetadatasToUpdate, flatIndexMetadatasToCreate, flatIndexMetadatasToDelete } = indexChangesSideEffectResult.result;
    sideEffectResult.flatIndexMetadatasToUpdate.push(...flatIndexMetadatasToUpdate);
    sideEffectResult.flatIndexMetadatasToCreate.push(...flatIndexMetadatasToCreate);
    sideEffectResult.flatIndexMetadatasToDelete.push(...flatIndexMetadatasToDelete);
    return {
        status: 'success',
        result: sideEffectResult
    };
};

//# sourceMappingURL=handle-flat-field-metadata-update-side-effect.util.js.map