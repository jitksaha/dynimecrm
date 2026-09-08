"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeMostlyEmptyFieldMetadataIds", {
    enumerable: true,
    get: function() {
        return computeMostlyEmptyFieldMetadataIds;
    }
});
const _utils = require("twenty-shared/utils");
const _mostlyemptyfractionthresholdconstant = require("../constants/mostly-empty-fraction-threshold.constant");
const _getemptinesscolumnnamesforfieldutil = require("./get-emptiness-column-names-for-field.util");
const computeMostlyEmptyFieldMetadataIds = ({ fieldMetadatas, labelIdentifierFieldMetadataId, emptyFractionByColumnName })=>{
    return fieldMetadatas.filter((fieldMetadata)=>{
        if (!fieldMetadata.isActive || fieldMetadata.isSystem) {
            return false;
        }
        // The label identifier cannot be deactivated, so hinting it is a dead end
        if (fieldMetadata.id === labelIdentifierFieldMetadataId) {
            return false;
        }
        const columnNames = (0, _getemptinesscolumnnamesforfieldutil.getEmptinessColumnNamesForField)(fieldMetadata);
        if (!(0, _utils.isDefined)(columnNames)) {
            return false;
        }
        // A column missing from statistics (e.g. added after the last ANALYZE)
        // means we don't know, and not knowing means no hint
        return columnNames.every((columnName)=>{
            const emptyFraction = emptyFractionByColumnName.get(columnName);
            return (0, _utils.isDefined)(emptyFraction) && emptyFraction >= _mostlyemptyfractionthresholdconstant.MOSTLY_EMPTY_FRACTION_THRESHOLD;
        });
    }).map((fieldMetadata)=>fieldMetadata.id);
};

//# sourceMappingURL=compute-mostly-empty-field-metadata-ids.util.js.map