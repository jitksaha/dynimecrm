"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseMetadataRestPagination", {
    enumerable: true,
    get: function() {
        return parseMetadataRestPagination;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _parseendingbeforerestrequestutil = require("../../input-request-parsers/ending-before-parser-utils/parse-ending-before-rest-request.util");
const _parselimitrestrequestutil = require("../../input-request-parsers/limit-parser-utils/parse-limit-rest-request.util");
const _parsestartingafterrestrequestutil = require("../../input-request-parsers/starting-after-parser-utils/parse-starting-after-rest-request.util");
const parseMetadataRestPagination = (request)=>{
    const startingAfter = (0, _parsestartingafterrestrequestutil.parseStartingAfterRestRequest)(request);
    const endingBefore = (0, _parseendingbeforerestrequestutil.parseEndingBeforeRestRequest)(request);
    if ((0, _utils.isDefined)(startingAfter) && (0, _utils.isDefined)(endingBefore)) {
        throw new _common.BadRequestException(`'starting_after' and 'ending_before' cannot be used together.`);
    }
    const invalidCursor = [
        startingAfter,
        endingBefore
    ].find((cursor)=>(0, _utils.isDefined)(cursor) && !(0, _uuid.validate)(cursor));
    if ((0, _utils.isDefined)(invalidCursor)) {
        throw new _common.BadRequestException(`Invalid cursor: ${invalidCursor}`);
    }
    // The raw value is checked before parsing because parseLimitRestRequest
    // clamps to the maximum first, which would turn a fractional value above
    // the cap into a valid integer limit.
    const requestedLimit = request.query?.limit;
    if ((0, _guards.isNonEmptyString)(requestedLimit) && !Number.isInteger(+requestedLimit)) {
        throw new _common.BadRequestException(`limit '${requestedLimit}' is invalid. Should be an integer`);
    }
    return {
        limit: (0, _parselimitrestrequestutil.parseLimitRestRequest)(request),
        direction: (0, _utils.isDefined)(endingBefore) ? 'backward' : 'forward',
        afterId: startingAfter,
        beforeId: endingBefore
    };
};

//# sourceMappingURL=parse-metadata-rest-pagination.util.js.map