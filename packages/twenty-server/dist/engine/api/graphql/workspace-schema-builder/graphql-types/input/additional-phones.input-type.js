"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdditionalPhonesInputType", {
    enumerable: true,
    get: function() {
        return AdditionalPhonesInputType;
    }
});
const _graphql = require("graphql");
const AdditionalPhoneInputType = new _graphql.GraphQLInputObjectType({
    name: 'AdditionalPhoneInput',
    fields: {
        number: {
            type: _graphql.GraphQLString
        },
        callingCode: {
            type: _graphql.GraphQLString
        },
        countryCode: {
            type: _graphql.GraphQLString
        }
    }
});
const AdditionalPhonesInputType = new _graphql.GraphQLList(new _graphql.GraphQLNonNull(AdditionalPhoneInputType));

//# sourceMappingURL=additional-phones.input-type.js.map