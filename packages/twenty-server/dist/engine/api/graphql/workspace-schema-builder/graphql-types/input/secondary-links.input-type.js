"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SecondaryLinksInputType", {
    enumerable: true,
    get: function() {
        return SecondaryLinksInputType;
    }
});
const _graphql = require("graphql");
const SecondaryLinkInputType = new _graphql.GraphQLInputObjectType({
    name: 'SecondaryLinkInput',
    fields: {
        label: {
            type: _graphql.GraphQLString
        },
        url: {
            type: _graphql.GraphQLString
        }
    }
});
const SecondaryLinksInputType = new _graphql.GraphQLList(new _graphql.GraphQLNonNull(SecondaryLinkInputType));

//# sourceMappingURL=secondary-links.input-type.js.map