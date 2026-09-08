"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "deriveSearchVectorAsExpressionForTsVectorField", {
    enumerable: true,
    get: function() {
        return deriveSearchVectorAsExpressionForTsVectorField;
    }
});
const _utils = require("twenty-shared/utils");
const _computesearchvectorasexpressionfromsearchfieldmetadatasutil = require("./compute-search-vector-as-expression-from-search-field-metadatas.util");
const deriveSearchVectorAsExpressionForTsVectorField = ({ targetSearchFieldMetadatas, indexedFieldById })=>{
    const targetSearchableFields = targetSearchFieldMetadatas.flatMap((flatSearchFieldMetadata)=>{
        const indexedField = indexedFieldById.get(flatSearchFieldMetadata.fieldMetadataId);
        if (!(0, _utils.isDefined)(indexedField)) {
            return [];
        }
        return [
            (0, _computesearchvectorasexpressionfromsearchfieldmetadatasutil.buildSearchVectorTargetField)({
                field: indexedField,
                position: flatSearchFieldMetadata.position,
                sortKey: flatSearchFieldMetadata.universalIdentifier
            })
        ];
    });
    return (0, _computesearchvectorasexpressionfromsearchfieldmetadatasutil.computeSearchVectorAsExpressionFromSearchFieldMetadatas)(targetSearchableFields);
};

//# sourceMappingURL=derive-search-vector-as-expression-for-ts-vector-field.util.js.map