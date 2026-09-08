"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getCompositeSubFieldGqlTypes () {
        return getCompositeSubFieldGqlTypes;
    },
    get getCompositeSubFieldObjectTypeName () {
        return getCompositeSubFieldObjectTypeName;
    }
});
const _graphql = require("graphql");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _actorcontextinputtype = require("../graphql-types/input/actor-context.input-type");
const _additionalphonesinputtype = require("../graphql-types/input/additional-phones.input-type");
const _secondarylinksinputtype = require("../graphql-types/input/secondary-links.input-type");
const _actorcontextobjecttype = require("../graphql-types/object/actor-context.object-type");
const _additionalphonesobjecttype = require("../graphql-types/object/additional-phones.object-type");
const _secondarylinksobjecttype = require("../graphql-types/object/secondary-links.object-type");
const _iscompositefieldmetadatatypeutil = require("../../../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const AdditionalEmailsType = new _graphql.GraphQLList(new _graphql.GraphQLNonNull(_graphql.GraphQLString));
const EMAILS_SUB_FIELD_GQL_TYPES = {
    additionalEmails: {
        output: AdditionalEmailsType,
        input: AdditionalEmailsType
    }
};
const PHONES_SUB_FIELD_GQL_TYPES = {
    additionalPhones: {
        output: _additionalphonesobjecttype.AdditionalPhonesObjectType,
        input: _additionalphonesinputtype.AdditionalPhonesInputType
    }
};
const LINKS_SUB_FIELD_GQL_TYPES = {
    secondaryLinks: {
        output: _secondarylinksobjecttype.SecondaryLinksObjectType,
        input: _secondarylinksinputtype.SecondaryLinksInputType
    }
};
const ACTOR_SUB_FIELD_GQL_TYPES = {
    context: {
        output: _actorcontextobjecttype.ActorContextObjectType,
        input: _actorcontextinputtype.ActorContextInputType
    }
};
const NO_SUB_FIELD_GQL_TYPES = {};
// Composite sub-fields stored as RAW_JSON have a known shape, exposed here as
// real GraphQL types instead of the opaque JSON scalar
const getCompositeSubFieldGqlTypesByPropertyName = (compositeFieldMetadataType)=>{
    switch(compositeFieldMetadataType){
        case _types.FieldMetadataType.EMAILS:
            return EMAILS_SUB_FIELD_GQL_TYPES;
        case _types.FieldMetadataType.PHONES:
            return PHONES_SUB_FIELD_GQL_TYPES;
        case _types.FieldMetadataType.LINKS:
            return LINKS_SUB_FIELD_GQL_TYPES;
        case _types.FieldMetadataType.ACTOR:
            return ACTOR_SUB_FIELD_GQL_TYPES;
        case _types.FieldMetadataType.ADDRESS:
        case _types.FieldMetadataType.CURRENCY:
        case _types.FieldMetadataType.FULL_NAME:
        case _types.FieldMetadataType.RICH_TEXT:
            return NO_SUB_FIELD_GQL_TYPES;
        default:
            return (0, _utils.assertUnreachable)(compositeFieldMetadataType);
    }
};
const getCompositeSubFieldGqlTypes = (fieldMetadataType, propertyName)=>(0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(fieldMetadataType) ? getCompositeSubFieldGqlTypesByPropertyName(fieldMetadataType)[propertyName] : undefined;
const getCompositeSubFieldObjectTypeName = (fieldMetadataType, propertyName)=>{
    const outputType = getCompositeSubFieldGqlTypes(fieldMetadataType, propertyName)?.output;
    if (!(0, _utils.isDefined)(outputType)) {
        return undefined;
    }
    const namedType = (0, _graphql.getNamedType)(outputType);
    return (0, _graphql.isObjectType)(namedType) ? namedType.name : undefined;
};

//# sourceMappingURL=get-composite-sub-field-gql-types.util.js.map