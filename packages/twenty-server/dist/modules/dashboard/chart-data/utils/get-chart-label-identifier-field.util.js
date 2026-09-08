"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getChartLabelIdentifierField", {
    enumerable: true,
    get: function() {
        return getChartLabelIdentifierField;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const getChartLabelIdentifierField = ({ flatObjectMetadata, flatFieldMetadataMaps })=>{
    const { labelIdentifierFieldMetadataId } = flatObjectMetadata;
    if (!(0, _utils.isDefined)(labelIdentifierFieldMetadataId)) {
        return null;
    }
    const labelIdentifierField = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityMaps: flatFieldMetadataMaps,
        flatEntityId: labelIdentifierFieldMetadataId
    });
    if (!(0, _utils.isDefined)(labelIdentifierField) || labelIdentifierField.name === 'id') {
        return null;
    }
    if (labelIdentifierField.type !== _types.FieldMetadataType.FULL_NAME && labelIdentifierField.type !== _types.FieldMetadataType.TEXT && labelIdentifierField.type !== _types.FieldMetadataType.UUID) {
        return null;
    }
    return labelIdentifierField;
};

//# sourceMappingURL=get-chart-label-identifier-field.util.js.map