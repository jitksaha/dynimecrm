"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findManyItemsWithCursorPagination", {
    enumerable: true,
    get: function() {
        return findManyItemsWithCursorPagination;
    }
});
const _paginatemetadataitemsbyidutil = require("./paginate-metadata-items-by-id.util");
const _parsegraphqlmetadatapaginationutil = require("./parse-graphql-metadata-pagination.util");
const _tocursorconnectionutil = require("./to-cursor-connection.util");
const findManyItemsWithCursorPagination = ({ items, paging, defaultResultSize, maxResultsSize })=>{
    const pagination = (0, _parsegraphqlmetadatapaginationutil.parseGraphqlMetadataPagination)({
        paging,
        defaultResultSize,
        maxResultsSize
    });
    return (0, _tocursorconnectionutil.toCursorConnection)((0, _paginatemetadataitemsbyidutil.paginateMetadataItemsById)({
        items,
        pagination
    }));
};

//# sourceMappingURL=find-many-items-with-cursor-pagination.util.js.map