"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUnselectableRelationWarningsByFieldName", {
    enumerable: true,
    get: function() {
        return buildUnselectableRelationWarningsByFieldName;
    }
});
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _utils = require("twenty-shared/utils");
const buildUnselectableRelationWarningsByFieldName = ({ objectName, flatObjectMetadata, flatFieldMetadataMaps, flatObjectMetadataMaps, selectableRelationFields, objectsPermissions })=>{
    const warningsByFieldName = new Map();
    for (const fieldId of flatObjectMetadata.fieldIds){
        const field = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(field)) {
            continue;
        }
        if (!(0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(field) || (0, _utils.isDefined)(selectableRelationFields[field.name])) {
            continue;
        }
        const isSourceFieldRestricted = objectsPermissions[flatObjectMetadata.id]?.restrictedFields[field.id]?.canRead === false;
        if (isSourceFieldRestricted) {
            warningsByFieldName.set(field.name, `Field '${field.name}' on ${objectName} cannot be selected because your role restricts access to this field.`);
            continue;
        }
        const targetObject = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: field.relationTargetObjectMetadataId,
            flatEntityMaps: flatObjectMetadataMaps
        });
        const warning = (0, _utils.isDefined)(targetObject) ? `Field '${field.name}' on ${objectName} cannot be selected because you do not have read access to ${targetObject.nameSingular}.` : `Field '${field.name}' on ${objectName} cannot be selected.`;
        warningsByFieldName.set(field.name, warning);
    }
    return warningsByFieldName;
};

//# sourceMappingURL=build-unselectable-relation-warnings.util.js.map