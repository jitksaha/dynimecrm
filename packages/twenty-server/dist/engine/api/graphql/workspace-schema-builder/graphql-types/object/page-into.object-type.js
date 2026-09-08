"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PageInfoType", {
    enumerable: true,
    get: function() {
        return PageInfoType;
    }
});
const _graphql = require("graphql");
const _scalars = require("../scalars");
const PageInfoType = new _graphql.GraphQLObjectType({
    name: 'PageInfo',
    fields: {
        startCursor: {
            type: _scalars.ConnectionCursorScalarType
        },
        endCursor: {
            type: _scalars.ConnectionCursorScalarType
        },
        hasNextPage: {
            type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean)
        },
        hasPreviousPage: {
            type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean)
        }
    }
});

//# sourceMappingURL=page-into.object-type.js.map