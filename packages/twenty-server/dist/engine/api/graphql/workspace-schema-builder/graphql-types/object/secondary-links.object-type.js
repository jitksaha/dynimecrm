"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SecondaryLinksObjectType", {
    enumerable: true,
    get: function() {
        return SecondaryLinksObjectType;
    }
});
const _graphql = require("graphql");
const SecondaryLinkObjectType = new _graphql.GraphQLObjectType({
    name: 'SecondaryLink',
    fields: {
        label: {
            type: _graphql.GraphQLString
        },
        url: {
            type: _graphql.GraphQLString
        }
    }
});
const SecondaryLinksObjectType = new _graphql.GraphQLList(new _graphql.GraphQLNonNull(SecondaryLinkObjectType));

//# sourceMappingURL=secondary-links.object-type.js.map