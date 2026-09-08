"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseCorePath", {
    enumerable: true,
    get: function() {
        return parseCorePath;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const parseCorePath = (request)=>{
    const queryAction = request.path.replace(new RegExp(`^/${_types.ApiPath.Rest}`), '').split('/').filter(Boolean);
    // Restore is the only action on a single record, so /{object}/{id}/restore
    // is the one path with a third segment. It is mounted on PATCH alone;
    // allowing the segment on other methods would let a restore-shaped path
    // through their wildcard routes, where DELETE would read the id as a
    // destroy target.
    const isRestoreRequest = request.method === 'PATCH' && queryAction[queryAction.length - 1] === 'restore';
    const maximumSegmentCount = isRestoreRequest ? 3 : 2;
    if (queryAction.length > maximumSegmentCount) {
        throw new _common.BadRequestException(`Query path '${request.path}' invalid. Valid examples: /${_types.ApiPath.Rest}/companies/id or /${_types.ApiPath.Rest}/companies or /${_types.ApiPath.Rest}/batch/companies`);
    }
    if (queryAction.length === 0) {
        throw new _common.BadRequestException(`Query path '${request.path}' invalid. Valid examples: /${_types.ApiPath.Rest}/companies/id or /${_types.ApiPath.Rest}/companies or /${_types.ApiPath.Rest}/batch/companies`);
    }
    if (queryAction.length === 1) {
        return {
            object: queryAction[0]
        };
    }
    if (queryAction[0] === 'batch') {
        return {
            object: queryAction[1]
        };
    }
    if (queryAction[1] === 'duplicates' || queryAction[1] === 'groupBy' || queryAction[1] === 'merge') {
        return {
            object: queryAction[0]
        };
    }
    if (isRestoreRequest) {
        const recordId = queryAction.length === 3 ? queryAction[1] : undefined;
        if ((0, _utils.isDefined)(recordId) && !(0, _utils.isValidUuid)(recordId)) {
            throw new _common.BadRequestException(`'${recordId}' is not a valid UUID`);
        }
        return {
            object: queryAction[0],
            id: recordId
        };
    }
    const recordId = queryAction[1];
    if (!(0, _utils.isValidUuid)(recordId)) {
        throw new _common.BadRequestException(`'${recordId}' is not a valid UUID`);
    }
    return {
        object: queryAction[0],
        id: recordId
    };
};

//# sourceMappingURL=parse-core-path.utils.js.map