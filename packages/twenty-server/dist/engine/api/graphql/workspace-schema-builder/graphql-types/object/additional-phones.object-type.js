"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdditionalPhonesObjectType", {
    enumerable: true,
    get: function() {
        return AdditionalPhonesObjectType;
    }
});
const _graphql = require("graphql");
const AdditionalPhoneObjectType = new _graphql.GraphQLObjectType({
    name: 'AdditionalPhone',
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
const AdditionalPhonesObjectType = new _graphql.GraphQLList(new _graphql.GraphQLNonNull(AdditionalPhoneObjectType));

//# sourceMappingURL=additional-phones.object-type.js.map