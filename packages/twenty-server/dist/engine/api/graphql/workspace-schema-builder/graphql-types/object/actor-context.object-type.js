"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ActorContextObjectType", {
    enumerable: true,
    get: function() {
        return ActorContextObjectType;
    }
});
const _graphql = require("graphql");
const ActorContextObjectType = new _graphql.GraphQLObjectType({
    name: 'ActorContext',
    fields: {
        provider: {
            type: _graphql.GraphQLString
        }
    }
});

//# sourceMappingURL=actor-context.object-type.js.map