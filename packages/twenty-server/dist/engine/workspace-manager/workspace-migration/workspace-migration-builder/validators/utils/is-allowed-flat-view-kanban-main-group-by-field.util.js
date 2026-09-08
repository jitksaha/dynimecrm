"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isAllowedFlatViewKanbanMainGroupByField", {
    enumerable: true,
    get: function() {
        return isAllowedFlatViewKanbanMainGroupByField;
    }
});
const _types = require("twenty-shared/types");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const isAllowedFlatViewKanbanMainGroupByField = ({ mainGroupByFieldMetadata })=>{
    if (mainGroupByFieldMetadata.type === _types.FieldMetadataType.SELECT) {
        return true;
    }
    if (!(0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(mainGroupByFieldMetadata)) {
        return false;
    }
    return mainGroupByFieldMetadata.type === _types.FieldMetadataType.RELATION && mainGroupByFieldMetadata.universalSettings?.relationType === _types.RelationType.MANY_TO_ONE;
};

//# sourceMappingURL=is-allowed-flat-view-kanban-main-group-by-field.util.js.map