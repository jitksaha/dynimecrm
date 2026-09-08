"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphql = require("graphql");
const _types = require("twenty-shared/types");
const _compositefieldmetadatacreategqlinputtypegenerator = require("../input-types/create-input/composite-field-metadata-create-gql-input-type.generator");
const _compositefieldmetadatagqlobjecttypegenerator = require("../object-types/composite-field-metadata-gql-object-type.generator");
const _typemapperservice = require("../../services/type-mapper.service");
const _gqltypesstorage = require("../../storages/gql-types.storage");
const _gqlinputtypedefinitionkindenum = require("../../enums/gql-input-type-definition-kind.enum");
const _computecompositefieldinputtypekeyutil = require("../../utils/compute-stored-gql-type-key-utils/compute-composite-field-input-type-key.util");
const _computecompositefieldobjecttypekeyutil = require("../../utils/compute-stored-gql-type-key-utils/compute-composite-field-object-type-key.util");
describe('composite sub-field gql types', ()=>{
    let gqlTypesStorage;
    let objectTypeGenerator;
    let createInputTypeGenerator;
    beforeEach(()=>{
        gqlTypesStorage = new _gqltypesstorage.GqlTypesStorage();
        objectTypeGenerator = new _compositefieldmetadatagqlobjecttypegenerator.CompositeFieldMetadataGqlObjectTypeGenerator(gqlTypesStorage, new _typemapperservice.TypeMapperService());
        createInputTypeGenerator = new _compositefieldmetadatacreategqlinputtypegenerator.CompositeFieldMetadataCreateGqlInputTypeGenerator(gqlTypesStorage, new _typemapperservice.TypeMapperService());
    });
    const getObjectType = (fieldMetadataType)=>{
        const type = gqlTypesStorage.getGqlTypeByKey((0, _computecompositefieldobjecttypekeyutil.computeCompositeFieldObjectTypeKey)(fieldMetadataType));
        if (!(0, _graphql.isObjectType)(type)) {
            throw new Error(`Expected an object type for ${fieldMetadataType}`);
        }
        return type;
    };
    const getCreateInputType = (fieldMetadataType)=>{
        const type = gqlTypesStorage.getGqlTypeByKey((0, _computecompositefieldinputtypekeyutil.computeCompositeFieldInputTypeKey)(fieldMetadataType, _gqlinputtypedefinitionkindenum.GqlInputTypeDefinitionKind.Create));
        if (!(0, _graphql.isInputObjectType)(type)) {
            throw new Error(`Expected an input type for ${fieldMetadataType}`);
        }
        return type;
    };
    it('types raw json sub-fields in output types', ()=>{
        objectTypeGenerator.buildAndStore(_types.emailsCompositeType);
        objectTypeGenerator.buildAndStore(_types.phonesCompositeType);
        objectTypeGenerator.buildAndStore(_types.linksCompositeType);
        expect(String(getObjectType(_types.FieldMetadataType.EMAILS).getFields().additionalEmails.type)).toBe('[String!]');
        expect(String(getObjectType(_types.FieldMetadataType.PHONES).getFields().additionalPhones.type)).toBe('[AdditionalPhone!]');
        expect(String(getObjectType(_types.FieldMetadataType.LINKS).getFields().secondaryLinks.type)).toBe('[SecondaryLink!]');
    });
    it('types raw json sub-fields in create input types', ()=>{
        createInputTypeGenerator.buildAndStore(_types.phonesCompositeType);
        expect(String(getCreateInputType(_types.FieldMetadataType.PHONES).getFields().additionalPhones.type)).toBe('[AdditionalPhoneInput!]');
    });
});

//# sourceMappingURL=composite-sub-field-gql-types.spec.js.map