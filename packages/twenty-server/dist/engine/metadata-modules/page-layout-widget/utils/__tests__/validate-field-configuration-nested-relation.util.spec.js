"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getflatfieldmetadatamock = require("../../../flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _fielddisplaymodeenum = require("../../enums/field-display-mode.enum");
const _widgetconfigurationtypetype = require("../../enums/widget-configuration-type.type");
const _validatefieldconfigurationnestedrelationutil = require("../validate-field-configuration-nested-relation.util");
const COMPANY_OBJECT_ID = 'company-object-id';
const PERSON_OBJECT_ID = 'person-object-id';
const OPPORTUNITY_OBJECT_ID = 'opportunity-object-id';
const PEOPLE_FIELD_ID = 'company-people-field-id';
const OWNED_OPPORTUNITIES_FIELD_ID = 'person-owned-opportunities-field-id';
const PERSON_COMPANY_FIELD_ID = 'person-company-field-id';
const COMPANY_NAME_FIELD_ID = 'company-name-field-id';
const peopleField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
    id: PEOPLE_FIELD_ID,
    universalIdentifier: 'company-people-field-ui',
    objectMetadataId: COMPANY_OBJECT_ID,
    type: _types.FieldMetadataType.RELATION,
    name: 'people',
    label: 'People',
    settings: {
        relationType: _types.RelationType.ONE_TO_MANY
    },
    relationTargetObjectMetadataId: PERSON_OBJECT_ID
});
const ownedOpportunitiesField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
    id: OWNED_OPPORTUNITIES_FIELD_ID,
    universalIdentifier: 'person-owned-opportunities-field-ui',
    objectMetadataId: PERSON_OBJECT_ID,
    type: _types.FieldMetadataType.RELATION,
    name: 'ownedOpportunities',
    label: 'Owned opportunities',
    settings: {
        relationType: _types.RelationType.ONE_TO_MANY
    },
    relationTargetObjectMetadataId: OPPORTUNITY_OBJECT_ID
});
const personCompanyField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
    id: PERSON_COMPANY_FIELD_ID,
    universalIdentifier: 'person-company-field-ui',
    objectMetadataId: PERSON_OBJECT_ID,
    type: _types.FieldMetadataType.RELATION,
    name: 'company',
    label: 'Company',
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE,
        joinColumnName: 'companyId'
    },
    relationTargetObjectMetadataId: COMPANY_OBJECT_ID
});
const companyNameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
    id: COMPANY_NAME_FIELD_ID,
    universalIdentifier: 'company-name-field-ui',
    objectMetadataId: COMPANY_OBJECT_ID,
    type: _types.FieldMetadataType.TEXT,
    name: 'name',
    label: 'Name',
    settings: null
});
const buildFlatFieldMetadataMaps = (fields)=>({
        byUniversalIdentifier: Object.fromEntries(fields.map((field)=>[
                field.universalIdentifier,
                field
            ])),
        universalIdentifierById: Object.fromEntries(fields.map((field)=>[
                field.id,
                field.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const flatFieldMetadataMaps = buildFlatFieldMetadataMaps([
    peopleField,
    ownedOpportunitiesField,
    personCompanyField,
    companyNameField
]);
const buildFieldConfiguration = (overrides = {})=>({
        configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELD,
        fieldMetadataId: PEOPLE_FIELD_ID,
        fieldDisplayMode: _fielddisplaymodeenum.FieldDisplayMode.TABLE,
        nestedRelationFieldMetadataId: OWNED_OPPORTUNITIES_FIELD_ID,
        ...overrides
    });
describe('validateFieldConfigurationNestedRelationOrThrow', ()=>{
    it('should pass for a valid one-to-many chain', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration(),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps
            })).not.toThrow();
    });
    it('should ignore non-FIELD configurations', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: {
                    configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.IFRAME
                },
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps
            })).not.toThrow();
    });
    it('should ignore FIELD configurations without a nested relation', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    nestedRelationFieldMetadataId: null
                }),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps
            })).not.toThrow();
    });
    it('should throw when a nested relation is combined with an inline display mode', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    fieldDisplayMode: _fielddisplaymodeenum.FieldDisplayMode.FIELD
                }),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps
            })).toThrow(/fieldDisplayMode/);
    });
    it('should throw when the source field does not exist', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    fieldMetadataId: 'unknown-field-id'
                }),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps
            })).toThrow(/not found/);
    });
    it('should pass for a valid many-to-one first hop chain', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    fieldMetadataId: PERSON_COMPANY_FIELD_ID,
                    nestedRelationFieldMetadataId: PEOPLE_FIELD_ID
                }),
                widgetObjectMetadataId: PERSON_OBJECT_ID,
                flatFieldMetadataMaps
            })).not.toThrow();
    });
    it('should throw when the source field is not a relation', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    fieldMetadataId: COMPANY_NAME_FIELD_ID
                }),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps
            })).toThrow(/one-to-many or many-to-one/);
    });
    it('should throw when the source field belongs to another object', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration(),
                widgetObjectMetadataId: PERSON_OBJECT_ID,
                flatFieldMetadataMaps
            })).toThrow(/does not belong to the widget object/);
    });
    it('should throw when the nested field does not exist', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    nestedRelationFieldMetadataId: 'unknown-nested-field-id'
                }),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps
            })).toThrow(/not found/);
    });
    it('should throw when the nested field is not a one-to-many relation', ()=>{
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    nestedRelationFieldMetadataId: PERSON_COMPANY_FIELD_ID
                }),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps
            })).toThrow(/one-to-many/);
    });
    it('should throw when the source field is a junction many-to-one relation', ()=>{
        const junctionSourceField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            id: 'company-junction-source-field-id',
            universalIdentifier: 'company-junction-source-field-ui',
            objectMetadataId: COMPANY_OBJECT_ID,
            type: _types.FieldMetadataType.RELATION,
            name: 'primaryAgreement',
            label: 'Primary agreement',
            settings: {
                relationType: _types.RelationType.MANY_TO_ONE,
                junctionTargetFieldId: 'junction-target-field-id'
            },
            relationTargetObjectMetadataId: PERSON_OBJECT_ID
        });
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    fieldMetadataId: junctionSourceField.id
                }),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                    junctionSourceField,
                    ownedOpportunitiesField
                ])
            })).toThrow(/one-to-many or many-to-one/);
    });
    it('should throw when the nested field is a junction relation', ()=>{
        const junctionField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            id: 'person-junction-field-id',
            universalIdentifier: 'person-junction-field-ui',
            objectMetadataId: PERSON_OBJECT_ID,
            type: _types.FieldMetadataType.RELATION,
            name: 'petCareAgreements',
            label: 'Pet care agreements',
            settings: {
                relationType: _types.RelationType.ONE_TO_MANY,
                junctionTargetFieldId: 'junction-target-field-id'
            },
            relationTargetObjectMetadataId: OPPORTUNITY_OBJECT_ID
        });
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    nestedRelationFieldMetadataId: junctionField.id
                }),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                    peopleField,
                    ownedOpportunitiesField,
                    junctionField
                ])
            })).toThrow(/one-to-many/);
    });
    it('should throw when the nested field does not belong to the relation target', ()=>{
        const opportunityStagesField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            id: 'opportunity-stages-field-id',
            universalIdentifier: 'opportunity-stages-field-ui',
            objectMetadataId: OPPORTUNITY_OBJECT_ID,
            type: _types.FieldMetadataType.RELATION,
            name: 'stages',
            label: 'Stages',
            settings: {
                relationType: _types.RelationType.ONE_TO_MANY
            },
            relationTargetObjectMetadataId: COMPANY_OBJECT_ID
        });
        expect(()=>(0, _validatefieldconfigurationnestedrelationutil.validateFieldConfigurationNestedRelationOrThrow)({
                widgetConfiguration: buildFieldConfiguration({
                    nestedRelationFieldMetadataId: opportunityStagesField.id
                }),
                widgetObjectMetadataId: COMPANY_OBJECT_ID,
                flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                    peopleField,
                    ownedOpportunitiesField,
                    opportunityStagesField
                ])
            })).toThrow(/does not belong to the relation target/);
    });
});

//# sourceMappingURL=validate-field-configuration-nested-relation.util.spec.js.map