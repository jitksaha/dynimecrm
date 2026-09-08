"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveSearchVectorAsExpressionForTsVectorField", {
    enumerable: true,
    get: function() {
        return resolveSearchVectorAsExpressionForTsVectorField;
    }
});
const _derivesearchvectorasexpressionfortsvectorfieldutil = require("./derive-search-vector-as-expression-for-ts-vector-field.util");
const _gettargetsearchfieldmetadatasfortsvectorfieldutil = require("./get-target-search-field-metadatas-for-ts-vector-field.util");
const resolveSearchVectorAsExpressionForTsVectorField = ({ tsVectorFieldMetadataId, objectFlatFieldMetadatas, flatSearchFieldMetadataMaps, getSearchFieldMetadatasByTsVectorFieldId })=>(0, _derivesearchvectorasexpressionfortsvectorfieldutil.deriveSearchVectorAsExpressionForTsVectorField)({
        targetSearchFieldMetadatas: getSearchFieldMetadatasByTsVectorFieldId?.(tsVectorFieldMetadataId) ?? (0, _gettargetsearchfieldmetadatasfortsvectorfieldutil.getTargetSearchFieldMetadatasForTsVectorField)({
            tsVectorFieldMetadataId,
            flatSearchFieldMetadataMaps
        }),
        indexedFieldById: new Map(objectFlatFieldMetadatas.map((objectFlatFieldMetadata)=>[
                objectFlatFieldMetadata.id,
                {
                    name: objectFlatFieldMetadata.name,
                    type: objectFlatFieldMetadata.type
                }
            ]))
    });

//# sourceMappingURL=resolve-search-vector-as-expression-for-ts-vector-field.util.js.map