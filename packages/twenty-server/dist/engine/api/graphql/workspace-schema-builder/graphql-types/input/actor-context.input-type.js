"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ActorContextInputType", {
    enumerable: true,
    get: function() {
        return ActorContextInputType;
    }
});
const _graphql = require("graphql");
const ActorContextInputType = new _graphql.GraphQLInputObjectType({
    name: 'ActorContextInput',
    fields: {
        provider: {
            type: _graphql.GraphQLString
        }
    }
});

//# sourceMappingURL=actor-context.input-type.js.map