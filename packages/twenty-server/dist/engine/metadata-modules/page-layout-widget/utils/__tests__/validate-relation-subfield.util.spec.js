"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getflatfieldmetadatamock = require("../../../flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _validaterelationsubfieldutil = require("../validate-relation-subfield.util");
const PET_OBJECT_ID = 'pet-object-id';
const ROCKET_OBJECT_ID = 'rocket-object-id';
const SURVEY_RESULT_OBJECT_ID = 'survey-result-object-id';
const buildFieldsByObjectId = (fields)=>{
    const map = new Map();
    for (const field of fields){
        const existing = map.get(field.objectMetadataId) ?? [];
        existing.push(field);
        map.set(field.objectMetadataId, existing);
    }
    return map;
};
describe('validateRelationSubfield', ()=>{
    it('should resolve the concrete target for a per-target morph field with multiple targets', ()=>{
        const morphId = 'polymorphic-owner-morph-id';
        const morphToRocket = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'morph-rocket',
            objectMetadataId: PET_OBJECT_ID,
            type: _types.FieldMetadataType.MORPH_RELATION,
            name: 'polymorphicOwnerRocket',
            morphId,
            relationTargetObjectMetadataId: ROCKET_OBJECT_ID
        });
        const morphToSurveyResult = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'morph-survey-result',
            objectMetadataId: PET_OBJECT_ID,
            type: _types.FieldMetadataType.MORPH_RELATION,
            name: 'polymorphicOwnerSurveyResult',
            morphId,
            relationTargetObjectMetadataId: SURVEY_RESULT_OBJECT_ID
        });
        const rocketNameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'rocket-name',
            objectMetadataId: ROCKET_OBJECT_ID,
            type: _types.FieldMetadataType.TEXT,
            name: 'name'
        });
        const allFields = [
            morphToRocket,
            morphToSurveyResult,
            rocketNameField
        ];
        expect(()=>(0, _validaterelationsubfieldutil.validateRelationSubfield)({
                field: morphToRocket,
                subFieldName: 'name',
                paramName: morphToRocket.name,
                allFields,
                fieldsByObjectId: buildFieldsByObjectId(allFields)
            })).not.toThrow();
    });
    it('should throw when the nested subfield does not exist on the resolved target', ()=>{
        const morphId = 'polymorphic-owner-morph-id';
        const morphToRocket = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'morph-rocket',
            objectMetadataId: PET_OBJECT_ID,
            type: _types.FieldMetadataType.MORPH_RELATION,
            name: 'polymorphicOwnerRocket',
            morphId,
            relationTargetObjectMetadataId: ROCKET_OBJECT_ID
        });
        const rocketNameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'rocket-name',
            objectMetadataId: ROCKET_OBJECT_ID,
            type: _types.FieldMetadataType.TEXT,
            name: 'name'
        });
        const allFields = [
            morphToRocket,
            rocketNameField
        ];
        expect(()=>(0, _validaterelationsubfieldutil.validateRelationSubfield)({
                field: morphToRocket,
                subFieldName: 'nonExistingField',
                paramName: morphToRocket.name,
                allFields,
                fieldsByObjectId: buildFieldsByObjectId(allFields)
            })).toThrow('not found');
    });
});

//# sourceMappingURL=validate-relation-subfield.util.spec.js.map