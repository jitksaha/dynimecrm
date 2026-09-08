"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findTsVectorFlatFieldMetadataForObject", {
    enumerable: true,
    get: function() {
        return findTsVectorFlatFieldMetadataForObject;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _searchvectorfieldconstants = require("../../search-field-metadata/constants/search-vector-field.constants");
const findTsVectorFlatFieldMetadataForObject = ({ fieldUniversalIdentifiers, flatFieldMetadataMaps })=>fieldUniversalIdentifiers.map((fieldUniversalIdentifier)=>flatFieldMetadataMaps.byUniversalIdentifier[fieldUniversalIdentifier]).find((flatFieldMetadata)=>(0, _utils.isDefined)(flatFieldMetadata) && flatFieldMetadata.type === _types.FieldMetadataType.TS_VECTOR && flatFieldMetadata.name === _searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name);

//# sourceMappingURL=find-ts-vector-flat-field-metadata-for-object.util.js.map