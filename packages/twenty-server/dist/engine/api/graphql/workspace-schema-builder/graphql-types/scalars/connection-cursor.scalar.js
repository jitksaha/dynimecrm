"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectionCursorScalarType", {
    enumerable: true,
    get: function() {
        return ConnectionCursorScalarType;
    }
});
const _graphql = require("graphql");
const _graphqlerrorsutil = require("../../../../../core-modules/graphql/utils/graphql-errors.util");
const ConnectionCursorScalarType = new _graphql.GraphQLScalarType({
    name: 'ConnectionCursor',
    description: 'Cursor for paging through collections',
    serialize (value) {
        if (typeof value !== 'string') {
            throw new _graphqlerrorsutil.ValidationError('ConnectionCursor must be a string');
        }
        return value;
    },
    parseValue (value) {
        if (typeof value !== 'string') {
            throw new _graphqlerrorsutil.ValidationError('ConnectionCursor must be a string');
        }
        return value;
    },
    parseLiteral (ast) {
        if (ast.kind !== _graphql.Kind.STRING) {
            throw new _graphqlerrorsutil.ValidationError('ConnectionCursor must be a string');
        }
        return ast.value;
    }
});

//# sourceMappingURL=connection-cursor.scalar.js.map