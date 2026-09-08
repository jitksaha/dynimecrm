"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getflatfieldmetadatamock = require("../../../../../metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _getflatobjectmetadatamock = require("../../../../../metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const _deleteflatentityforeignkeyaggregatorsutil = require("../delete-flat-entity-foreign-key-aggregators.util");
describe('deleteFlatEntityForeignKeyAggregators', ()=>{
    it('should strip raw workspace-scoped properties from a flat object metadata', ()=>{
        const flatObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'object-universal-identifier',
            applicationId: 'application-id',
            applicationUniversalIdentifier: 'application-universal-identifier',
            labelIdentifierFieldMetadataId: 'label-identifier-field-metadata-id',
            labelIdentifierFieldMetadataUniversalIdentifier: 'label-identifier-field-metadata-universal-identifier',
            imageIdentifierFieldMetadataId: 'image-identifier-field-metadata-id',
            imageIdentifierFieldMetadataUniversalIdentifier: 'image-identifier-field-metadata-universal-identifier',
            fieldIds: [
                'field-id'
            ],
            fieldUniversalIdentifiers: [
                'field-universal-identifier'
            ],
            viewIds: [
                'view-id'
            ],
            viewUniversalIdentifiers: [
                'view-universal-identifier'
            ]
        });
        const result = (0, _deleteflatentityforeignkeyaggregatorsutil.deleteFlatEntityForeignKeyAggregators)({
            universalFlatEntity: flatObjectMetadata,
            metadataName: 'objectMetadata'
        });
        expect(result).toMatchSnapshot();
    });
    it('should strip raw workspace-scoped properties from a flat field metadata', ()=>{
        const flatFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'field-universal-identifier',
            type: _types.FieldMetadataType.TEXT,
            applicationUniversalIdentifier: 'application-universal-identifier',
            objectMetadataId: 'object-metadata-id',
            objectMetadataUniversalIdentifier: 'object-metadata-universal-identifier',
            viewFieldIds: [
                'view-field-id'
            ],
            viewFieldUniversalIdentifiers: [
                'view-field-universal-identifier'
            ]
        });
        const result = (0, _deleteflatentityforeignkeyaggregatorsutil.deleteFlatEntityForeignKeyAggregators)({
            universalFlatEntity: flatFieldMetadata,
            metadataName: 'fieldMetadata'
        });
        expect(result).toMatchSnapshot();
    });
    it('should not mutate the input entity', ()=>{
        const flatObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'object-universal-identifier'
        });
        (0, _deleteflatentityforeignkeyaggregatorsutil.deleteFlatEntityForeignKeyAggregators)({
            universalFlatEntity: flatObjectMetadata,
            metadataName: 'objectMetadata'
        });
        expect(flatObjectMetadata).toHaveProperty('id');
        expect(flatObjectMetadata).toHaveProperty('workspaceId');
        expect(flatObjectMetadata).toHaveProperty('fieldIds');
    });
});

//# sourceMappingURL=delete-flat-entity-foreign-key-aggregators.util.spec.js.map