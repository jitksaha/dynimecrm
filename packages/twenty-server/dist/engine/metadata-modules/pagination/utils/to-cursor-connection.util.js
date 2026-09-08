"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toCursorConnection", {
    enumerable: true,
    get: function() {
        return toCursorConnection;
    }
});
const _utils = require("twenty-shared/utils");
const _cursorsutil = require("../../../api/graphql/graphql-query-runner/utils/cursors.util");
const toCursorConnection = ({ items, pageInfo })=>({
        edges: items.map((node)=>({
                node,
                cursor: (0, _cursorsutil.encodeCursorData)({
                    id: node.id
                })
            })),
        pageInfo: {
            hasNextPage: pageInfo.hasNextPage,
            hasPreviousPage: pageInfo.hasPreviousPage,
            startCursor: (0, _utils.isDefined)(pageInfo.startCursor) ? (0, _cursorsutil.encodeCursorData)({
                id: pageInfo.startCursor
            }) : null,
            endCursor: (0, _utils.isDefined)(pageInfo.endCursor) ? (0, _cursorsutil.encodeCursorData)({
                id: pageInfo.endCursor
            }) : null
        }
    });

//# sourceMappingURL=to-cursor-connection.util.js.map