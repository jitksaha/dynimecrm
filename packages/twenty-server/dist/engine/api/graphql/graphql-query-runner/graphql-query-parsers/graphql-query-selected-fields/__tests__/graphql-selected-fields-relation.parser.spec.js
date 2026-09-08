"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _graphqlselectedfieldsparser = require("../graphql-selected-fields.parser");
const createMockField = (overrides)=>({
        workspaceId: 'workspace-id',
        universalIdentifier: overrides.id,
        label: overrides.name,
        ...overrides
    });
const buildFieldMaps = (fields)=>({
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
const createMockObject = (overrides)=>({
        workspaceId: 'workspace-id',
        universalIdentifier: overrides.id,
        ...overrides
    });
const buildObjectMaps = (objects)=>({
        byUniversalIdentifier: Object.fromEntries(objects.map((object)=>[
                object.universalIdentifier,
                object
            ])),
        universalIdentifierById: Object.fromEntries(objects.map((object)=>[
                object.id,
                object.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
describe('GraphqlQuerySelectedFieldsParser relation fields', ()=>{
    const leadIdField = createMockField({
        id: 'lead-id-field',
        name: 'id',
        type: _types.FieldMetadataType.UUID
    });
    const fundField = createMockField({
        id: 'fund-field',
        name: 'fund',
        type: _types.FieldMetadataType.RELATION,
        settings: {
            relationType: _types.RelationType.ONE_TO_MANY
        },
        relationTargetObjectMetadataId: 'company-object-id'
    });
    const companyIdField = createMockField({
        id: 'company-id-field',
        name: 'id',
        type: _types.FieldMetadataType.UUID
    });
    const companyNameField = createMockField({
        id: 'company-name-field',
        name: 'name',
        type: _types.FieldMetadataType.TEXT
    });
    const investorLeadObject = createMockObject({
        id: 'investor-lead-object-id',
        nameSingular: 'investorLead',
        fieldIds: [
            'lead-id-field',
            'fund-field'
        ]
    });
    const companyObject = createMockObject({
        id: 'company-object-id',
        nameSingular: 'company',
        fieldIds: [
            'company-id-field',
            'company-name-field'
        ]
    });
    const fieldMaps = buildFieldMaps([
        leadIdField,
        fundField,
        companyIdField,
        companyNameField
    ]);
    const objectMaps = buildObjectMaps([
        investorLeadObject,
        companyObject
    ]);
    it('should ignore a relation selected as a boolean', ()=>{
        // Boolean selections carry no sub-fields; only the object form hydrates
        const parser = new _graphqlselectedfieldsparser.GraphqlQuerySelectedFieldsParser(objectMaps, fieldMaps);
        const result = parser.parse({
            id: true,
            fund: true
        }, investorLeadObject);
        expect(result.select).toEqual({
            id: true
        });
        expect(result.relations).toEqual({});
        expect(result.relationFieldsCount).toBe(0);
    });
    it('should hydrate a relation selected as a nested object', ()=>{
        const parser = new _graphqlselectedfieldsparser.GraphqlQuerySelectedFieldsParser(objectMaps, fieldMaps);
        const result = parser.parse({
            id: true,
            fund: {
                id: true,
                name: true
            }
        }, investorLeadObject);
        expect(result.select.fund).toEqual({
            id: true,
            name: true
        });
        expect(result.relations.fund).toEqual({});
        expect(result.relationFieldsCount).toBe(1);
    });
});

//# sourceMappingURL=graphql-selected-fields-relation.parser.spec.js.map