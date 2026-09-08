"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseGraphqlMetadataPagination", {
    enumerable: true,
    get: function() {
        return parseGraphqlMetadataPagination;
    }
});
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _cursorsutil = require("../../../api/graphql/graphql-query-runner/utils/cursors.util");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const DEFAULT_METADATA_GRAPHQL_PAGE_SIZE = 10;
const MAX_METADATA_GRAPHQL_PAGE_SIZE = 1000;
const decodeCursorIdOrThrow = (cursor)=>{
    let cursorData;
    try {
        cursorData = (0, _cursorsutil.decodeCursor)(cursor);
    } catch  {
        throw new _graphqlerrorsutil.UserInputError(`Invalid cursor: ${cursor}`);
    }
    if (typeof cursorData !== 'object' || cursorData === null || Array.isArray(cursorData) || typeof cursorData.id !== 'string' || !(0, _uuid.validate)(cursorData.id)) {
        throw new _graphqlerrorsutil.UserInputError(`Invalid cursor: ${cursor}`);
    }
    return cursorData.id;
};
const parseGraphqlMetadataPagination = ({ paging, defaultResultSize = DEFAULT_METADATA_GRAPHQL_PAGE_SIZE, maxResultsSize = MAX_METADATA_GRAPHQL_PAGE_SIZE })=>{
    const { first, last, after, before } = paging ?? {};
    if ((0, _utils.isDefined)(first) && (0, _utils.isDefined)(last)) {
        throw new _graphqlerrorsutil.UserInputError('Cannot use both first and last');
    }
    if ((0, _utils.isDefined)(first) && (0, _utils.isDefined)(before)) {
        throw new _graphqlerrorsutil.UserInputError('Cannot use first with before');
    }
    if ((0, _utils.isDefined)(last) && (0, _utils.isDefined)(after)) {
        throw new _graphqlerrorsutil.UserInputError('Cannot use last with after');
    }
    if ((0, _utils.isDefined)(after) && (0, _utils.isDefined)(before)) {
        throw new _graphqlerrorsutil.UserInputError('Cannot use both after and before');
    }
    if ((0, _utils.isDefined)(first) && first < 0 || (0, _utils.isDefined)(last) && last < 0) {
        throw new _graphqlerrorsutil.UserInputError('Page size cannot be negative');
    }
    const limit = first ?? last ?? defaultResultSize;
    if (limit > maxResultsSize) {
        throw new _graphqlerrorsutil.UserInputError(`Requested page size of ${limit} exceeds the maximum size of ${maxResultsSize}`);
    }
    return {
        limit,
        direction: (0, _utils.isDefined)(last) || (0, _utils.isDefined)(before) ? 'backward' : 'forward',
        afterId: (0, _utils.isDefined)(after) ? decodeCursorIdOrThrow(after) : undefined,
        beforeId: (0, _utils.isDefined)(before) ? decodeCursorIdOrThrow(before) : undefined
    };
};

//# sourceMappingURL=parse-graphql-metadata-pagination.util.js.map