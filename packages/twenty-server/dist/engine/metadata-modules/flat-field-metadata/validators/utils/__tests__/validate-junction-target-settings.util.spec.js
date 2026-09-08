"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _validatejunctiontargetsettingsutil = require("../validate-junction-target-settings.util");
const JUNCTION_OBJECT_ID = 'junction-object-id';
const SOURCE_FIELD_ID = 'source-field-id';
const TARGET_FIELD_ID = 'target-field-id';
const createRelationField = ({ universalIdentifier, type = _types.FieldMetadataType.RELATION, relationType = _types.RelationType.MANY_TO_ONE, morphId = null })=>({
        universalIdentifier,
        objectMetadataUniversalIdentifier: JUNCTION_OBJECT_ID,
        type,
        morphId,
        universalSettings: {
            relationType
        }
    });
const createJunctionField = ({ sourceFieldUniversalIdentifier = SOURCE_FIELD_ID, targetFieldUniversalIdentifier = TARGET_FIELD_ID } = {})=>({
        universalIdentifier: 'junction-field-id',
        objectMetadataUniversalIdentifier: 'source-object-id',
        relationTargetObjectMetadataUniversalIdentifier: JUNCTION_OBJECT_ID,
        relationTargetFieldMetadataUniversalIdentifier: sourceFieldUniversalIdentifier,
        type: _types.FieldMetadataType.RELATION,
        morphId: null,
        universalSettings: {
            relationType: _types.RelationType.ONE_TO_MANY,
            junctionTargetFieldUniversalIdentifier: targetFieldUniversalIdentifier
        }
    });
const createFieldMaps = (...fields)=>({
        byUniversalIdentifier: Object.fromEntries(fields.map((field)=>[
                field.universalIdentifier,
                field
            ]))
    });
const errorMessages = (errors)=>errors.map(({ message })=>message);
describe('validateJunctionTargetSettings', ()=>{
    it('accepts a many-to-one morph target', ()=>{
        const sourceField = createRelationField({
            universalIdentifier: SOURCE_FIELD_ID
        });
        const targetField = createRelationField({
            universalIdentifier: TARGET_FIELD_ID,
            type: _types.FieldMetadataType.MORPH_RELATION,
            morphId: 'target-morph-id'
        });
        expect((0, _validatejunctiontargetsettingsutil.validateJunctionTargetSettings)({
            universalFlatFieldMetadata: createJunctionField(),
            flatFieldMetadataMaps: createFieldMaps(sourceField, targetField)
        })).toEqual([]);
    });
    it('rejects a one-to-many morph target', ()=>{
        const targetField = createRelationField({
            universalIdentifier: TARGET_FIELD_ID,
            type: _types.FieldMetadataType.MORPH_RELATION,
            relationType: _types.RelationType.ONE_TO_MANY,
            morphId: 'target-morph-id'
        });
        expect(errorMessages((0, _validatejunctiontargetsettingsutil.validateJunctionTargetSettings)({
            universalFlatFieldMetadata: createJunctionField(),
            flatFieldMetadataMaps: createFieldMaps(targetField)
        }))).toEqual([
            `Junction target field ${TARGET_FIELD_ID} is not a MANY_TO_ONE relation`
        ]);
    });
    it('rejects the source field as the target', ()=>{
        const sourceField = createRelationField({
            universalIdentifier: SOURCE_FIELD_ID
        });
        expect(errorMessages((0, _validatejunctiontargetsettingsutil.validateJunctionTargetSettings)({
            universalFlatFieldMetadata: createJunctionField({
                targetFieldUniversalIdentifier: SOURCE_FIELD_ID
            }),
            flatFieldMetadataMaps: createFieldMaps(sourceField)
        }))).toEqual([
            'Junction source and target fields must be different'
        ]);
    });
    it('rejects another member of the source morph group as the target', ()=>{
        const sourceField = createRelationField({
            universalIdentifier: SOURCE_FIELD_ID,
            type: _types.FieldMetadataType.MORPH_RELATION,
            morphId: 'source-morph-id'
        });
        const targetField = createRelationField({
            universalIdentifier: TARGET_FIELD_ID,
            type: _types.FieldMetadataType.MORPH_RELATION,
            morphId: 'source-morph-id'
        });
        expect(errorMessages((0, _validatejunctiontargetsettingsutil.validateJunctionTargetSettings)({
            universalFlatFieldMetadata: createJunctionField(),
            flatFieldMetadataMaps: createFieldMaps(sourceField, targetField)
        }))).toEqual([
            'Junction source and target fields must be different'
        ]);
    });
});

//# sourceMappingURL=validate-junction-target-settings.util.spec.js.map