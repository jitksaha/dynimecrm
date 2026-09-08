"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "paginateByIdCursor", {
    enumerable: true,
    get: function() {
        return paginateByIdCursor;
    }
});
const _parsemetadatarestpaginationutil = require("./parse-metadata-rest-pagination.util");
const _paginatemetadataquerybuilderutil = require("../../../../metadata-modules/pagination/utils/paginate-metadata-query-builder.util");
const paginateByIdCursor = async ({ repository, workspaceId, where, request })=>{
    const baseWhere = {
        ...where,
        workspaceId
    };
    const queryBuilder = repository.createQueryBuilder('metadata').where(baseWhere);
    const countQueryBuilder = queryBuilder.clone();
    const [page, totalCount] = await Promise.all([
        (0, _paginatemetadataquerybuilderutil.paginateMetadataQueryBuilder)({
            queryBuilder,
            alias: 'metadata',
            pagination: (0, _parsemetadatarestpaginationutil.parseMetadataRestPagination)(request)
        }),
        countQueryBuilder.getCount()
    ]);
    return {
        items: page.items,
        pageInfo: page.pageInfo,
        totalCount
    };
};

//# sourceMappingURL=paginate-by-id-cursor.util.js.map