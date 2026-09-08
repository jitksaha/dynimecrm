"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findManyWithCursorPagination", {
    enumerable: true,
    get: function() {
        return findManyWithCursorPagination;
    }
});
const _paginatemetadataquerybuilderutil = require("./paginate-metadata-query-builder.util");
const _parsegraphqlmetadatapaginationutil = require("./parse-graphql-metadata-pagination.util");
const _tocursorconnectionutil = require("./to-cursor-connection.util");
const findManyWithCursorPagination = async ({ queryBuilder, alias, paging, defaultResultSize, maxResultsSize })=>{
    const pagination = (0, _parsegraphqlmetadatapaginationutil.parseGraphqlMetadataPagination)({
        paging,
        defaultResultSize,
        maxResultsSize
    });
    return (0, _tocursorconnectionutil.toCursorConnection)(await (0, _paginatemetadataquerybuilderutil.paginateMetadataQueryBuilder)({
        queryBuilder,
        alias,
        pagination
    }));
};

//# sourceMappingURL=find-many-with-cursor-pagination.util.js.map