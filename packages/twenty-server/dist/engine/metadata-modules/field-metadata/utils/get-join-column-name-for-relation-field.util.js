"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getJoinColumnNameForRelationField", {
    enumerable: true,
    get: function() {
        return getJoinColumnNameForRelationField;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _computemorphorrelationfieldjoincolumnnameutil = require("./compute-morph-or-relation-field-join-column-name.util");
const _isfieldmetadatasettingsoftypeutil = require("./is-field-metadata-settings-of-type.util");
const getJoinColumnNameForRelationField = (flatFieldMetadata)=>{
    const { settings } = flatFieldMetadata;
    if ((0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(settings, _types.FieldMetadataType.RELATION) && (0, _utils.isDefined)(settings.joinColumnName)) {
        return settings.joinColumnName;
    }
    return (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
        name: flatFieldMetadata.name
    });
};

//# sourceMappingURL=get-join-column-name-for-relation-field.util.js.map