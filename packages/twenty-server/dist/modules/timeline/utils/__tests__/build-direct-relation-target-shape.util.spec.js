"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _builddirectrelationtargetshapeutil = require("../build-direct-relation-target-shape.util");
const buildFlatEntityMaps = (flatEntities)=>({
        byUniversalIdentifier: Object.fromEntries(flatEntities.map((flatEntity)=>[
                flatEntity.universalIdentifier,
                flatEntity
            ])),
        universalIdentifierById: Object.fromEntries(flatEntities.map((flatEntity)=>[
                flatEntity.id,
                flatEntity.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const ATTACHMENT_OBJECT = {
    id: 'attachment-object',
    universalIdentifier: 'attachment-object-uid',
    nameSingular: 'attachment',
    fieldIds: [
        'target-person-field',
        'target-company-field'
    ]
};
const PERSON_OBJECT = {
    id: 'person-object',
    universalIdentifier: 'person-object-uid',
    nameSingular: 'person',
    fieldIds: []
};
const COMPANY_OBJECT = {
    id: 'company-object',
    universalIdentifier: 'company-object-uid',
    nameSingular: 'company',
    fieldIds: []
};
const TARGET_PERSON_FIELD = {
    id: 'target-person-field',
    universalIdentifier: 'target-person-field-uid',
    name: 'targetPerson',
    type: _types.FieldMetadataType.MORPH_RELATION,
    objectMetadataId: ATTACHMENT_OBJECT.id,
    morphId: 'target-morph-id',
    relationTargetObjectMetadataId: PERSON_OBJECT.id,
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE,
        joinColumnName: 'targetPersonId'
    }
};
const TARGET_COMPANY_FIELD = {
    id: 'target-company-field',
    universalIdentifier: 'target-company-field-uid',
    name: 'targetCompany',
    type: _types.FieldMetadataType.MORPH_RELATION,
    objectMetadataId: ATTACHMENT_OBJECT.id,
    morphId: 'target-morph-id',
    relationTargetObjectMetadataId: COMPANY_OBJECT.id,
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE,
        joinColumnName: 'targetCompanyId'
    }
};
const flatObjectMetadataMaps = buildFlatEntityMaps([
    ATTACHMENT_OBJECT,
    PERSON_OBJECT,
    COMPANY_OBJECT
]);
const flatFieldMetadataMaps = buildFlatEntityMaps([
    TARGET_PERSON_FIELD,
    TARGET_COMPANY_FIELD
]);
describe('buildDirectRelationTargetShape', ()=>{
    it('expands every target in a direct morph relation', ()=>{
        expect((0, _builddirectrelationtargetshapeutil.buildDirectRelationTargetShape)({
            relationFlatFieldMetadata: TARGET_PERSON_FIELD,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toEqual({
            kind: 'DIRECT_RELATION',
            targetJoinColumns: [
                {
                    joinColumnName: 'targetPersonId',
                    targetObjectNameSingular: 'person'
                },
                {
                    joinColumnName: 'targetCompanyId',
                    targetObjectNameSingular: 'company'
                }
            ]
        });
    });
    it('does not treat a one-to-many field as a direct relation', ()=>{
        expect((0, _builddirectrelationtargetshapeutil.buildDirectRelationTargetShape)({
            relationFlatFieldMetadata: {
                ...TARGET_PERSON_FIELD,
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toBeUndefined();
    });
    it('isolates incomplete morph metadata as an invalid target shape', ()=>{
        const objectMapsWithMissingMorphField = buildFlatEntityMaps([
            {
                ...ATTACHMENT_OBJECT,
                fieldIds: [
                    ...ATTACHMENT_OBJECT.fieldIds,
                    'missing-morph-field'
                ]
            },
            PERSON_OBJECT,
            COMPANY_OBJECT
        ]);
        expect((0, _builddirectrelationtargetshapeutil.buildDirectRelationTargetShape)({
            relationFlatFieldMetadata: TARGET_PERSON_FIELD,
            flatObjectMetadataMaps: objectMapsWithMissingMorphField,
            flatFieldMetadataMaps
        })).toBeUndefined();
    });
});

//# sourceMappingURL=build-direct-relation-target-shape.util.spec.js.map