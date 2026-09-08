"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNestedRelationFieldNames", {
    enumerable: true,
    get: function() {
        return getNestedRelationFieldNames;
    }
});
const _types = require("twenty-shared/types");
const _getflatfieldsforflatobjectmetadatautil = require("../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _isflatfieldmetadataoftypeutil = require("../../metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const getNestedRelationFieldNames = ({ flatObjectMetadata, flatFieldMetadataMaps })=>new Set((0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, flatFieldMetadataMaps).filter((field)=>((0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.RELATION) || (0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.MORPH_RELATION)) && field.settings.relationType === _types.RelationType.MANY_TO_ONE).map(({ name })=>name));

//# sourceMappingURL=get-nested-relation-field-names.util.js.map