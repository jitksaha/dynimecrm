"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _types = require("twenty-shared/types");
const _createemptyflatentitymapsconstant = require("../../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _fieldmetadataexception = require("../../../field-metadata/field-metadata.exception");
const _getflatfieldmetadatamock = require("../../__mocks__/get-flat-field-metadata.mock");
const _getflatobjectmetadatamock = require("../../../flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const _fromdeletefieldinputtoflatfieldmetadatastodeleteutil = require("../from-delete-field-input-to-flat-field-metadatas-to-delete.util");
const buildFlatFieldMetadataMaps = (fields)=>fields.reduce((maps, field)=>(0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
            flatEntity: field,
            flatEntityMaps: maps
        }), (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)());
const buildFlatObjectMetadataMaps = (objectId)=>{
    const flatObject = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
        universalIdentifier: objectId,
        id: objectId
    });
    return (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
        flatEntity: flatObject,
        flatEntityMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
    });
};
describe('fromDeleteFieldInputToFlatFieldMetadatasToDelete', ()=>{
    it('should throw FIELD_METADATA_NOT_FOUND when field does not exist', ()=>{
        expect(()=>(0, _fromdeletefieldinputtoflatfieldmetadatastodeleteutil.fromDeleteFieldInputToFlatFieldMetadatasToDelete)({
                deleteOneFieldInput: {
                    id: 'non-existent-id'
                },
                flatFieldMetadataMaps: buildFlatFieldMetadataMaps([]),
                flatObjectMetadataMaps: buildFlatObjectMetadataMaps('obj-1'),
                flatIndexMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
            })).toThrow(expect.objectContaining({
            code: _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_METADATA_NOT_FOUND
        }));
    });
    it('should throw FIELD_MUTATION_NOT_ALLOWED when deleting a standard field', ()=>{
        const objectId = 'obj-1';
        const standardField = (0, _getflatfieldmetadatamock.getStandardFlatFieldMetadataMock)({
            universalIdentifier: 'standard-field-uid',
            objectMetadataId: objectId,
            type: _types.FieldMetadataType.TEXT,
            name: 'jobTitle'
        });
        expect(()=>(0, _fromdeletefieldinputtoflatfieldmetadatastodeleteutil.fromDeleteFieldInputToFlatFieldMetadatasToDelete)({
                deleteOneFieldInput: {
                    id: standardField.id
                },
                flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                    standardField
                ]),
                flatObjectMetadataMaps: buildFlatObjectMetadataMaps(objectId),
                flatIndexMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
            })).toThrow(expect.objectContaining({
            code: _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_MUTATION_NOT_ALLOWED
        }));
    });
    it('should throw FIELD_MUTATION_NOT_ALLOWED with the field name in message', ()=>{
        const objectId = 'obj-1';
        const standardField = (0, _getflatfieldmetadatamock.getStandardFlatFieldMetadataMock)({
            universalIdentifier: 'standard-field-uid',
            objectMetadataId: objectId,
            type: _types.FieldMetadataType.TEXT,
            name: 'city'
        });
        expect(()=>(0, _fromdeletefieldinputtoflatfieldmetadatastodeleteutil.fromDeleteFieldInputToFlatFieldMetadatasToDelete)({
                deleteOneFieldInput: {
                    id: standardField.id
                },
                flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                    standardField
                ]),
                flatObjectMetadataMaps: buildFlatObjectMetadataMaps(objectId),
                flatIndexMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
            })).toThrow(new RegExp('Cannot delete standard field "city"'));
    });
    it('should allow deletion of a custom field', ()=>{
        const objectId = 'obj-1';
        const customField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'custom-field-uid',
            objectMetadataId: objectId,
            type: _types.FieldMetadataType.TEXT,
            isCustom: true
        });
        const result = (0, _fromdeletefieldinputtoflatfieldmetadatastodeleteutil.fromDeleteFieldInputToFlatFieldMetadatasToDelete)({
            deleteOneFieldInput: {
                id: customField.id
            },
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                customField
            ]),
            flatObjectMetadataMaps: buildFlatObjectMetadataMaps(objectId),
            flatIndexMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
        });
        expect(result.flatFieldMetadatasToDelete).toContainEqual(expect.objectContaining({
            id: customField.id
        }));
    });
    it('should be an instance of FieldMetadataException when rejecting standard field', ()=>{
        const objectId = 'obj-1';
        const standardField = (0, _getflatfieldmetadatamock.getStandardFlatFieldMetadataMock)({
            universalIdentifier: 'standard-field-uid',
            objectMetadataId: objectId,
            type: _types.FieldMetadataType.TEXT,
            name: 'avatarUrl'
        });
        expect(()=>(0, _fromdeletefieldinputtoflatfieldmetadatastodeleteutil.fromDeleteFieldInputToFlatFieldMetadatasToDelete)({
                deleteOneFieldInput: {
                    id: standardField.id
                },
                flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                    standardField
                ]),
                flatObjectMetadataMaps: buildFlatObjectMetadataMaps(objectId),
                flatIndexMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
            })).toThrow(_fieldmetadataexception.FieldMetadataException);
    });
    it('should throw FIELD_MUTATION_NOT_ALLOWED when field belongs to twenty standard app', ()=>{
        const objectId = 'obj-1';
        const standardAppField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'standard-app-field-uid',
            objectMetadataId: objectId,
            type: _types.FieldMetadataType.TEXT,
            name: 'standardAppField',
            isCustom: true,
            isSystem: false,
            applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER
        });
        expect(()=>(0, _fromdeletefieldinputtoflatfieldmetadatastodeleteutil.fromDeleteFieldInputToFlatFieldMetadatasToDelete)({
                deleteOneFieldInput: {
                    id: standardAppField.id
                },
                flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                    standardAppField
                ]),
                flatObjectMetadataMaps: buildFlatObjectMetadataMaps(objectId),
                flatIndexMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
            })).toThrow(expect.objectContaining({
            code: _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_MUTATION_NOT_ALLOWED
        }));
    });
});

//# sourceMappingURL=from-delete-field-input-to-flat-field-metadatas-to-delete.spec.js.map