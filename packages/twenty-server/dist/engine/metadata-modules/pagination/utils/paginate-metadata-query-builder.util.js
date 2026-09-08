"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "paginateMetadataQueryBuilder", {
    enumerable: true,
    get: function() {
        return paginateMetadataQueryBuilder;
    }
});
const _utils = require("twenty-shared/utils");
const _buildmetadatacursorpageutil = require("./build-metadata-cursor-page.util");
const paginateMetadataQueryBuilder = async ({ queryBuilder, alias, pagination })=>{
    const isBackwardPagination = pagination.direction === 'backward';
    queryBuilder.orderBy(`"${alias}"."id"`, isBackwardPagination ? 'ASC' : 'DESC');
    if ((0, _utils.isDefined)(pagination.afterId)) {
        queryBuilder.andWhere(`"${alias}"."id" < :metadataPaginationCursorId`, {
            metadataPaginationCursorId: pagination.afterId
        });
    }
    if ((0, _utils.isDefined)(pagination.beforeId)) {
        queryBuilder.andWhere(`"${alias}"."id" > :metadataPaginationCursorId`, {
            metadataPaginationCursorId: pagination.beforeId
        });
    }
    const fetchedItems = await queryBuilder.take(pagination.limit + 1).getMany();
    return (0, _buildmetadatacursorpageutil.buildMetadataCursorPage)({
        fetchedItems,
        pagination
    });
};

//# sourceMappingURL=paginate-metadata-query-builder.util.js.map